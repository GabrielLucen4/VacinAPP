require('dotenv').config();

const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const pacienteRoute = require('./routes/paciente');
const enfermeiroRoute = require('./routes/enfermeiro');
const vacinaRoute = require('./routes/vacina');
const vacinacaoRoute = require('./routes/vacinacao');

const app = express();
app.use(cors());
app.use(express.json());

const user_db = process.env.MONGODB_USER;
const pass_db = process.env.MONGODB_PASSWORD;
const cluster_db = process.env.MONGODB_CLUSTER;
const name_db = process.env.MONGODB_DATABASE;

mongoose.connect(`mongodb+srv://${user_db}:${pass_db}@${cluster_db}.nqngu.mongodb.net/${name_db}?retryWrites=true&w=majority`)
.then(() => {
  console.log("Conexão OK");
}).catch((err) => {
  console.log("Conexão NOK");
  console.log(err)
})

app.use('/api/pacientes', pacienteRoute);
app.use('/api/enfermeiros', enfermeiroRoute);
app.use('/api/vacinas', vacinaRoute);
app.use('/api/vacinacao', vacinacaoRoute);

module.exports = app;