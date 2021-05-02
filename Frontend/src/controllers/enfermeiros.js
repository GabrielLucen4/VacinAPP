const axios = require('axios');

export function enviaRegistro(nome, email, coren, senha, admin) {
  const enfermeiro = { nome, email, coren, senha, admin }
  axios.post('http://10.0.1.0:4000/api/enfermeiros', enfermeiro)
  .then(response => console.log(response))
  .catch(err => console.log(err));
}