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

// TODO: A ser implementado
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
  // * Procura os registros de vacina????es do paciente no banco de dados, e retorna apenas as que est??o conclu??das,
  // * ou seja, as que o paciente escaneou o c??digo QR
  Vacinacao.find({ paciente: req.params.id }).then((documents) => {
    // Para cada registro de vacina????o
    for (let index = 0; index < documents.length; index++) {
      let vacinacao = documents[index];
      // Para cada dose do registro de vacina????o
      for (let dose = 0; dose < vacinacao.vacinas.length; dose++) {
        let vacina = vacinacao.vacinas[dose];
        // ? Est?? conclu??da
        if (!vacina.concluido) {
          // ! Caso n??o esteja, remove da lista
          vacinacao.vacinas.splice(dose, 1);
        }
      }
      // ? A lista de doses ficou vazia
      if(vacinacao.vacinas.length <= 0) {
        // * Caso sim, remove o registro de vacina????o da lista de vacina????es
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

  // ? Existe um registro de vacina????o dessa doen??a para esse paciente j?? existente no banco
  if (!vacinacao) {
    // ! Caso n??o exista, cria um registro novo
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
        mensagem: "Vacina????o Inserida",
        id: id,
        dose: 0,
      });
    });
  } else {
    // * Caso exista...

    // pega a lista de vacinas (doses) aplicadas no paciente
    const vacinas = vacinacao.vacinas;

    // separa a ??ltima vacina tomada
    const ultimaVacina = vacinas[vacinas.length - 1];

    // guarda o status de se a vacina????o est?? dentro do prazo
    const vacinaDentroDoPrazoTotal = vacinaDentroDoPrazo(
      ultimaVacina.dataAplicacao,
      vacinacao.prazoMaximoEntreDoses,
      vacinacao.dataRetorno
    );

    // guarda o status de se a vacina????o est?? dentro do n??mero de doses da vacina
    const vacinaDentroDasDoses = vacinacao.doses > vacinas.length;

    // guarda status de se a vacina ?? do mesmo fabricante da dose anterior
    const vacinaMesmoFabricante = ultimaVacina.fabricante === req.body.vacina.fabricante;

    // ? ??ltima dose est?? com status de concluido
    if (ultimaVacina.concluido) {
      // * Caso sim,

      // ? A dose est?? dentro do prazo, dentro do n??mero total de doses e ?? do mesmo fabricante que a anterior
      if (
        vacinaDentroDoPrazoTotal &&
        vacinaDentroDasDoses &&
        vacinaMesmoFabricante
      ) {
        // * Caso sim, adiciona uma nova vacina a lista de vacinas
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
      }
      // ! Caso n??o,
      // ? As doses est??o completas e a vacina est?? dentro do prazo de prote????o
      else if (
        !vacinaDentroDasDoses &&
        vacinaDentroDoTempoProtecao(
          vacinacao.tempoTotalProtecao,
          ultimaVacina.dataAplicacao
        )
      ) {
        // * Caso sim, a vacina????o j?? est?? completa e n??o h?? nada a se fazer
        console.log("Vacina????o j?? completa");
        res.status(200).send({
          mensagem: "Vacina????o j?? completa",
        });
      }
      // ! Caso n??o,
      // ? A vacina est?? fora do prazo m??ximo entre doses
      else if (
        !vacinaDentroDoPrazoMax(
          ultimaVacina.dataAplicacao,
          vacinacao.prazoMaximoEntreDoses
        )
      ) {
        // * Caso esteja, ser?? resetada a lista de doses, como se fosse uma vacina????o nova
        console.log("Resetando vacina????o");
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
      }
      // ! Caso n??o esteja,
      // ? A data da vacina????o ?? antes da data de retorno
      else if (!vacinaDentroDoPrazoMin(vacinacao.dataRetorno)) {
        // * Caso seja, ser?? retornada a mensagem a baixo.
        console.log(
          "Vacina????o n??o permitida, pois est?? antes da data de retorno."
        );
        res.status(401).send({
          mensagem:
            "Vacina????o n??o permitida, pois est?? antes da data de retorno.",
        });
      }
      // ! Caso n??o seja,
      // ? A vacina ?? de fabricante diferente da dose anterior
      else if (!vacinaMesmoFabricante) {
        // * Caso seja, ser?? retornada a mensagem a baixo.
        console.log(
          "Vacina????o n??o permitida, pois a vacina????o ainda est?? no prazo, mas s??o vacinas de fabricantes diferentes."
        );
        res.status(401).send({
          mensagem:
            "Vacina????o n??o permitida, pois a vacina????o ainda est?? no prazo, mas s??o vacinas de fabricantes diferentes.",
        });
      }
      // ! Caso n??o seja, ser?? retornado erro desconhecido
      else {
        res.status(500).send({
          mensagem: "Erro desconhecido",
        });
      }
    } else {
      // ! Caso a ??ltima vacina n??o esteja conclu??da, ser?? retornada as informa????es da vacina que est?? pendente
      res.status(200).json({
        mensagem: "Vacina????o Pendente",
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
          mensagem: "Vacina????o atualizada com sucesso.",
        });
      });
    } else {
      res.status(400).send({
        mensagem: "Erro ao atualizar vacina????o.",
      });
    }
  } else {
    res.status(400).send({
      mensagem: "C??digo QR Inv??lido.",
    });
  }
});

router.get("/concluida/:id", authenticateTokenEnfermeiro, async (req, res) => {
  const { concluido } = await verificaVacinaConcluida(req.params.id);

  res.send(200).json({ concluido });
});

module.exports = router;
