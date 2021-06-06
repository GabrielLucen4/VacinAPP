import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import {
  createMuiTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import {
  TextField,
  Button
} from "@material-ui/core";

import StoreContext from "../Store/Context";
import { login } from "../../controllers/enfermeiros";
import { tokenValidation } from "../../controllers/token";

import './style.css';
import Loading from "../Loading/Loading";

function Login(props) {
  const { classes } = props;
  const history = useHistory();

  const [coren, setCoren] = useState("");
  const [senha, setSenha] = useState("");

  const { token, setToken } = useContext(StoreContext);

  const [erro, setErro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#5CCFE6'
      }
    },
    spacing: 8
  });


  useEffect(() => {
    setIsLoading(true);
    const accessAllowed = () => {
      return tokenValidation(token).then(status => {
        setIsLoading(false);
        if (status === 200) history.push("/pacientes");
      })
    }
    accessAllowed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onSubmit = (event) => {
    event.preventDefault();

    setIsLoading(true);
    login(coren, senha).then(({ data }) => {
      setIsLoading(false);
      console.log(data);
      setToken(data.accessToken);
      history.push('/pacientes');
    }).catch(err => {
      setIsLoading(false);
      setErro(true);
    });

  }

  return (
    <div className="container-login">
      {
        isLoading
        ? <Loading/>
        : <React.Fragment>
          <h2 className="titulo-login">VacinApp</h2>
          <ThemeProvider theme={theme}>
            <form className="formulario-login" onSubmit={onSubmit}>
              {
                erro && (
                  <h3 className="erro">E-mail/Senha inválidos</h3>
                )
              }
              <TextField
                label="COREN"
                id="coren"
                variant="outlined"
                margin="normal"
                InputProps={{ className: classes.input }}
                onChange={(event) => {
                  setCoren(event.target.value);
                }}
              />
              <TextField
                label="Senha"
                id="senha"
                variant="outlined"
                margin="normal"
                type="password"
                style={{ marginRight: 12 }}
                InputProps={{ className: classes.input }}
                fullWidth
                onChange={(event) => {
                  setSenha(event.target.value);
                }}
              />
              <Button variant="contained" color="primary" size="large" type="submit">
                <p className="reset-a">
                  Login
                </p>
              </Button>
            </form>
          </ThemeProvider>
        </React.Fragment>
      }
    </div>
  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = {
  input: {
    borderRadius: 10,
  },
};

export default withStyles(styles)(Login);
