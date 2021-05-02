const Enfermeiro = require('../models/enfermeiro');

const express = require('express');
const router = express.Router();

router.post('', (req, res, next) => {
  const enfermeiro = new Enfermeiro({
    nome: req.body.nome.trim(),
    email: req.body.email.trim(),
    coren: req.body.coren.trim(),
    senha: req.body.senha.trim(),
    admin: req.body.admin
  });

  enfermeiro.save().then(enfermeiroInserido =>{
    res.status(201).json({
      mensagem: 'Enfermeiro(a) Inserido(a)',
      id: enfermeiroInserido._id
    });
  })
});

router.get('', (req, res, next) => {
  Enfermeiro.find().then(documents => {
    const enfermeiros = [];
    for (let enfermeiro of documents) {
      const {senha, ...enfermeiroSemSenha} = enfermeiro._doc;
      enfermeiros.push(enfermeiroSemSenha);
    }
    console.log(enfermeiros);
    res.status(200).json(enfermeiros);
  })
});

module.exports = router;