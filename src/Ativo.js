const mongoose = require('mongoose');

const AtivoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  modelo: { type: String },
  numeroSerie: { type: String },
  versao: { type: String },
  caracteristicas: { type: String },
  observacao: { type: String },
  funcionarioCpf: { type: String, required: true }
});

module.exports = mongoose.model('Ativo', AtivoSchema);