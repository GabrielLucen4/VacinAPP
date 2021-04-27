const axios = require('axios');

export function enviaRegistro(nome, cpf, dataNasc, email, senha) {
  const paciente = { nome, cpf, dataNasc, email,senha }
  axios.post('http://10.0.1.0:4000/api/pacientes', paciente)
  .then(response => console.log(response))
  .catch(err => console.log(err));
}