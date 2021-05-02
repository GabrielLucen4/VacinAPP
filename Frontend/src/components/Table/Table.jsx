import React, { useState, useEffect } from "react";

import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from '@material-ui/icons/Add';
import Done from "@material-ui/icons/Done";
import Close from "@material-ui/icons/Close";

import { Link } from 'react-router-dom';

import CadastroEnfermeiro from '../CadastroEnfermeiro';

import "./style.css";

const axios = require("axios");

function Table({ tabela, alterarPagina }) {
  const [columns, setColumns] = useState([]);
  const [dadosTabela, setDadosTabela] = useState([]);

  const labels = {
    nome: "Nome",
    cpf: "CPF",
    email: "E-mail",
    dataNasc: "Data de Nascimento",
    coren: "COREN",
    admin: "Administrador"
  }

  const optionsColumns = {
    admin: {
      customBodyRender: (value, tableMeta, updateValue) => {
        if (value) {
          return (
            <Tooltip title="Sim">
              <Done color="primary"/>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Não">
              <Close color="secondary"/>
            </Tooltip>
          );
        }
      }
    },
    acoes: {
      customBodyRender: () => {
        return (
          <button className="botao">Editar</button>
        );
      }
    }
  }

  useEffect(() => {
    const getDadosTabela = () => {
      axios
      .get(`http://10.0.1.0:4000/api/${tabela}`)
      .then((response) => {
        setDadosTabela(Array.from(response.data));
          console.log(1)
          renderCabecalho(Array.from(response.data));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getDadosTabela();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela]);

  const getMuiTheme = () => createMuiTheme({
    overrides: {
     MUIDataTable: {
      paper: {
        borderRadius: 10,
        border: 'none'
       }
     },
     MUIDataTableToolbarSelect:{
       root: {
         borderTopLeftRadius: 10,
         borderTopRightRadius: 10
       }
     }
    }
  })

  const renderCabecalho = (dadosTabela) => {
    const col = [];
    if (dadosTabela.length > 0) {
      const cabecalho = Object.keys(dadosTabela[0]);
      cabecalho.shift();
      cabecalho.pop();
      for (let item of cabecalho) {
        col.push({name: item, label: labels[item], options: optionsColumns[item]})
      }
      if (tabela !== 'pacientes') {
        col.push({name:"acoes", label: "Ações", options: optionsColumns.acoes})
      }
      setColumns(col)
    }
  };

  const options = {
    filter: true,
    filterType: 'dropdown',
    selectableRowsHideCheckboxes: true,
    selectableRows: 'single',
    responsive: 'vertical',
    rowsPerPageOptions: [],
    customToolbarSelect: () => {},
    customToolbar: () => {
      if (tabela !== 'pacientes') {
        return (
          <Tooltip title="Adicionar">
            <Link to={`/${tabela}/cadastrar`}>
              <IconButton>
                  <AddIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )
      }
    }
  }

  return (
    <div className="container-table">
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          className="table"
          title={tabela.charAt(0).toUpperCase() + tabela.slice(1)}
          columns={columns}
          data={dadosTabela}
          options={options}
          />
      </MuiThemeProvider>
    </div>
  );
}

export default Table;
