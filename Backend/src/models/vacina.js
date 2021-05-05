const mongoose = require('mongoose');

const vacinaSchema = mongoose.Schema({
  nome: {type: String, required: true},
  tipo: {type: String, required: false},
  dose: {type: Number, required: true},
  lote: {type: String, required: true},
  quantidade: {type: Number, required: true}
})
module.exports = mongoose.model("vacina",vacinaSchema);