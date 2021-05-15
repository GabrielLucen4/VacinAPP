const axios = require('axios');

export function encryptQrCode(info, token) {
  console.log(token)
  return axios.post('http://localhost:4000/api/vacinacao/encrypt', info, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => response.data)
  .catch(err => err);
}