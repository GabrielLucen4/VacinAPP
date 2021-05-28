const axios = require('axios');

export function enviaRegistro(nome, cpf, dataNasc, email, senha) {
  const paciente = { nome, cpf, dataNasc, email,senha }
  axios.post('http://10.0.1.0:4000/api/pacientes', paciente)
  .then(response => console.log(response))
  .catch(err => console.log(err));
}

export function login(email, senha) {
  const user = { email, senha };
  const payload = { tipo: "pacientes", user };

  return axios.post('http://10.0.1.0:5000/login', payload)
  .then(response => response.data.accessToken)
  .catch(err => console.log(err))
}

export function tokenValidation(token) {
  const corpoChamada = { token };
  console.log(corpoChamada)
  return axios.post('http://10.0.1.0:5000/validation', corpoChamada)
  .then(response => 200)
  .catch(error => 403);
}