const axios = require('axios');

export function enviaRegistro(nome, tipo, dose, lote, quantidade) {
  const vacina = { nome, tipo, dose, lote, quantidade }
  axios.post('http://localhost:4000/api/vacinas', vacina)
  .then(response => console.log(response))
  .catch(err => console.log(err));
}

export function getVacinas() {
  return axios.get('http://localhost:4000/api/vacinas')
  .then(response => response.data)
  .catch(err => err);
}