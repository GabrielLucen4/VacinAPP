import jwt_decode from "jwt-decode";

const axios = require('axios');

export function cadastraVacinacao(vacina, paciente, dataRetorno, token) {
  const enfermeiroInfo = jwt_decode(token);

  const payload = {
    paciente: paciente._id,
    doenca: vacina.doenca,
    doses: vacina.dose,
    vacina: {
      fabricante: vacina.fabricante,
      lote: vacina.lote,
      enfermeiroNome: enfermeiroInfo.nome,
      enfermeiroCoren: enfermeiroInfo.coren,
      concluido: false,
    },
    dataRetorno: dataRetorno,
    prazoMaximoEntreDoses: vacina.prazoMaximoEntreDoses,
    tempoTotalProtecao: vacina.tempoTotalProtecao
  }
  console.log(payload);

  return axios.post('http://localhost:4000/api/vacinacao', payload, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => response.data)
  .catch(err => err.response.data);
}

export async function estaConcluida(id, token) {
  return axios.get(`http://localhost:4000/api/vacinacao/concluida/${id}`, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => response.data)
  .catch(err => err);
}