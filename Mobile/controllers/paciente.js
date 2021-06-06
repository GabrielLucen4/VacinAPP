const axios = require('axios');

export function enviaRegistro(nome, cpf, dataNasc, email, senha) {
  // cadastro do paciente (signUp)
  const paciente = { nome, cpf, dataNasc, email, senha }
  return axios.post('https://us-central1-vacinapp-1.cloudfunctions.net/server/api/pacientes', paciente)
  .then(response => console.log(response))
  .catch(err => err.response.data);
}

export function login(email, senha) {
  const user = { email, senha };
  const payload = { tipo: "pacientes", user };

  return axios.post('https://us-central1-vacinapp-1.cloudfunctions.net/authServer/login', payload)
  .then(response => response.data.accessToken)
  .catch(err => console.log(err))
}

export function tokenValidation(token) {
  const corpoChamada = { token };
  console.log(corpoChamada)
  return axios.post('https://us-central1-vacinapp-1.cloudfunctions.net/authServer/validation', corpoChamada)
  .then(response => 200)
  .catch(error => 403);
}