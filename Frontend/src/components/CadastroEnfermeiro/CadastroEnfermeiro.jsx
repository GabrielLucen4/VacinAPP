import React, { useState } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { createMuiTheme, withStyles, ThemeProvider } from "@material-ui/core/styles";
import { TextField, Button, Checkbox, FormControlLabel } from "@material-ui/core";

import { enviaRegistro } from "../../controllers/enfermeiros";
import "./style.css";

function CadastroEnfermeiro(props) {
  const { classes } = props;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [coren, setCoren] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [admin, setAdmin] = useState(false);

  const [formularioValido, setFormularioValido] = useState(false);
  const [erros, setErros] = useState({
    nome: false,
    coren: false,
    email: false,
    senha: false,
    confirmarSenha: false
  });
  const [preenchido, setPreenchido] =  useState({
    nome: false,
    email: false,
    coren: false,
    senha: false,
    confirmarSenha: false
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
    if (nome.split(" ").length >= 2) {
      setPreenchido({...preenchido, nome:true})
      validaFormulario({...preenchido, nome: true})
    } else {
      setPreenchido({...preenchido, nome:false})
      validaFormulario({...preenchido, nome: false})
    }
  }


  const validaEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase())) {
      setPreenchido({...preenchido, email: true});
      validaFormulario({...preenchido, email: true});
    } else {
      setPreenchido({...preenchido, email:false});
      validaFormulario({...preenchido, email:false});
    }
  }

  const validaCoren = (coren) => {
    const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[a-zA-Z]{2})$/;
    if (re.test(coren.toUpperCase())) {
      setPreenchido({...preenchido, coren: true});
      validaFormulario({...preenchido, coren: true});
    } else {
      setPreenchido({...preenchido, coren: false});
      validaFormulario({...preenchido, coren: false});
    }
  }

  const validaSenha = (senha) => {
    if(senha.length >= 5) {
      setPreenchido({...preenchido, senha: true});
      validaFormulario({...preenchido, senha: true});
    } else {
      setPreenchido({...preenchido, senha:false});
      validaFormulario({...preenchido, senha:false});
    }
  }

  const validaConfirmarSenha = (confirmarSenha) => {
    if (confirmarSenha === senha) {
      setPreenchido({...preenchido, confirmarSenha: true});
      validaFormulario({...preenchido, confirmarSenha: true});
    } else {
      setPreenchido({...preenchido, confirmarSenha: false});
      validaFormulario({...preenchido, confirmarSenha: false});
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
      <h2 className="titulo-cadastro">Cadastrar Enfermeiro</h2>
      <ThemeProvider theme={theme}>
        <form className="formulario-cadastro">
          <TextField
            label="Nome"
            id="nome"
            helperText="Nome e Sobrenome"
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
            label="E-mail"
            id="email"
            type="email"
            helperText="nathan@email.com"
            variant="outlined"
            margin="normal"
            error={erros.email}
            InputProps={{ className: classes.input }}
            onChange={(event) => {
              let email = event.target.value.trim();
              console.log(email);
              setEmail(email);
              validaEmail(email);
            }}
            onBlur={() => {
              setErros({...erros, email: !preenchido.email});
            }}
          />
          <TextField
            label="COREN"
            id="coren"
            helperText="000.000.000-SP"
            error={erros.coren}
            variant="outlined"
            margin="normal"
            InputProps={{ className: classes.input }}
            onChange={(event) => {
              let coren = event.target.value.trim();
              if (coren.length > 14) {
                coren = coren.substring(0, 8);
              }
              setCoren(coren);
              validaCoren(coren);
            }}
            onBlur={() => {
              setErros({...erros, coren: !preenchido.coren});
            }}
          />
          <div className="senhas">
            <TextField
              label="Senha"
              id="senha"
              variant="outlined"
              margin="normal"
              type="password"
              helperText="Pelo menos 5 caracteres"
              error={erros.senha}
              style={{ marginRight: 12 }}
              InputProps={{ className: classes.input }}
              fullWidth
              onChange={(event) => {
                let senha = event.target.value.trim();
                setSenha(senha);
                validaSenha(senha);
              }}
              onBlur={() => {
                setErros({...erros, senha: !preenchido.senha})
              }}
            />
            <TextField
              label="Confirmar Senha"
              id="confirmarSenha"
              variant="outlined"
              margin="normal"
              type="password"
              helperText="Deve ser igual ao campo senha"
              error={erros.confirmarSenha}
              style={{ marginLeft: 12 }}
              InputProps={{ className: classes.input }}
              fullWidth
              onChange={(event) => {
                let confirmarSenha = event.target.value.trim();
                setConfirmarSenha(confirmarSenha);
                validaConfirmarSenha(confirmarSenha);
              }}
              onBlur={() => {
                setErros({...erros, confirmarSenha: !preenchido.confirmarSenha})
              }}
            />
          </div>
          <FormControlLabel
            label="Administrador"
            control={
              <Checkbox color="primary" onChange={(event) => {
                setAdmin(event.target.checked);
              }}/>
            }/>
          <Button disabled={!formularioValido} variant="contained" color="primary" size="large" onClick={() => {
            enviaRegistro(nome, email, coren, senha, admin);
          }}><Link className="reset-a" to="/enfermeiros">Cadastrar Enfermeiro</Link></Button>
        </form>
      </ThemeProvider>
    </div>
  );
}

CadastroEnfermeiro.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = {
  input: {
    borderRadius: 10,
  },

};

export default withStyles(styles)(CadastroEnfermeiro);
