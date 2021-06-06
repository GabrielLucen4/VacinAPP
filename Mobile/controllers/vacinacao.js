import jwt_decode from "jwt-decode";
const axios = require('axios');

export function cadastraVacinacao(dataQrCode, token) {
  // função que o leitor de QR code chama
  const data = dataQrCode.split(' '); // 123abc 0

  const payload = {
    id: data[0],
    dose: data[1],
    paciente: jwt_decode(token)._id
  }

  return axios.put('https://us-central1-vacinapp-1.cloudfunctions.net/server/api/vacinacao', payload, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => 200)
  .catch(err => 400);
}

export async function getVacinacoes(token) {
  return axios.get(`https://us-central1-vacinapp-1.cloudfunctions.net/server/api/vacinacao/${jwt_decode(token)._id}`, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => response.data)
  .catch(err => err);
}