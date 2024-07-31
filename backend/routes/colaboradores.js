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

// Verificar si el numeroColega ya existe
router.get('/checkNumeroColega/:numeroColega', async (req, res) => {
  try {
    const { numeroColega } = req.params;
    const query = 'SELECT COUNT(*) AS count FROM colaboradores WHERE numeroColega = ?';
    const [rows] = await db.execute(query, [numeroColega]);
    res.json({ exists: rows[0].count > 0 });
  } catch (error) {
    console.error('Error checking numeroColega:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Verificar si el codigo ya existe
router.get('/checkCodigo/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const query = 'SELECT COUNT(*) AS count FROM colaboradores WHERE codigo = ?';
    const [rows] = await db.execute(query, [codigo]);
    res.json({ exists: rows[0].count > 0 });
  } catch (error) {
    console.error('Error checking codigo:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Verificar si el numeroColega ya existe (excluyendo un id específico)
router.get('/checkNumeroColega/:numeroColega', async (req, res) => {
  try {
    const { numeroColega } = req.params;
    const { excludeId } = req.query;
    const query = 'SELECT COUNT(*) AS count FROM colaboradores WHERE numeroColega = ? AND id != ?';
    const [rows] = await db.execute(query, [numeroColega, excludeId]);
    res.json({ exists: rows[0].count > 0 });
  } catch (error) {
    console.error('Error checking numeroColega:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Verificar si el codigo ya existe (excluyendo un id específico)
router.get('/checkCodigo/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const { excludeId } = req.query;
    const query = 'SELECT COUNT(*) AS count FROM colaboradores WHERE codigo = ? AND id != ?';
    const [rows] = await db.execute(query, [codigo, excludeId]);
    res.json({ exists: rows[0].count > 0 });
  } catch (error) {
    console.error('Error checking codigo:', error);
    res.status(500).send('Internal Server Error');
  }
});
