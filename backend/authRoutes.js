const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('./db');

// Endpoint para iniciar sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe en la base de datos
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        res.status(500).json({ status: 'error', message: 'Error al buscar usuario' });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ status: 'error', message: 'Usuario no encontrado' });
        return;
      }

      // Verificar contraseña
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });
        return;
      }

      // Generar token JWT
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'secret_key', {
        expiresIn: '1h' // Tiempo de expiración del token (ejemplo: 1 hora)
      });

      res.json({ status: 'success', token });
    }
  );
});

module.exports = router;
