const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
const enfermeiroSchema = mongoose.Schema({
  nome: {type: String, require: true},
  email: {type: String, require: true},
  coren: {type: String, require: true},
  senha: {type: String, require: true},
  admin: {type: Boolean, require: true},
  refreshToken: {type: String, require: false}
})

module.exports = mongoose.model('enfermeiro', enfermeiroSchema);