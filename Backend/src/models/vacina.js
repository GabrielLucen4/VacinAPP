const mongoose = require('mongoose');

const vacinaSchema = mongoose.Schema({
  nome: {type: String, required: true},
  tipo: {type: String, required: true},
  dose: {type: String, required: true},
  lote: {type: String, required: true},
  quantidade: {type: String, required: true}
})