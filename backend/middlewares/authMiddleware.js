const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token faltante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Asumiendo que el token decodificado contiene el ID del usuario
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = {
  verificarToken
};
