const axios = require('axios');

export function login(coren, senha) {
  const enfermeiro = { coren, senha };
  const corpoChamada = { tipo: "enfermeiros", user: enfermeiro }

  return axios.post('http://localhost:5000/login', corpoChamada).then(response => {
    return response;
  }).catch(error => {
    console.log(error);
    return error;
  })
}

export function enviaRegistro(nome, email, coren, senha, admin) {
  const enfermeiro = { nome, email, coren, senha, admin }
  axios.post('http://localhost:4000/api/enfermeiros', enfermeiro)
  .then(response => console.log(response))
  .catch(err => console.log(err));
}

export function getByField(field, value, token) {
  let response = {}
  return axios.get(`http://localhost:4000/api/enfermeiros/${field}/${value}`, {headers: { "Authorization": `Bearer ${token}` }}).then((res) => {
    console.log(res)
    response = { registros: Array.from(res.data) }
    console.log(response)
    return response;
  }).catch(err => {
    response = { erro: err }
    return response;
  })
}