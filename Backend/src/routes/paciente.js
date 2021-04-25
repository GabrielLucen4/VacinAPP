const Paciente = require('../models/paciente');

const express = require('express');
const router = express.Router();

router.post('', (req, res, next) => {
  const paciente = new Paciente({
    nome: req.body.nome,
    cpf: req.body.cpf,
    email: req.body.email,
    dataNasc: req.body.dataNasc,
    senha: req.body.senha
  });
  console.log(paciente);
  paciente.save().then((pacienteInserido) => {
    res.status(201).json({
      mensagem: 'Paciente Inserido',
      id: pacienteInserido._id
    });
  });
});

router.get('', (req, res, next) => {
  Paciente.find().then(documents => {
    res.status(200).json({
      mensagem: 'Tudo OK',
      pacientes: documents
    });
  });
});

module.exports = router;