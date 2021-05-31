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
  // * Procura os registros de vacinações do paciente no banco de dados, e retorna apenas as que estão concluídas,
  // * ou seja, as que o paciente escaneou o código QR
  Vacinacao.find({ paciente: req.params.id }).then((documents) => {
    // Para cada registro de vacinação
    for (let index = 0; index < documents.length; index++) {
      let vacinacao = documents[index];
      // Para cada dose do registro de vacinação
      for (let dose = 0; dose < vacinacao.vacinas.length; dose++) {
        let vacina = vacinacao.vacinas[dose];
        // ? Está concluída
        if (!vacina.concluido) {
          // ! Caso não esteja, remove da lista
          vacinacao.vacinas.splice(dose, 1);
        }
      }
      // ? A lista de doses ficou vazia
      if(vacinacao.vacinas.length <= 0) {
        // * Caso sim, remove o registro de vacinação da lista de vacinações
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

  // ? Existe um registro de vacinação dessa doença para esse paciente já existente no banco
  if (!vacinacao) {
    // ! Caso não exista, cria um registro novo
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
    // * Caso exista...

    // pega a lista de vacinas (doses) aplicadas no paciente
    const vacinas = vacinacao.vacinas;

    // separa a última vacina tomada
    const ultimaVacina = vacinas[vacinas.length - 1];

    // guarda o status de se a vacinação está dentro do prazo
    const vacinaDentroDoPrazoTotal = vacinaDentroDoPrazo(
      ultimaVacina.dataAplicacao,
      vacinacao.prazoMaximoEntreDoses,
      vacinacao.dataRetorno
    );

    // guarda o status de se a vacinação está dentro do número de doses da vacina
    const vacinaDentroDasDoses = vacinacao.doses > vacinas.length;

    // guarda status de se a vacina é do mesmo fabricante da dose anterior
    const vacinaMesmoFabricante = ultimaVacina.fabricante === req.body.vacina.fabricante;

    // ? Última dose está com status de concluido
    if (ultimaVacina.concluido) {
      // * Caso sim,

      // ? A dose está dentro do prazo, dentro do número total de doses e é do mesmo fabricante que a anterior
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
      // ! Caso não,
      // ? As doses estão completas e a vacina está dentro do prazo de proteção
      else if (
        !vacinaDentroDasDoses &&
        vacinaDentroDoTempoProtecao(
          vacinacao.tempoTotalProtecao,
          ultimaVacina.dataAplicacao
        )
      ) {
        // * Caso sim, a vacinação já está completa e não há nada a se fazer
        console.log("Vacinação já completa");
        res.status(200).send({
          mensagem: "Vacinação já completa",
        });
      }
      // ! Caso não,
      // ? A vacina está fora do prazo máximo entre doses
      else if (
        !vacinaDentroDoPrazoMax(
          ultimaVacina.dataAplicacao,
          vacinacao.prazoMaximoEntreDoses
        )
      ) {
        // * Caso esteja, será resetada a lista de doses, como se fosse uma vacinação nova
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
      }
      // ! Caso não esteja,
      // ? A data da vacinação é antes da data de retorno
      else if (!vacinaDentroDoPrazoMin(vacinacao.dataRetorno)) {
        // * Caso seja, será retornada a mensagem a baixo.
        console.log(
          "Vacinação não permitida, pois está antes da data de retorno."
        );
        res.status(401).send({
          mensagem:
            "Vacinação não permitida, pois está antes da data de retorno.",
        });
      }
      // ! Caso não seja,
      // ? A vacina é de fabricante diferente da dose anterior
      else if (!vacinaMesmoFabricante) {
        // * Caso seja, será retornada a mensagem a baixo.
        console.log(
          "Vacinação não permitida, pois a vacinação ainda está no prazo, mas são vacinas de fabricantes diferentes."
        );
        res.status(401).send({
          mensagem:
            "Vacinação não permitida, pois a vacinação ainda está no prazo, mas são vacinas de fabricantes diferentes.",
        });
      }
      // ! Caso não seja, será retornado erro desconhecido
      else {
        res.status(500).send({
          mensagem: "Erro desconhecido",
        });
      }
    } else {
      // ! Caso a última vacina não esteja concluída, será retornada as informações da vacina que está pendente
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
