const axios = require('axios');

export function login(coren, senha) {
  // faz o login do enfermeiro e recebe um token jwt
  const enfermeiro = { coren, senha };
  const corpoChamada = { tipo: "enfermeiros", user: enfermeiro }

  return axios.post('https://us-central1-vacinapp-1.cloudfunctions.net/authServer/login', corpoChamada).then(response => {
    return response;
  }).catch(error => {
    console.log(error);
    return error;
  })
}

export function enviaRegistro(nome, email, coren, senha, admin) {
  // registra o enfermeiro no banco de dados
  const enfermeiro = { nome, email, coren, senha, admin }
  return axios.post('https://us-central1-vacinapp-1.cloudfunctions.net/server/api/enfermeiros', enfermeiro)
  .then(response => response)
  .catch(err => err);
}

export function getByField(field, value, token) {
  // procura se existe algum enfermeiro com coren ou email já existente no banco
  let response = {}
  return axios.get(`https://us-central1-vacinapp-1.cloudfunctions.net/server/api/enfermeiros/${field}/${value}`, {headers: { "Authorization": `Bearer ${token}` }}).then((res) => {
    console.log(res)
    response = { registros: Array.from(res.data) }
    console.log(response)
    return response;
  }).catch(err => {
    response = { erro: err }
    return response;
  })
}