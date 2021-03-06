import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import PropTypes from "prop-types";
import { createMuiTheme, withStyles, ThemeProvider } from "@material-ui/core/styles";
import { TextField, Button, Checkbox, FormControlLabel } from "@material-ui/core";


import { tokenValidation } from "../../controllers/token";
import { enviaRegistro, getByField } from "../../controllers/enfermeiros";
import "./style.css";

import Loading from '../Loading';
import StoreContext from '../Store/Context';


function CadastroEnfermeiro(props) {
  const { classes } = props;
  const history = useHistory();

  const { token } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);

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
    nome: {value: false, message: ""},
    email: {value: false, message: ""},
    coren: {value: false, message: ""},
    senha: {value: false, message: ""},
    confirmarSenha: {value: false, message: ""}
  });

  useEffect(() => {
    const accessAllowed = () => {
      // * verifica se o usuário está logado para poder accesar a página de tabelas
      return tokenValidation(token).then((status) => {
        if (status === 403) {
          history.push("/");
        }
      });
    };
    accessAllowed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const validaFormulario = (preenchido) =>{
    for (let [key, value] of Object.entries(preenchido)) {
      if (!value.value) {
        setFormularioValido(false)
        return;
      }
    }
    setFormularioValido(true);
  }

  const validaNome = (nome, message="") => {
    // * nome deve conter pelo menos um sobrenome
    if (nome.split(" ").length >= 2) {
      setPreenchido({...preenchido, nome: {value: true, message: ""}})
      validaFormulario({...preenchido, nome: {value: true, message: ""}})
    } else {
      setPreenchido({...preenchido, nome: {value: false, message }})
      validaFormulario({...preenchido, nome: {value: false, message}})
    }
  }


  const validaEmail = (email, message="") => {
    // * e-mail deve seguir o padrão abaixo e não existir no banco de dados
    // ? {algumacoisa}@{algumacoisa}.{algumacoisa}
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase())) {
      getByField('email', email, token).then((emails) => {
        console.log(emails)
        let tamanho;
        try {
          tamanho = emails.registros.length;
        } catch (e) {
          tamanho = 0
        }
        if (!emails.erros && tamanho === 0 ){
          setPreenchido({...preenchido, email: {value: true, message: ""}});
          validaFormulario({...preenchido, email: {value: true, message: ""}});
        } else {
          setPreenchido({...preenchido, email: {value: false, message: "E-mail já cadastrado."}});
          validaFormulario({...preenchido, email: {value: false, message: "E-mail já cadastrado."}});
        }
      });
    } else {
      setPreenchido({...preenchido, email: { value: false, message }});
      validaFormulario({...preenchido, email:{ value: false, message }});
    }
  }

  const validaCoren = (coren, message="") => {
    // * coren deve seguir o padrão abaixo e não existir no banco de dados
    // ? 3numeros.3numeros.3numeros-2letras
    const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[a-zA-Z]{2})$/;
    if (re.test(coren.toUpperCase()) && coren.split('-').length === 2) {
      getByField('coren', coren, token).then((corens) => {
        let tamanho;
        try {
          tamanho = corens.registros.length;
        } catch (e) {
          tamanho = 0;
        }
        if (!corens.erros && tamanho === 0 ){
          setPreenchido({...preenchido, coren: {value: true, message: ""}});
          validaFormulario({...preenchido, coren: {value: true, message: ""}});
        } else {
          setPreenchido({...preenchido, coren: {value: false, message: "COREN já cadastrado."}});
          validaFormulario({...preenchido, coren: {value: false, message: "COREN já cadastrado."}});
        }
      })
    } else {
      setPreenchido({...preenchido, coren: {value: false, message}});
      validaFormulario({...preenchido, coren: {value: false, message}});
    }
  }

  const validaSenha = (senha, message="") => {
    // * senha deve conter pelo menos 5 caracteres
    if(senha.length >= 5) {
      setPreenchido({...preenchido, senha: {value: true, message: ""}});
      validaFormulario({...preenchido, senha: {value: true, message: ""}});
    } else {
      setPreenchido({...preenchido, senha: {value: false, message}});
      validaFormulario({...preenchido, senha: {value: false, message}});
    }
  }

  const validaConfirmarSenha = (confirmarSenha, message="") => {
    // * confirma senha deve ser igual a senha
    if (confirmarSenha === senha) {
      setPreenchido({...preenchido, confirmarSenha: {value: true, message: ""}});
      validaFormulario({...preenchido, confirmarSenha: {value: true, message: ""}});
    } else {
      setPreenchido({...preenchido, confirmarSenha: {value: false, message}});
      validaFormulario({...preenchido, confirmarSenha: {value: false, message}});
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
      {
        isLoading
        ? <Loading/>
        :
        <React.Fragment>
          <h2 className="titulo-cadastro">Cadastrar Enfermeiro</h2>
          <ThemeProvider theme={theme}>
            <form className="formulario-cadastro">
              <TextField
                label="Nome"
                id="nome"
                helperText={preenchido.nome.message}
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
                  validaNome(nome, "É necessário pelo menos um sobrenome.")
                  setErros({...erros, nome: !preenchido.nome.value})
                }}
              />
              <TextField
                label="E-mail"
                id="email"
                type="email"
                helperText={preenchido.email.message}
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
                  validaEmail(email, "E-mail inválido.")
                  setErros({...erros, email: !preenchido.email.value});
                }}
              />
              <TextField
                label="COREN"
                id="coren"
                helperText={preenchido.coren.message}
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
                  validaCoren(coren, "COREN inválido! Siga o modelo: 000.000.000-SP.");
                  setErros({...erros, coren: !preenchido.coren.value});
                }}
              />
              <div className="senhas">
                <TextField
                  label="Senha"
                  id="senha"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  helperText={preenchido.senha.message}
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
                    validaSenha(senha, "Senha deve conter pelo menos 5 caractéres.");
                    setErros({...erros, senha: !preenchido.senha.value});
                  }}
                />
                <TextField
                  label="Confirmar Senha"
                  id="confirmarSenha"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  helperText={preenchido.confirmarSenha.message}
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
                    validaConfirmarSenha(confirmarSenha, "A confirmação da senha deve ser igual a senha.");
                    setErros({...erros, confirmarSenha: !preenchido.confirmarSenha.value});
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
              <Button disabled={!formularioValido} variant="contained" color="primary" size="large" onClick={async () => {
                setIsLoading(true);
                await enviaRegistro(nome, email, coren, senha, admin);
                setIsLoading(false);
                history.push("/enfermeiros");
              }}><p className="reset-a">Cadastrar Enfermeiro</p></Button>
            </form>
          </ThemeProvider>
        </React.Fragment>
      }
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
