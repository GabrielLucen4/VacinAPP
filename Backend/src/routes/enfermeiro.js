const Enfermeiro = require('../models/enfermeiro');

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

function validaEnfermeiro(enfermeiro) {
  const resultado = [];

  if (paciente.nome.split(' ').length < 2) {
    resultado.push({mensagem: 'Nome do enfermeiro deve conter pelo menos um sobrenome'});
  }

  const corenRegex = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[a-zA-Z]{2})$/;
  if (!corenRegex.test(enfermeiro.coren) || !enfermeiro.coren.split('-').length === 2) {
    resultado.push({mensagem: 'Coren inválido! Siga o modelo: 000.000.000-SP'});
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(enfermeiro.email.toLowerCase())) {
    resultado.push({mensagem: 'E-mail do enfermeiro é inválido.'});
  }

  if (enfermeiro.senha.length < 5) {
    resultado.push({mensage: 'Senha do enfermeiro é muito curta'});
  }
}

router.post('', (req, res, next) => {
  const enfermeiro = new Enfermeiro({
    nome: req.body.nome.trim(),
    email: req.body.email.trim(),
    coren: req.body.coren.trim(),
    senha: req.body.senha.trim(),
    admin: req.body.admin
  });

  const resultado = validaEnfermeiro(enfermeiro);
  if(resultado.length > 0) {
    res.status(400).json(resultado);
  } else {
    enfermeiro.save().then(enfermeiroInserido =>{
      res.status(201).json({
        mensagem: 'Enfermeiro(a) Inserido(a)',
        id: enfermeiroInserido._id
      });
    })
  }
});

router.post('/login', (req, res, next) => {
  Enfermeiro.find({coren: req.body.coren, senha: req.body.senha}).then(documents => {
    res.status(200).send(documents);
  })
});

router.get('/token/:refreshToken', (req, res, next) => {
  Enfermeiro.find({ refreshToken: req.params.refreshToken }).then(response => {
    res.status(200).send(response);
  }).catch(error => {
    console.log(error)
  })
})

router.patch('/token', authenticateToken, (req, res, next) => {
  Enfermeiro.findOneAndUpdate({ _id: req.body._id }, { refreshToken: req.body.refreshToken }).then(response => {
    res.status(200).send(response);
  }).catch(error => {
    console.log(error)
  })
})

router.get('', authenticateToken, (req, res, next) => {
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

router.get('/email/:email', authenticateToken, (req, res, next) => {
  Enfermeiro.find({email: req.params.email}).then(documents => {
    const enfermeiros = [];
    for (let enfermeiro of documents) {
      const {senha, ...enfermeiroSemSenha} = enfermeiro._doc;
      enfermeiros.push(enfermeiroSemSenha);
    }
    console.log(enfermeiros);
    res.status(200).json(enfermeiros);
  })
});

router.get('/coren/:coren', authenticateToken, (req, res, next) => {
  Enfermeiro.find({coren: req.params.coren}).then(documents => {
    const enfermeiros = [];
    for (let enfermeiro of documents) {
      const {senha, ...enfermeiroSemSenha} = enfermeiro._doc;
      enfermeiros.push(enfermeiroSemSenha);
    }
    console.log(enfermeiros);
    res.status(200).json(enfermeiros);
  })
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next()
  })
}

module.exports = router;