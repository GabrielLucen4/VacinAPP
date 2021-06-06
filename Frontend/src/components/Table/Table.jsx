import React, { useState, useEffect, useContext } from "react";

import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import Done from "@material-ui/icons/Done";
import Close from "@material-ui/icons/Close";

import { Link, useHistory } from "react-router-dom";

import StoreContext from "../Store/Context";
import Loading from "../Loading";

import { tokenValidation } from "../../controllers/token";

import "./style.css";

const axios = require("axios");

function Table({ tabela }) {
  const history = useHistory();

  // colunas/cabeçalho
  const [columns, setColumns] = useState([]);
  // linhas
  const [dadosTabela, setDadosTabela] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // * labels para cada item do banco
  const labels = {
    nome: "Nome",
    cpf: "CPF",
    email: "E-mail",
    dataNasc: "Data de Nascimento",
    coren: "COREN",
    admin: "Administrador",
    doenca: "Doença",
    fabricante: "Fabricante",
    dose: "Doses",
    lote: "Lote",
    quantidade: "Quantidade",
    prazoMaximoEntreDoses: "Prazo máximo entre doses",
    tempoTotalProtecao: "Tempo total de proteção",
  };

  // * labels que não serão exibidas na tabela
  const nonLabels = ["_id", "__v", "refreshToken"];

  const { token } = useContext(StoreContext);

  // * Configurações das colunas de admin e ações
  const optionsColumns = {
    admin: {
      // ? renderiza o icone de acordo com status de admin,
      // * caso seja admin: ✅
      // ! caso não seja admin: ❌
      customBodyRender: (value, tableMeta, updateValue) => {
        if (value) {
          return (
            <Tooltip title="Sim">
              <Done color="primary" />
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Não">
              <Close color="secondary" />
            </Tooltip>
          );
        }
      },
    },
    acoes: {
      // renderiza o botão de editar para as tabelas de enfermeiros e vacinas
      customBodyRender: () => {
        return (
          // TODO: Funcionalidade a ser implementada
          <button className="botao">Editar</button>
        );
      },
    },
  };

  useEffect(() => {
    const accessAllowed = () => {
      // * verifica se o usuário está logado para poder accesar a página de tabelas
      return tokenValidation(token).then((status) => {
        if (status === 403) {
          history.push("/");
        }
      });
    };
    const getDadosTabela = () => {
      // * pega os dados da tabela que foi selecionada
      setIsLoading(true);
      axios
        .get(
          `https://us-central1-vacinapp-1.cloudfunctions.net/server/api/${tabela}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setDadosTabela(Array.from(response.data));
          renderCabecalho(Array.from(response.data));
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    accessAllowed();
    getDadosTabela();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela]);

  // * configurações de estilo da tabela
  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTable: {
          paper: {
            borderRadius: 10,
            border: "none",
          },
        },
        MUIDataTableToolbarSelect: {
          root: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        },
      },
    });

  const renderCabecalho = (dadosTabela) => {
    // * renderiza o cabeçalho de acordo com as chaves recebidas do banco
    const col = [];
    if (dadosTabela.length > 0) {
      // pega as chaves do objeto
      const cabecalho = Object.keys(dadosTabela[0]);

      // remove todas as chaves que são caracterizadas como "nonLabel"
      // como as chaves incluidas pelo próprio mongo, como "_id" e "__v"
      for (let index = 0; index < cabecalho.length; index++) {
        let item = cabecalho[index];
        if (nonLabels.includes(item)) {
          cabecalho.splice(index, 1);
        }
      }

      // para cada item do cabecalhos (array de chaves do objeto)
      // é passado o nome, a label que é configurada no objeto "labels",
      // e as opções caso tenha (como no caso do admin)
      for (let item of cabecalho) {
        col.push({
          name: item,
          label: labels[item],
          options: optionsColumns[item],
        });
      }
      // ! se for não for a tabela de pacientes, a coluna "Ações" com os botões editar também é carregada
      if (tabela !== "pacientes") {
        col.push({
          name: "acoes",
          label: "Ações",
          options: optionsColumns.acoes,
        });
      }
      setColumns(col);
    }
  };

  // * configurações das linhas
  const options = {
    filter: true,
    filterType: "dropdown",
    selectableRowsHideCheckboxes: true,
    selectableRows: "single",
    responsive: "vertical",
    rowsPerPage:8,
    rowsPerPageOptions: [],
    customToolbarSelect: () => {},
    customToolbar: () => {
      if (tabela !== "pacientes") {
        return (
          <Tooltip title="Adicionar">
            <Link to={`/${tabela}/cadastrar`}>
              <IconButton>
                <AddIcon />
              </IconButton>
            </Link>
          </Tooltip>
        );
      }
    },
  };

  return (
    <div className="container-table">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="sub-container-table">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              className="table"
              title={
                tabela.charAt(0).toUpperCase() +
                tabela.slice(
                  1
                ) /* pega a primeira letra da string e a coloca em maiúsculo. Ex: enfermeiros => Enfermeiros*/
              }
              columns={columns}
              data={dadosTabela}
              options={options}
            />
          </MuiThemeProvider>
        </div>
      )}
    </div>
  );
}

export default Table;
