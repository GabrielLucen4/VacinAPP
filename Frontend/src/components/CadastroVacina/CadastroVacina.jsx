import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import PropTypes from "prop-types";
import { createMuiTheme, withStyles, ThemeProvider } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

import StoreContext from "../Store/Context";
import Loading from '../Loading';

import { tokenValidation } from "../../controllers/token";
import { enviaRegistro } from "../../controllers/vacinas";
import "./style.css";

function CadastroVacina(props) {
  const { classes } = props;
  const history = useHistory();

  const { token } = useContext(StoreContext)
  const [isLoading, setIsLoading] = useState(false);

  const [doenca, setDoenca] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [dose, setDose] = useState("");
  const [lote, setLote] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [prazoMaximoEntreDoses, setPrazoMaximoEntreDoses] = useState("");
  const [tempoTotalProtecao, setTempoTotalProtecao] = useState("");

  const [formularioValido, setFormularioValido] = useState(false);
  const [erros, setErros] = useState({
    doenca: false,
    dose: false,
    lote: false,
    quantidade: false,
    prazoMaximoEntreDoses: false,
    tempoTotalProtecao: false
  });
  const [preenchido, setPreenchido] =  useState({
    doenca: false,
    dose: false,
    lote: false,
    quantidade: false,
    prazoMaximoEntreDoses: false,
    tempoTotalProtecao: false
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
      if (!value) {
        setFormularioValido(false)
        return;
      }
    }
    setFormularioValido(true);
  }

  const validaDoenca = (doenca) => {
    // * nome da doença não pode estar vazia
    if (doenca.length > 0) {
      setPreenchido({...preenchido, doenca:true})
      validaFormulario({...preenchido, doenca: true})
    } else {
      setPreenchido({...preenchido, doenca:false})
      validaFormulario({...preenchido, doenca: false})
    }
  }


  const validaDose = (dose) => {
    // * dose não pode ser menor do que 0
    if (dose > 0) {
      setPreenchido({...preenchido, dose: true});
      validaFormulario({...preenchido, dose: true});
    } else {
      setPreenchido({...preenchido, dose: false});
      validaFormulario({...preenchido, dose: false});
    }
  }

  const validaLote = (lote) => {
    // * lote não pode estar vazio
    if(lote.length > 0) {
      setPreenchido({...preenchido, lote: true});
      validaFormulario({...preenchido, lote: true});
    } else {
      setPreenchido({...preenchido, lote:false});
      validaFormulario({...preenchido, lote:false});
    }
  }

  const validaQuantidade = (quantidade) => {
    // * quantidade não pode ser menor do que 0
    if (quantidade > 0) {
      setPreenchido({...preenchido, quantidade: true});
      validaFormulario({...preenchido, quantidade: true});
    } else {
      setPreenchido({...preenchido, quantidade: false});
      validaFormulario({...preenchido, quantidade: false});
    }
  }

  const validaPrazoMaximoEntreDoses = (prazoMaximoEntreDoses) => {
    // * prazoMaximoEntreDoses não pode ser menor do que 0
    if (prazoMaximoEntreDoses > 0) {
      setPreenchido({...preenchido, prazoMaximoEntreDoses: true});
      validaFormulario({...preenchido, prazoMaximoEntreDoses: true});
    } else {
      setPreenchido({...preenchido, prazoMaximoEntreDoses: false});
      validaFormulario({...preenchido, prazoMaximoEntreDoses: false});
    }
  }

  const validaTempoTotalProtecao = (tempoTotalProtecao) => {
    // * tempoTotalProtecao não pode ser menor do que 0
    if (tempoTotalProtecao > 0) {
      setPreenchido({...preenchido, tempoTotalProtecao: true});
      validaFormulario({...preenchido, tempoTotalProtecao: true});
    } else {
      setPreenchido({...preenchido, tempoTotalProtecao: false});
      validaFormulario({...preenchido, tempoTotalProtecao: false});
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
          <h2 className="titulo-cadastro">Cadastrar Vacina</h2>
          <ThemeProvider theme={theme}>
            <form className="formulario-cadastro">
              <TextField
                label="Doença"
                id="doenca"
                helperText="Ex.: Covid19, Febre Amarela, HPV"
                variant="outlined"
                margin="normal"
                error={erros.doenca}
                InputProps={{ className: classes.input }}
                onChange={(event) => {
                  let doenca = event.target.value.trim();
                  setDoenca(doenca);
                  validaDoenca(doenca);
                }}
                onBlur={() => {
                  setErros({...erros, doenca: !preenchido.doenca})
                }}
              />
              <TextField
                label="Fabricante"
                id="fabricante"
                type="text"
                helperText="Ex.: CoronaVac, "
                variant="outlined"
                margin="normal"
                InputProps={{ className: classes.input }}
                onChange={(event) => {
                  let fabricante = event.target.value.trim();
                  setFabricante(fabricante);
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
                    setErros({...erros, quantidade: !preenchido.quantidade})
                  }}
                />
              </div>
              <div className="lote-info">
                <TextField
                  label="Tempo max. entre doses"
                  id="lote"
                  variant="outlined"
                  margin="normal"
                  type="number"
                  helperText="Em dias"
                  error={erros.prazoMaximoEntreDoses}
                  style={{ marginRight: 12 }}
                  InputProps={{ className: classes.input }}
                  fullWidth
                  onChange={(event) => {
                    let prazoMaxEntreDoses = event.target.value.trim();
                    setPrazoMaximoEntreDoses(prazoMaxEntreDoses);
                    validaPrazoMaximoEntreDoses(prazoMaxEntreDoses);
                  }}
                  onBlur={() => {
                    setErros({...erros, prazoMaximoEntreDoses: !preenchido.prazoMaximoEntreDoses})
                  }}
                />
                <TextField
                  label="Tempo total de proteção"
                  id="quantidade"
                  variant="outlined"
                  margin="normal"
                  type="number"
                  helperText="Em meses"
                  error={erros.tempoTotalProtecao}
                  style={{ marginLeft: 12 }}
                  InputProps={{ className: classes.input }}
                  fullWidth
                  onChange={(event) => {
                    let tempoTotalProtecao = event.target.value.trim();
                    setTempoTotalProtecao(tempoTotalProtecao);
                    validaTempoTotalProtecao(tempoTotalProtecao);
                  }}
                  onBlur={() => {
                    setErros({...erros, tempoTotalProtecao: !preenchido.tempoTotalProtecao})
                  }}
                />
              </div>
              <Button disabled={!formularioValido} variant="contained" color="primary" size="large" onClick={async () => {
                setIsLoading(true);
                await enviaRegistro(doenca, fabricante, dose, lote, quantidade, prazoMaximoEntreDoses, tempoTotalProtecao);
                setIsLoading(false);
                history.push("/vacinas");
              }}><p className="reset-a">Cadastrar Vacina</p></Button>
            </form>
          </ThemeProvider>
        </React.Fragment>
      }
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
