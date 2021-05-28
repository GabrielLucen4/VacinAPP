const axios = require('axios');

export function tokenValidation(token) {
  const corpoChamada = { tipo: "enfermeiros", token };
  return axios.post('http://localhost:5000/validation', corpoChamada)
  .then(response => 200)
  .catch(error => 403);
}