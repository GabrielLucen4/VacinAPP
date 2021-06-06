const axios = require('axios');

export function getPacientes() {
  return axios.get('https://us-central1-vacinapp-1.cloudfunctions.net/server/api/pacientes')
  .then(response => response.data)
  .catch(err => err);
}