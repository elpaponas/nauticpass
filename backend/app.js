const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs'); // Asegúrate de importar bcrypt
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

const { verificarToken } = require('./middlewares/authMiddleware');

// Ruta para obtener el usuario autenticado (requiere autenticación)
app.get('/api/auth/user', verificarToken, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const query = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(query, [decoded.id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });

      res.json(results[0]);
    });
  });
});



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

// Ruta para obtener todos los usuarios
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

// Ruta para agregar un nuevo usuario
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

// Ruta para actualizar un usuario existente
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

// Ruta para habilitar un usuario
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

// Ruta para deshabilitar un usuario
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

// Ruta para eliminar un usuario
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

// Ruta para obtener todas las entregas
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

// Ruta para agregar una nueva entrega
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

// Ruta para eliminar una entrega
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
      res.status(404).json({ status: 'error', message: 'Delivery not found' });
      return;
    }
    res.json({ status: 'success', message: 'Delivery deleted successfully', id: entregaId });
  });
});

// Ruta para actualizar una entrega existente
app.put('/api/entregas/:id', (req, res) => {
  const entregaId = req.params.id;
  const { colegaEntrega, numeroColega, nombres, apellidos, cantidad, fecha, tipoBoleto } = req.body;
  const query = 'UPDATE entregas SET colegaEntrega = ?, numeroColega = ?, nombres = ?, apellidos = ?, cantidad = ?, fecha = ?, tipoBoleto = ? WHERE id = ?';
  db.query(query, [colegaEntrega, numeroColega, nombres, apellidos, cantidad, fecha, tipoBoleto, entregaId], (err, result) => {
    if (err) {
      console.error('Error updating entrega in database:', err);
      res.status(500).json({ status: 'error', message: 'Error updating entrega in database' });
      return;
    }
    res.json({ status: 'success', message: 'Entrega updated successfully', id: entregaId });
  });
});


// Ruta para obtener todos los colaboradores
app.get('/api/colaboradores', (req, res) => {
  const query = 'SELECT * FROM colaboradores';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching colaboradores:', err);
      res.status(500).json({ error: 'Error fetching colaboradores' });
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar un nuevo colaborador
app.post('/api/colaboradores', (req, res) => {
  const { numeroColega, nombres, apellidos, puesto, codigo } = req.body;
  const query = 'INSERT INTO colaboradores (numeroColega, nombres, apellidos, puesto, codigo) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [numeroColega, nombres, apellidos, puesto, codigo], (err, result) => {
    if (err) {
      console.error('Error inserting into the database:', err);
      res.status(500).json({ status: 'error', message: 'Error adding colaborador to database' });
      return;
    }
    res.status(201).json({ status: 'success', message: 'Colaborador added successfully', id: result.insertId });
  });
});

// Ruta para eliminar un colaborador
app.delete('/api/colaboradores/:id', (req, res) => {
  const colaboradorId = req.params.id;
  const query = 'DELETE FROM colaboradores WHERE id = ?';
  db.query(query, [colaboradorId], (err, result) => {
    if (err) {
      console.error('Error deleting colaborador from database:', err);
      res.status(500).json({ status: 'error', message: 'Error deleting colaborador from database' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Colaborador not found' });
      return;
    }
    res.json({ status: 'success', message: 'Colaborador deleted successfully', id: colaboradorId });
  });
});

// Ruta para actualizar un colaborador existente
app.put('/api/colaboradores/:id', (req, res) => {
  const colaboradorId = req.params.id;
  const { numeroColega, nombres, apellidos, puesto, codigo } = req.body;
  const query = 'UPDATE colaboradores SET numeroColega = ?, nombres = ?, apellidos = ?, puesto = ?, codigo = ? WHERE id = ?';
  db.query(query, [numeroColega, nombres, apellidos, puesto, codigo, colaboradorId], (err, result) => {
    if (err) {
      console.error('Error updating colaborador in database:', err);
      res.status(500).json({ status: 'error', message: 'Error updating colaborador in database' });
      return;
    }
    res.json({ status: 'success', message: 'Colaborador updated successfully', id: colaboradorId });
  });
});


// Ruta para eliminar un colaborador
app.delete('/api/colaboradores/:id', (req, res) => {
  const colaboradorId = req.params.id;
  const query = 'DELETE FROM colaboradores WHERE id = ?';
  db.query(query, [colaboradorId], (err, result) => {
    if (err) {
      console.error('Error deleting collaborator from database:', err);
      res.status(500).json({ status: 'error', message: 'Error deleting collaborator from database' });
      return;
    }
    res.json({ status: 'success', message: 'Collaborator deleted successfully', id: colaboradorId });
  });
});
// Ruta GET para obtener datos del colega por número de colega
app.get('/api/colaboradores/:numeroColega', (req, res) => {
  const { numeroColega } = req.params;
  console.log('Solicitud para obtener datos del colega:', numeroColega); // Agrega este registro para verificar la solicitud

  const query = 'SELECT nombres, apellidos, puesto, codigo FROM colaboradores WHERE numeroColega = ?';
  db.query(query, [numeroColega], (err, results) => {
    if (err) {
      console.error('Error al obtener datos del colega:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Colega no encontrado' });
    }
  });
});



// Ejemplo de consulta SQL en Node.js
app.get('/api/colaboradores/:numeroColega', async (req, res) => {
  const { numeroColega } = req.params;
  try {
    const query = 'SELECT codigo FROM colaboradores WHERE numeroColega = ?';
    const results = await pool.query(query, [numeroColega]);
    if (results.length > 0) {
      res.json(results[0]); // Devuelve solo el primer resultado encontrado
    } else {
      res.status(404).json({ message: 'Colaborador no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener datos del colaborador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});