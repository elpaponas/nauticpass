const mongoose = require('mongoose');

const entregaSchema = new mongoose.Schema({
  colegaEntrega: { type: String, required: true },
  numeroColega: { type: String, required: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  puesto: { type: String, required: true },
  fecha: { type: Date, required: true },
  cantidad: { type: Number, required: true },
  tipoBoleto: { type: String, required: true }
});

const Entrega = mongoose.model('Entrega', entregaSchema);

module.exports = Entrega;
