const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
const vacinacaoSchema = mongoose.Schema({
  paciente: { type: String, required: true },
  doenca: { type: String, required: true },
  doses: { type: Number, required: true },
  vacinas: { type: Array, required: true },
  dataRetorno: { type: String, required: false },
  prazoMaximoEntreDoses: { type: Number, required: true},
  tempoTotalProtecao: { type: Number, required: true }
});

module.exports = mongoose.model("vacinacao", vacinacaoSchema);