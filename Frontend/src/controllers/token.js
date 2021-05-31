const axios = require('axios');

export function tokenValidation(token) {
  // chama a api de validação de token do backend
  const corpoChamada = { tipo: "enfermeiros", token };
  return axios.post('http://localhost:5000/validation', corpoChamada)
  .then(response => 200)
  .catch(error => 403);
}