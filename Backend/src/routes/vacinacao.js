const Vacinacao = require("../models/vacinacao");
const {
  authenticateTokenEnfermeiro,
  authenticateTokenPaciente,
} = require("../tokenValidation");

const express = require("express");
const router = express.Router();

const moment = require("moment");

const vacinaDentroDoPrazoMax = (dataAplicacao, prazoMaxEntreDoses) => {
  const dataMax = moment(dataAplicacao, "DD/MM/YYYY")
    .add(prazoMaxEntreDoses, "days")
    .format("YYYY-MM-DD");
  const dataHoje = moment().format("YYYY-MM-DD");
  return moment(dataHoje).isSameOrBefore(dataMax);
};

const vacinaDentroDoPrazoMin = (dataRetorno) => {
  const dataHoje = moment().format("YYYY-MM-DD");
  const dataMin = moment(dataRetorno, "DD/MM/YYYY").format("YYYY-MM-DD");

  return moment(dataHoje).isSameOrAfter(dataMin);
};

const vacinaDentroDoPrazo = (
  dataAplicacao,
  prazoMaxEntreDoses,
  dataRetorno
) => {
  return (
    vacinaDentroDoPrazoMax(dataAplicacao, prazoMaxEntreDoses) &&
    vacinaDentroDoPrazoMin(dataRetorno)
  );
};

const vacinaDentroDoTempoProtecao = (tempoProtecao, dataUltimaAplicacao) => {
  const dataHoje = moment().format("YYYY-MM-DD");
  const dataProtecao = moment(dataUltimaAplicacao, "DD/MM/YYYY")
    .add(tempoProtecao, "months")
    .format("YYYY-MM-DD");

  return moment(dataHoje).isSameOrBefore(dataProtecao);
};

const verificaVacinaConcluida = async (id) => {
  const vacinacao = await Vacinao.findOne({ _id: id });
  const vacinas = vacina.vacinas;
  const ultimaVacina = vacinas[vacinas.length - 1];

  return {vacinacao, concluido: ultimaVacina.concluido};
};

const rotinaAutoDeleteVacina = async (id, dataRetorno="Sem Retorno") => {
  let vacinacao;
  let concluido = false;
  let timeout = false;

  setTimeout(() => {
    if (!concluido) {
      timeout = true;
    }
  }, 10000);

  while (!(timeout || concluido)) {
    const info = verificaVacinaConcluida(id);
    vacinacao = info.vacinacao;
    concluido = info.concluido;
  }

  if (timeout) {
    const vacinas = vacinacao.vacinas;
    vacinas.pop();

    vacinacao.dataRetorno = dataRetorno;

    if (vacinas.length === 0) {
      await Vacinacao.findOneAndDelete({_id: id});
    } else {
      await Vacinacao.findOneAndUpdate({_id: id}, vacinacao);
    }
  }
}

router.get("/:id", authenticateTokenPaciente, (req, res) => {
  Vacinacao.find({ paciente: req.params.id }).then((documents) => {
    for (let index = 0; index < documents.length; index++) {
      let vacinacao = documents[index];
      for (let dose = 0; dose < vacinacao.vacinas.length; dose++) {
        let vacina = vacinacao.vacinas[dose];
        if (!vacina.concluido) {
          vacinacao.vacinas.splice(dose, 1);
        }
      }
      if(vacinacao.vacinas.length <= 0) {
        documents.splice(index, 1);
      }
    }
    console.log(documents);
    res.status(200).json(documents);
  });
});

router.post("", authenticateTokenEnfermeiro, async (req, res) => {
  const query = { paciente: req.body.paciente, doenca: req.body.doenca };
  const vacinacao = await Vacinacao.findOne(query);

  if (!vacinacao) {
    const novaVacinacao = new Vacinacao({
      paciente: req.body.paciente,
      doenca: req.body.doenca,
      doses: req.body.doses,
      vacinas: [
        {
          ...req.body.vacina,
          dataAplicacao: moment().format("DD/MM/YYYY"),
        },
      ],
      dataRetorno: req.body.dataRetorno,
      prazoMaximoEntreDoses: req.body.prazoMaximoEntreDoses,
      tempoTotalProtecao: req.body.tempoTotalProtecao,
    });

    novaVacinacao.save().then((vacinacaoInserida) => {
      const id = vacinacaoInserida._id;
      //rotinaAutoDeleteVacina(id);
      res.status(201).json({
        mensagem: "Vacinação Inserida",
        id: id,
        dose: 0,
      });
    });
  } else {
    const vacinas = vacinacao.vacinas;
    const ultimaVacina = vacinas[vacinas.length - 1];

    const vacinaDentroDoPrazoTotal = vacinaDentroDoPrazo(
      ultimaVacina.dataAplicacao,
      vacinacao.prazoMaximoEntreDoses,
      vacinacao.dataRetorno
    );

    const vacinaDentroDasDoses = vacinacao.doses > vacinas.length;
    const vacinaMesmoFabricante =
      ultimaVacina.fabricante === req.body.vacina.fabricante;

    if (ultimaVacina.concluido) {
      if (
        vacinaDentroDoPrazoTotal &&
        vacinaDentroDasDoses &&
        vacinaMesmoFabricante
      ) {
        console.log("Dose aplicada");
        vacinas.push({
          ...req.body.vacina,
          dataAplicacao: moment().format("DD/MM/YYYY"),
        });
        vacinacao.dataRetorno = req.body.dataRetorno;
        Vacinacao.findOneAndUpdate(query, vacinacao).then(() => {
          //rotinaAutoDeleteVacina(vacinacao._id, req.body.dataRetorno);
          res.status(201).send({
            mensagem: "Dose aplicada",
            id: vacinacao._id,
            dose: vacinas.length - 1,
          });
        });
      } else if (
        !vacinaDentroDasDoses &&
        vacinaDentroDoTempoProtecao(
          vacinacao.tempoTotalProtecao,
          ultimaVacina.dataAplicacao
        )
      ) {
        console.log("Vacinação já completa");
        res.status(200).send({
          mensagem: "Vacinação já completa",
        });
      } else if (
        !vacinaDentroDoPrazoMax(
          ultimaVacina.dataAplicacao,
          vacinacao.prazoMaximoEntreDoses
        )
      ) {
        console.log("Resetando vacinação");
        vacinacao.vacinas = [
          {
            ...req.body.vacina,
            dataAplicacao: moment().format("DD/MM/YYYY"),
          },
        ];
        vacinacao.dataRetorno = req.body.dataRetorno;
        Vacinacao.findOneAndUpdate(query, vacinacao).then(() => {
          //rotinaAutoDeleteVacina(vacinacao._id);
          res.status(201).send({
            mensagem: "Doses resetadas",
            id: vacinacao._id,
            dose: 0,
          });
        });
      } else if (!vacinaDentroDoPrazoMin(vacinacao.dataRetorno)) {
        console.log(
          "Vacinação não permitida, pois está antes da data de retorno."
        );
        res.status(401).send({
          mensagem:
            "Vacinação não permitida, pois está antes da data de retorno.",
        });
      } else if (!vacinaMesmoFabricante) {
        console.log(
          "Vacinação não permitida, pois a vacinação ainda está no prazo, mas são vacinas de fabricantes diferentes."
        );
        res.status(401).send({
          mensagem:
            "Vacinação não permitida, pois a vacinação ainda está no prazo, mas são vacinas de fabricantes diferentes.",
        });
      } else {
        res.status(400).send({
          mensagem: "Erro desconhecido",
        });
      }
    } else {
      res.status(200).json({
        mensagem: "Vacinação Pendente",
        id: vacinacao._id,
        dose: vacinas.length - 1,
      });
    }
  }
});

router.put("", authenticateTokenPaciente, async (req, res) => {
  const body = req.body;
  if ("id" in body && "paciente" in body && "dose" in body) {
    const query = { paciente: body.paciente, _id: body.id };
    const vacinacao = await Vacinacao.findOne(query);
    console.log(vacinacao);

    if (vacinacao) {
      const dose = req.body.dose;
      const vacinas = vacinacao.vacinas;
      vacinas[dose].concluido = true;
      console.log(vacinacao);
      Vacinacao.findOneAndUpdate(query, vacinacao).then(() => {
        res.status(201).send({
          mensagem: "Vacinação atualizada com sucesso.",
        });
      });
    } else {
      res.status(400).send({
        mensagem: "Erro ao atualizar vacinação.",
      });
    }
  } else {
    res.status(400).send({
      mensagem: "Código QR Inválido.",
    });
  }
});

router.get("/concluida/:id", authenticateTokenEnfermeiro, async (req, res) => {
  const { concluido } = await verificaVacinaConcluida(req.params.id);

  res.send(200).json({ concluido });
});

module.exports = router;
