import React, { useState } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { createMuiTheme, withStyles, ThemeProvider } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

import { enviaRegistro } from "../../controllers/vacinas";
import "./style.css";

function CadastroVacina(props) {
  const { classes } = props;

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [dose, setDose] = useState("");
  const [lote, setLote] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [formularioValido, setFormularioValido] = useState(false);
  const [erros, setErros] = useState({
    nome: false,
    dose: false,
    lote: false,
    quantidade: false
  });
  const [preenchido, setPreenchido] =  useState({
    nome: false,
    dose: false,
    lote: false,
    quantidade: false
  });


  const validaFormulario = (preenchido) =>{
    for (let [key, value] of Object.entries(preenchido)) {
      if (!value) {
        setFormularioValido(false)
        return;
      }
    }
    setFormularioValido(true);
  }

  const validaNome = (nome) => {
    if (nome.length > 0) {
      setPreenchido({...preenchido, nome:true})
      validaFormulario({...preenchido, nome: true})
    } else {
      setPreenchido({...preenchido, nome:false})
      validaFormulario({...preenchido, nome: false})
    }
  }


  const validaDose = (dose) => {
    if (dose > 0) {
      setPreenchido({...preenchido, dose: true});
      validaFormulario({...preenchido, dose: true});
    } else {
      setPreenchido({...preenchido, dose: false});
      validaFormulario({...preenchido, dose: false});
    }
  }

  const validaLote = (lote) => {
    if(lote.length > 0) {
      setPreenchido({...preenchido, lote: true});
      validaFormulario({...preenchido, lote: true});
    } else {
      setPreenchido({...preenchido, lote:false});
      validaFormulario({...preenchido, lote:false});
    }
  }

  const validaQuantidade = (quantidade) => {
    if (quantidade > 0) {
      setPreenchido({...preenchido, quantidade: true});
      validaFormulario({...preenchido, quantidade: true});
    } else {
      setPreenchido({...preenchido, quantidade: false});
      validaFormulario({...preenchido, quantidade: false});
    }
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#5CCFE6'
      }
    },
    spacing: 8
  });

  return (
    <div className="container-cadastro">
      <h2 className="titulo-cadastro">Cadastrar Vacina</h2>
      <ThemeProvider theme={theme}>
        <form className="formulario-cadastro">
          <TextField
            label="Nome"
            id="nome"
            helperText="Nome da Vacina"
            variant="outlined"
            margin="normal"
            error={erros.nome}
            InputProps={{ className: classes.input }}
            onChange={(event) => {
              let nome = event.target.value.trim();
              setNome(nome);
              validaNome(nome);
            }}
            onBlur={() => {
              setErros({...erros, nome: !preenchido.nome})
            }}
          />
          <TextField
            label="Tipo"
            id="tipo"
            type="text"
            helperText="Doença - Tipo. Ex: Hepatite - B"
            variant="outlined"
            margin="normal"
            InputProps={{ className: classes.input }}
            onChange={(event) => {
              let tipo = event.target.value.trim();
              setTipo(tipo);
            }}
          />
          <TextField
            label="Doses"
            id="doses"
            helperText="Quantidade de doses que são necessárias para o paciente tomar."
            error={erros.dose}
            type="number"
            variant="outlined"
            margin="normal"
            InputProps={{ className: classes.input }}
            onChange={(event) => {
              let dose = event.target.value.trim();
              setDose(dose);
              validaDose(dose);
            }}
            onBlur={() => {
              setErros({...erros, dose: !preenchido.dose});
            }}
          />
          <div className="lote-info">
            <TextField
              label="Lote"
              id="lote"
              variant="outlined"
              margin="normal"
              type="text"
              helperText="Código de lote das vacinas"
              error={erros.lote}
              style={{ marginRight: 12 }}
              InputProps={{ className: classes.input }}
              fullWidth
              onChange={(event) => {
                let lote = event.target.value.trim();
                setLote(lote);
                validaLote(lote);
              }}
              onBlur={() => {
                setErros({...erros, lote: !preenchido.lote})
              }}
            />
            <TextField
              label="Quantidade"
              id="quantidade"
              variant="outlined"
              margin="normal"
              type="number"
              helperText="Quantidade de vacinas que vieram no lote"
              error={erros.quantidade}
              style={{ marginLeft: 12 }}
              InputProps={{ className: classes.input }}
              fullWidth
              onChange={(event) => {
                let quantidade = event.target.value.trim();
                setQuantidade(quantidade);
                validaQuantidade(quantidade);
              }}
              onBlur={() => {
                setErros({...erros, quantiade: !preenchido.quanitdade})
              }}
            />
          </div>
          <Button disabled={!formularioValido} variant="contained" color="primary" size="large" onClick={() => {
            enviaRegistro(nome, tipo, dose, lote, quantidade);
          }}><Link className="reset-a" to="/vacinas">Cadastrar Vacina</Link></Button>
        </form>
      </ThemeProvider>
    </div>
  );
}

CadastroVacina.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = {
  input: {
    borderRadius: 10,
  },

};

export default withStyles(styles)(CadastroVacina);
