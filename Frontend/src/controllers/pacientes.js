const axios = require('axios');

export function getPacientes() {
  return axios.get('http://localhost:4000/api/pacientes')
  .then(response => response.data)
  .catch(err => err);
}