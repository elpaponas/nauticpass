const express = require('express');
const router = express.Router();
const db = require('../path/to/db'); // Asegúrate de ajustar la ruta según tu estructura de archivos

// Ruta para obtener todos los colaboradores
router.get('/colaboradores', (req, res) => {
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

// Otras rutas CRUD para colaboradores (POST, PUT, DELETE) podrían implementarse de manera similar

module.exports = router;
