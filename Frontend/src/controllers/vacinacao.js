import jwt_decode from "jwt-decode";

const axios = require('axios');

export function cadastraVacinacao(vacina, paciente, dataRetorno, token) {
  // faz o decode do token do infermeiro para pegar o nome e o coren do mesmo
  const enfermeiroInfo = jwt_decode(token);

  // pega as informações recebidas e constroi o corpo da chamdada
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

  // chama a api para fazer o registro da vacinação no banco de dados
  return axios.post('https://us-central1-vacinapp-1.cloudfunctions.net/server/api/vacinacao', payload, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => response.data)
  .catch(err => err.response.data);
}

// NÃO IMPLEMENTADA
export async function estaConcluida(id, token) {
  // função para verificar se a vacina está concluida para fechar o código QR e resetar o formulário de vacinação
  return axios.get(`https://us-central1-vacinapp-1.cloudfunctions.net/api/vacinacao/concluida/${id}`, {headers: { "Authorization": `Bearer ${token}` }})
  .then(response => response.data)
  .catch(err => err);
}