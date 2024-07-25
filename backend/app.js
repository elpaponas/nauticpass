const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Crear una instancia de Express
const app = express();

// Definir el puerto
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Reemplaza con tu contraseña si es necesario
  database: 'nauticpass' // Reemplaza con el nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Función para encriptar contraseñas
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(query, [usuario], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, role: user.role });
    });
  });
});

// Rutas para usuarios
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ status: 'error', message: 'Error querying the database' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/users', async (req, res) => {
  const { numeroColega, nombres, apellidos, puesto, role, usuario, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const query = 'INSERT INTO usuarios (numeroColega, nombres, apellidos, puesto, role, usuario, password, estado) VALUES (?, ?, ?, ?, ?, ?, ?, true)';
    db.query(query, [numeroColega, nombres, apellidos, puesto, role, usuario, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting into the database:', err);
        res.status(500).json({ status: 'error', message: 'Error adding user to database' });
        return;
      }
      res.json({ status: 'success', message: 'User added successfully', id: result.insertId });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ status: 'error', message: 'Error processing request' });
  }
});

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { numeroColega, nombres, apellidos, puesto, role, usuario, password } = req.body;
  const query = 'UPDATE usuarios SET numeroColega = ?, nombres = ?, apellidos = ?, puesto = ?, role = ?, usuario = ?, password = ? WHERE id = ?';
  db.query(query, [numeroColega, nombres, apellidos, puesto, role, usuario, password, userId], (err, result) => {
    if (err) {
      console.error('Error updating user in database:', err);
      res.status(500).json({ status: 'error', message: 'Error updating user in database' });
      return;
    }
    res.json({ status: 'success', message: 'User updated successfully', id: userId });
  });
});

app.put('/api/users/:id/enable', (req, res) => {
  const userId = req.params.id;
  const query = 'UPDATE usuarios SET estado = true WHERE id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error enabling user in database:', err);
      res.status(500).json({ status: 'error', message: 'Error enabling user in database' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ status: 'not_found', message: `User with id ${userId} not found` });
      return;
    }

    res.json({ status: 'success', message: 'User enabled successfully', id: userId });
  });
});

app.put('/api/users/:id/disable', (req, res) => {
  const userId = req.params.id;
  const query = 'UPDATE usuarios SET estado = false WHERE id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error disabling user in database:', err);
      res.status(500).json({ status: 'error', message: 'Error disabling user in database' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ status: 'not_found', message: `User with id ${userId} not found` });
      return;
    }

    res.json({ status: 'success', message: 'User disabled successfully', id: userId });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user from database:', err);
      res.status(500).json({ status: 'error', message: 'Error deleting user from database' });
      return;
    }
    res.json({ status: 'success', message: 'User deleted successfully', id: userId });
  });
});

// Rutas para entregas
app.get('/api/entregas', (req, res) => {
  const query = 'SELECT * FROM entregas';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching deliveries:', err);
      res.status(500).json({ error: 'Error fetching deliveries' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/entregas', (req, res) => {
  const { colegaEntrega, numeroColega, nombres, apellidos, puesto, fecha, cantidad, tipoBoleto } = req.body;
  const query = 'INSERT INTO entregas (colegaEntrega, numeroColega, nombres, apellidos, puesto, fecha, cantidad, tipoBoleto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [colegaEntrega, numeroColega, nombres, apellidos, puesto, fecha, cantidad, tipoBoleto], (err, result) => {
    if (err) {
      console.error('Error inserting into the database:', err);
      res.status(500).json({ status: 'error', message: 'Error adding delivery to database' });
      return;
    }
    res.status(201).json({ status: 'success', message: 'Delivery added successfully', id: result.insertId });
  });
});

app.delete('/api/entregas/:id', (req, res) => {
  const entregaId = req.params.id;
  const query = 'DELETE FROM entregas WHERE id = ?';
  db.query(query, [entregaId], (err, result) => {
    if (err) {
      console.error('Error deleting delivery from database:', err);
      res.status(500).json({ status: 'error', message: 'Error deleting delivery from database' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ status: 'not_found', message: `Delivery with id ${entregaId} not found` });
      return;
    }
    res.json({ status: 'success', message: 'Delivery deleted successfully', id: entregaId });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
