import React, { useState, useEffect, useContext } from "react";
import Modal from 'react-modal';
import QRCode from 'react-qr-code';
import { Link, useHistory } from "react-router-dom";

import PropTypes from "prop-types";
import {
  createMuiTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import AutoComplete from "@material-ui/lab/Autocomplete";

import StoreContext from '../Store/Context';
import { tokenValidation } from "../../controllers/token";
import { getVacinas } from "../../controllers/vacinas";
import { getPacientes } from "../../controllers/pacientes";
import { cadastraVacinacao, estaConcluida } from "../../controllers/vacinacao";
import "./style.css";


function CadastroVacinacao(props) {
  const { classes } = props;
  const history = useHistory();

  const [vacina, setVacina] = useState({});
  const [paciente, setPaciente] = useState({});
  const [dataRetorno, setDataRetorno] = useState({});

  const [vacinaOptions, setVacinaOptions] = useState([]);
  const [pacienteOptions, setPacienteOptions] = useState([]);
  const [dosesOptions, setDosesOptions] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [qrCodeInfo, setQRCodeInfo] = useState("");
  const [message, setMessage] = useState("");

  const [formularioValido, setFormularioValido] = useState(false);
  const [erros, setErros] = useState({
    vacina: false,
    paciente: false,
    dataRetorno: false,
  });
  const [preenchido, setPreenchido] = useState({
    vacina: false,
    paciente: false,
    dataRetorno: false,
  });

  const { token } = useContext(StoreContext);
  const [valido, setValido] = useState(false);
  useEffect(() => {
    const accessAllowed = () => {
      return tokenValidation(token).then(status => {
        if (status === 403) {
          history.push('/');
        }
      })
    }
    accessAllowed();
    getVacinas().then((response) => {
      const vacinas = [];
      for (let vacina of response) {
        if (vacina.quantidade > 0) {
          vacinas.push(vacina);
        }
      }
      setVacinaOptions(vacinas);
    });
    getPacientes().then((response) => {
      setPacienteOptions(response);
    });
  }, []);

  const validaFormulario = (preenchido) => {
    for (let [key, value] of Object.entries(preenchido)) {
      if (!value) {
        setFormularioValido(false);
        return;
      }
    }
    setFormularioValido(true);
  };


  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#5CCFE6",
      },
    },
    spacing: 8,
  });

  const selecionaVacina = (event, vacina) => {
    if (vacinaOptions.includes(vacina)) {
      setVacina(vacina);
      setPreenchido({...preenchido, vacina: true});
      validaFormulario({...preenchido, vacina: true});
    } else {
      setPreenchido({...preenchido, vacina: false});
      validaFormulario({...preenchido, vacina: false});
    }

  };

  const selecionaPaciente = (event, paciente) => {
    if (pacienteOptions.includes(paciente)) {
      setPaciente(paciente);
      setPreenchido({...preenchido, paciente: true});
      validaFormulario({...preenchido, paciente: true});
    } else {
      setPreenchido({...preenchido, paciente: false});
      validaFormulario({...preenchido, paciente: false});
    }
  };

  const validaDataRetorno = (dataRetorno) => {
    if (dataRetorno) {
      setPreenchido({...preenchido, dataRetorno: true});
      validaFormulario({...preenchido, dataRetorno: true});
    } else {
      setPreenchido({...preenchido, dataRetorno: false});
      validaFormulario({...preenchido, dataRetorno: false});
    }
  }

  const verificaPendencias = async (id) => {
    let timeout = false;
    let concluido = false;

    setTimeout(() => {
      timeout = true;
    }, 300000);


    while (!(timeout || concluido)) {
      concluido = await estaConcluida(id, token);
    }

    setModalIsOpen(false);

  }

  const geraQrCode = () => {
    console.log("Chamando")
    cadastraVacinacao(vacina, paciente, dataRetorno, token).then(response => {
      if ('id' in response) {
        setMessage(response.mensagem);
        setQRCodeInfo(`${response.id} ${response.dose}`);
      } else {
        setMessage(response.mensagem);
        setQRCodeInfo("");
      }
      setModalIsOpen(true);
    })
  }

  return (
    <div className="container-cadastro">
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={{
        overlay: {
          zIndex: 999,
          backgroundColor: 'rgba(0, 0, 0, 0.45)'
        },
        content: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: 500,
          height: 500,
          alignItems:"center",
          margin: 'auto',
        }
      }}>
        <h2>{message}</h2>
        {
        qrCodeInfo && 
          <QRCode
            value={qrCodeInfo}
            size={450}
            level={"H"}
            includeMargin={true}/>
        }
      </Modal>
      <h2 className="titulo-cadastro">Vacinar</h2>
      <ThemeProvider theme={theme}>
        <form className="formulario-cadastro">
          <AutoComplete
            options={vacinaOptions}
            getOptionLabel={(option) => `${option.doenca} - ${option.fabricante} - ${option.lote}`}
            variant="contained"
            onChange={selecionaVacina}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label="Vacina"
                  margin="normal"
                  variant="outlined"
                  InputProps={{...params.InputProps ,className: classes.input }}
                />
              );
            }}
          />
          <AutoComplete
            options={pacienteOptions}
            getOptionLabel={(option) => `${option.nome} ${option.cpf}`}
            variant="contained"
            onChange={selecionaPaciente}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label="Paciente"
                  margin="normal"
                  variant="outlined"
                  InputProps={{...params.InputProps ,className: classes.input }}
                />
              );
            }}
          />
          <TextField
            label="Data de Retorno"
            id="tipo"
            type="text"
            variant="outlined"
            margin="normal"
            InputProps={{ className: classes.input }}
            onChange={(event) => {
              let dataRetorno = event.target.value.trim();
              setDataRetorno(dataRetorno);
              validaDataRetorno(dataRetorno);
            }}
          />
          <Button
            disabled={!formularioValido}
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: 8 }}
            onClick={geraQrCode}
          >
            <p className="reset-a">
              Vacinar
            </p>
          </Button>
        </form>
      </ThemeProvider>
    </div>
  );
}

CadastroVacinacao.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = {
  input: {
    borderRadius: 10,
  },
};

export default withStyles(styles)(CadastroVacinacao);
