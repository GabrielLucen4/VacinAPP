import React, { useState, useEffect } from "react";

import "./style.css";

const axios = require("axios");

function Table() {
  const [dadosTabela, setDadosTabela] = useState([]);

  useEffect(() => {
    getDadosTabela();
  }, []);

  const getDadosTabela = () => {
    axios
      .get("http://10.0.1.0:4000/api/pacientes")
      .then((response) => {
        console.log(response);
        setDadosTabela(Array.from(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderCabecalho = () => {
    if (dadosTabela.length > 0) {
      const cabecalho = Object.keys(dadosTabela[0]);
      cabecalho.shift();
      cabecalho.pop();
      return cabecalho.map((campo, index) => {
        return <td key={index}>{campo.toUpperCase()}</td>;
      });
    }
  };

  const renderCorpo = () => {
    return dadosTabela.map((linha, index) => {
      const { _id } = linha;
      return (
        <tr key={_id}>
          {renderLinha(linha)}
          <td>
            <button className="botao">Vacinar</button>
          </td>
        </tr>
      );
    });
  };

  const renderLinha = (linha) => {
    const dados = Object.values(linha);
    dados.shift();
    dados.pop();
    return dados.map((campo, index) => {
      return <td>{campo}</td>;
    });
  };

  return (
    <div className="container-table">
      <table className="table">
        <thead>
          <tr>
            {renderCabecalho()}
            <td>AÇÕES</td>
          </tr>
        </thead>
        <tbody>{renderCorpo()}</tbody>
      </table>
    </div>
  );
}

export default Table;
