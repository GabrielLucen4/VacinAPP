const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
const pacienteSchema = mongoose.Schema({
  nome: {type: String, require: true},
  cpf: {type: String, require: true},
  email: {type: String, require: true},
  dataNasc: {type: String, require: true},
  senha: {type: String, require: true},
});

module.exports = mongoose.model('Paciente', pacienteSchema);