const { Sequelize, DataTypes } = require('sequelize');

// Conectar a la base de datos MySQL
const sequelize = new Sequelize('nauticpass', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Definir el modelo Entrega
const Entrega = sequelize.define('Entrega', {
  colegaEntrega: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numeroColega: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  puesto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipoBoleto: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = { sequelize, Entrega };
