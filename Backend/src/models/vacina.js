const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
const vacinaSchema = mongoose.Schema({
  doenca: {type: String, required: true},
  fabricante: {type: String, required: true},
  dose: {type: Number, required: true},
  lote: {type: String, required: true},
  quantidade: {type: Number, required: true},
  prazoMaximoEntreDoses: {type: Number, required: true},
  tempoTotalProtecao: {type: Number, required: true}
});

module.exports = mongoose.model("vacina", vacinaSchema);