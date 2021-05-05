const Vacina = require("../models/vacina");

const express = require('express');
const router = express.Router();

router.post('',(req,res,next)=>{
  const vacina = new Vacina({
    nome: req.body.nome.trim(),
    tipo: req.body.tipo.trim(),
    dose: req.body.dose,
    lote: req.body.lote.trim(),
    quantidade: req.body.quantidade,
  })

  vacina.save().then(vacinaInserida =>{
    res.status(201).json({
      mensagem: 'Vacina Inserida',
      id: vacinaInserida._id
    });
  })
});

router.get('',(req,res,next)=>{
  Vacina.find().then(documents=>{
    res.status(200).json(documents);
  })
})

module.exports = router;
