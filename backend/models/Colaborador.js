const mongoose = require('mongoose');

const ColaboradorSchema = new mongoose.Schema({
  numeroColega: { type: String, required: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  puesto: { type: String },
  codigo: { type: String }
});

module.exports = mongoose.model('Colaborador', ColaboradorSchema);
