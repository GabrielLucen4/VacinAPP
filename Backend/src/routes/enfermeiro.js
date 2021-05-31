const { authenticateTokenEnfermeiro } = require('../tokenValidation');

const Enfermeiro = require('../models/enfermeiro');

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 15;

async function validaEnfermeiro(enfermeiro) {
  const resultado = [];

  if (enfermeiro.nome.split(' ').length < 2) {
    resultado.push({mensagem: 'Nome do enfermeiro deve conter pelo menos um sobrenome'});
  }

  const corenRegex = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[a-zA-Z]{2})$/;
  if (!corenRegex.test(enfermeiro.coren) || !enfermeiro.coren.split('-').length === 2) {
    resultado.push({mensagem: 'Coren inválido! Siga o modelo: 000.000.000-SP'});
  } else {
    const existeCoren = await Enfermeiro.findOne({ coren: enfermeiro.coren });

    console.log("coren", existeCoren)

    if (existeCoren) {
      resultado.push({mensagem: "COREN já cadastrado."});
    }
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(enfermeiro.email.toLowerCase())) {
    resultado.push({ mensagem: 'E-mail do enfermeiro é inválido.' });
  } else {
    const existeEmail =  await Enfermeiro.findOne({ email: enfermeiro.email });

    console.log("Email", existeEmail)

    if (existeEmail) {
      resultado.push({ mensagem: "E-mail já cadastrado." });
    }
  }

  if (enfermeiro.senha.length < 5) {
    resultado.push({mensage: 'Senha do enfermeiro é muito curta'});
  }

  return resultado;
}

router.post('', async (req, res, next) => {
  const enfermeiro = new Enfermeiro({
    nome: req.body.nome.trim(),
    email: req.body.email.trim(),
    coren: req.body.coren.trim(),
    senha: req.body.senha.trim(),
    admin: req.body.admin
  });

  console.log(enfermeiro)

  const resultado = await validaEnfermeiro(enfermeiro);
  console.log(resultado);
  if(resultado.length > 0) {
    res.status(400).json(resultado);
  } else {
    const senhaHash = await bcrypt.hash(enfermeiro.senha, saltRounds);
    enfermeiro.senha = senhaHash;
    enfermeiro.save().then(enfermeiroInserido =>{
      console.log(enfermeiroInserido)
      res.status(201).json({
        mensagem: 'Enfermeiro(a) Inserido(a)',
        id: enfermeiroInserido._id
      });
    })
  }
});

router.post('/login', (req, res, next) => {
  Enfermeiro.findOne({coren: req.body.coren}).then(async(documents) => {
    try {
      const resultado = await bcrypt.compare(req.body.senha, documents.senha);
      if (resultado) {
        res.status(200).json(documents);
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  })
});

router.get('/token/:refreshToken', (req, res, next) => {
  Enfermeiro.find({ refreshToken: req.params.refreshToken }).then(response => {
    res.status(200).send(response);
  }).catch(error => {
    console.log(error)
  })
})

router.patch('/token', authenticateTokenEnfermeiro, (req, res, next) => {
  Enfermeiro.findOneAndUpdate({ _id: req.body._id }, { refreshToken: req.body.refreshToken }).then(response => {
    res.status(200).send(response);
  }).catch(error => {
    console.log(error)
  })
})

router.get('', authenticateTokenEnfermeiro, (req, res, next) => {
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

router.get('/email/:email', authenticateTokenEnfermeiro, (req, res, next) => {
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

router.get('/coren/:coren', authenticateTokenEnfermeiro, (req, res, next) => {
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



module.exports = router;