import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import QRCode from 'react-qr-code';
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import {
  createMuiTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import AutoComplete from "@material-ui/lab/Autocomplete";

import { getVacinas } from "../../controllers/vacinas";
import { getPacientes } from "../../controllers/pacientes";
import "./style.css";

function CadastroVacinacao(props) {
  const { classes } = props;

  const [vacina, setVacina] = useState({});
  const [paciente, setPaciente] = useState({});
  const [dose, setDose] = useState({});
  const [dataRetorno, setDataRetorno] = useState({});

  const [vacinaOptions, setVacinaOptions] = useState([]);
  const [pacienteOptions, setPacienteOptions] = useState([]);
  const [dosesOptions, setDosesOptions] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [qrCodeInfo, setQRCodeInfo] = useState("");

  const [formularioValido, setFormularioValido] = useState(false);
  const [erros, setErros] = useState({
    vacina: false,
    paciente: false,
    dose: false,
    dataRetorno: false,
  });
  const [preenchido, setPreenchido] = useState({
    vacina: false,
    paciente: false,
    dose: false,
    dataRetorno: false,
  });

  useEffect(() => {
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
    console.log(event, vacina)
    if (vacina) {
      switch (vacina.dose) {
        case 0.5:
          setDosesOptions([{ value: 0.5, label: "DOSE FRACIONADA" }]);
          break;
        case 1:
          setDosesOptions([{ value: 1, label: "DOSE ÚNICA" }]);
          break;
        case 2:
          setDosesOptions([
            { value: 1, label: "Primeira dose" },
            { value: 2, label: "Segunda Dose" },
          ]);
          break;
        default:
          console.log("a");
      }
    }
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

  const selecionaDose = (event, dose) => {
    console.log(event, dose)
    if (dose) {
      setDose(dose);
      setPreenchido({...preenchido, dose: true});
      validaFormulario({...preenchido, dose: true});
    } else {
      setPreenchido({...preenchido, dose: false});
      validaFormulario({...preenchido, dose: false});
    }
  }

  const validaDataRetorno = (dataRetorno) => {
    if (dataRetorno) {
      setPreenchido({...preenchido, dataRetorno: true});
      validaFormulario({...preenchido, dataRetorno: true});
    } else {
      setPreenchido({...preenchido, dataRetorno: false});
      validaFormulario({...preenchido, dataRetorno: false});
    }
  }

  const geraQrCode = () => {
    const info = {vacina, paciente, dose, dataRetorno};
    setQRCodeInfo(JSON.stringify(info));
    setModalIsOpen(true);
  }

  return (
    <div className="container-cadastro">
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.45)'
        },
        content: {
          width: 453,
          height: 453,
          margin: 'auto',

        }
      }}>
        <QRCode
          value={qrCodeInfo}
          size={450}
          level={"H"}
          includeMargin={true}/>
      </Modal>
      <h2 className="titulo-cadastro">Vacinar</h2>
      <ThemeProvider theme={theme}>
        <form className="formulario-cadastro">
          <AutoComplete
            options={vacinaOptions}
            getOptionLabel={(option) => option.nome}
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
          <AutoComplete
            options={dosesOptions}
            getOptionLabel={(option) => option.label}
            variant="contained"
            onChange={selecionaDose}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label="Dose"
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
            <Link className="reset-a" to="/vacinas">
              Vacinar
            </Link>
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
