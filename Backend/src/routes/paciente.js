const Paciente = require('../models/paciente');

const moment = require('moment');
const express = require('express');
const router = express.Router();


async function validaPaciente(paciente) {
  const resultado = [];


  if (paciente.nome.split(' ').length < 2) {
    resultado.push({mensagem: 'Nome do paciente precisa conter pelo menos um sobrenome.'});
  }

  if (paciente.cpf.length !== 14) {
    resultado.push({mensagem: 'CPF do paciente é inválido.'});
  } else {
    const cpfExiste = await Paciente.findOne({ cpf: paciente.cpf })

    if(Object.keys(cpfExiste).length !== 0){
      resultado.push({mensagem: "CPF já cadastrado."})
    }
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(paciente.email.toLowerCase())) {
    resultado.push({mensagem: 'E-mail do paciente é inválido.'});
  } else {
    const emailExiste = await Paciente.findOne({ email: paciente.email })

    if(Object.keys(emailExiste).length !== 0) {
      resultado.push({mensagem: "E-mail já cadastrado."})
    }
  }

  const date_regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  const dataEnvio = moment().format('YYYY-MM-DD');
  const dataValidacao = moment(paciente.dataNasc, 'DD/MM/YYYY').format('YYYY-MM-DD');
  if(!date_regex.test(paciente.dataNasc) || moment(dataValidacao).isAfter(dataEnvio)) {
    resultado.push({mensagem: 'Data de nascimento do paciente é inválida.'});
  }

  if(paciente.senha.length < 5) {
    resultado.push({mensagem: 'Senha do paciente é muito curta.'});
  }

  return resultado;
}


router.post('/login', (req, res, next) => {
  Paciente.find({email: req.body.email, senha: req.body.senha}).then(documents => {
    console.log(documents)
    res.status(200).json(documents);
  })
})

router.post('', async (req, res, next) => {
  console.log(req.body)
  const paciente = new Paciente({
    nome: req.body.nome.trim(),
    cpf: req.body.cpf.trim(),
    email: req.body.email.trim(),
    dataNasc: req.body.dataNasc.trim(),
    senha: req.body.senha.trim()
  });

  const resultado = await validaPaciente(paciente);
  if(resultado.length > 0){
    res.status(400).json(resultado);
  } else {
    paciente.save().then((pacienteInserido) => {
      res.status(201).json({
        mensagem: 'Paciente Inserido(a)',
        id: pacienteInserido._id
      });
    });
  }

});

router.get('', (req, res, next) => {

  Paciente.find().then(documents => {
    const pacientes = [];
    for (let paciente of documents) {
      const {senha, ...pacienteSemSenha} = paciente._doc;
      pacientes.push(pacienteSemSenha);
    }
    console.log(pacientes)
    res.status(200).json(pacientes);
  });
});

module.exports = router;