const mongoose = require('mongoose');

const FuncionarioSchema = new mongoose.Schema({
  cpf: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  ativos: {
    notebook: { type: Boolean, default: false },
    monitor1: { type: Boolean, default: false },
    monitor2: { type: Boolean, default: false },
    teclado: { type: Boolean, default: false },
    mouse: { type: Boolean, default: false },
    desktop: { type: Boolean, default: false },
    nobreak: { type: Boolean, default: false },
    headset: { type: Boolean, default: false },
    celular: { type: Boolean, default: false },
    acessorios: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('Funcionario', FuncionarioSchema);
