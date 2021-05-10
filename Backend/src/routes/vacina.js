const Vacina = require("../models/vacina");

const express = require('express');
const router = express.Router();

function validaVacina(vacina) {
  const resultados = []

  if (vacina.nome.length <= 0) {
    resultados.push({ mensagem: 'Nome vazio.' });
  }

  if (vacina.dose > 0) {
    resultados.push({ mensagem: 'Dose não pode ser menor ou igual a 0.' });
  }

  if (vacina.lote > 0) {
    resultados.push({ mensagem: 'Lote não pode estar vazio.' });
  }

  if (vacina.quantidade < 0) {
    resultados.push({ mensagem: 'Quantidade não pode ser negativa.' });
  }

  return resultados;
}

router.post('',(req,res,next)=>{
  const vacina = new Vacina({
    nome: req.body.nome.trim(),
    tipo: req.body.tipo.trim(),
    dose: req.body.dose,
    lote: req.body.lote.trim(),
    quantidade: req.body.quantidade,
  });

  const resultados = validaVacina(vacina);
  if (resultados > 0) {
    res.status(400).json(resultados);
  } else {
    vacina.save().then(vacinaInserida =>{
      res.status(201).json({
        mensagem: 'Vacina Inserida',
        id: vacinaInserida._id
      });
    })
  }

});

router.get('',(req,res,next)=>{
  Vacina.find().then(documents=>{
    res.status(200).json(documents);
  })
})

module.exports = router;
