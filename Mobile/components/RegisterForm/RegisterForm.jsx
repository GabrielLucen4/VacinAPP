import React, { useState } from "react";

import {
  View,
  StyleSheet,
  Dimensions
} from "react-native";
import { TextInput, Button } from "react-native-paper";

import { enviaRegistro } from "../../controllers/paciente";

const moment = require('moment');

const ScreenHeight = Dimensions.get("window").height;

export default function RegisterForm() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostraSenha, setMostraSenha] = useState(false);
  const [mostraConfirmarSenha, setMostraConfirmarSenha] = useState(false);

  const [formularioValido, setFormularioValido] = useState(false);
  const [erros, setErros] = useState({
    nome: false,
    cpf: false,
    email: false,
    dataNasc: false,
    senha: false,
    confirmarSenha: false
  });
  const [preenchido, setPreenchido] =  useState({
    nome: false,
    cpf: false,
    email: false,
    dataNasc: false,
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

  const validaCpf = (cpf) => {
    if (cpf.length === 14) {
      setPreenchido({...preenchido, cpf:true});
      validaFormulario({...preenchido, cpf:true});
    } else {
      setPreenchido({...preenchido, cpf:false});
      validaFormulario({...preenchido, cpf:false});
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

  const validaData = (data) => {
    const date_regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    const dataEnvio = moment().format('YYYY-MM-DD');
    const dataValidacao = moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (date_regex.test(data) && moment(dataValidacao).isSameOrBefore(dataEnvio)) {
      setPreenchido({...preenchido, dataNasc: true});
      validaFormulario({...preenchido, dataNasc: true});
    } else {
      setPreenchido({...preenchido, dataNasc:false});
      validaFormulario({...preenchido, dataNasc:false});
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

  const inverteMostraSenha = () => {
    setMostraSenha(!mostraSenha);
  };

  const inverteMostraConfirmarSenha = () => {
    setMostraConfirmarSenha(!mostraConfirmarSenha);
  };

  return (
    <>
      <TextInput
        label="Nome Completo"
        style={styles.input}
        mode="outlined"
        error={erros.nome}
        onChangeText={(nome) => {
          nome = nome.trim();
          setNome(nome);
          validaNome(nome);
        }}
        onBlur={() => {
          setErros({...erros, nome: !preenchido.nome})
        }}
      />
      <TextInput
        label="CPF"
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        error={erros.cpf}
        value={cpf}
        onChangeText={(cpf) => {
          cpf = cpf.trim();
          if (cpf.length > 14) {
            cpf = cpf.substring(0, 14);
          }
          cpf = cpf.replace(/\D/g, "");
          cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
          cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
          cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
          setCpf(cpf);
          validaCpf(cpf);
        }}
        onBlur={() => {
          setErros({...erros, cpf: !preenchido.cpf})
        }}
      />
      <TextInput
        label="E-mail"
        style={styles.input}
        keyboardType="email-address"
        mode="outlined"
        error={erros.email}
        onChangeText={(email) => {
          email = email.trim();
          setEmail(email.toLowerCase());
          validaEmail(email);
        }}
        onBlur={() => {
          setErros({...erros, email: !preenchido.email})
        }}
      />
      <TextInput
        label="Data de nascimento"
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        error={erros.dataNasc}
        value={dataNasc}
        onChangeText={(dataNasc) => {
          dataNasc = dataNasc.trim();
          dataNasc = dataNasc.replace(/\D/g, "");
          dataNasc = dataNasc.replace(/(\d{2})(\d)/, "$1/$2");
          dataNasc = dataNasc.replace(/(\d{2})(\d)/, "$1/$2");
          dataNasc = dataNasc.replace(/(\d{4})(\d)/, "$1");
          setDataNasc(dataNasc);
          validaData(dataNasc);
        }}
        onBlur={() => {
          setErros({...erros, dataNasc: !preenchido.dataNasc})
        }}
      />
      <TextInput
        right={
          <TextInput.Icon
          style={styles.icon}
          name={mostraSenha ? "eye-off" : "eye-outline"}
          onPress={inverteMostraSenha}
          />
        }
        label="Senha"
        style={styles.input}
        secureTextEntry={!mostraSenha}
        mode="outlined"
        error={erros.senha}
        onChangeText={(senha) => {
          senha = senha.trim();
          setSenha(senha);
          validaSenha(senha);
        }}
        onBlur={() => {
          setErros({...erros, senha: !preenchido.senha})
        }}
      />
      <TextInput
        right={
          <TextInput.Icon
          style={styles.icon}
          name={mostraConfirmarSenha ? "eye-off" : "eye-outline"}
          onPress={inverteMostraConfirmarSenha}
          />
        }
        label="Confirmar Senha"
        style={styles.input}
        secureTextEntry={!mostraConfirmarSenha}
        mode="outlined"
        error={erros.confirmarSenha}
        onChangeText={(confirmarSenha) => {
          confirmarSenha = confirmarSenha.trim();
          setConfirmarSenha(confirmarSenha);
          validaConfirmarSenha(confirmarSenha);
        }}
        onBlur={() => {
          setErros({...erros, confirmarSenha: !preenchido.confirmarSenha})
        }}
      />
      <Button
        icon="account-plus"
        mode="contained"
        style={styles.button}
        disabled={!formularioValido}
        onPress={() => {
          enviaRegistro(nome, cpf, dataNasc, email, senha);
        }}
        labelStyle={styles.textButton}
      >
        Registrar-se
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "90%",
    marginBottom: 10,
    marginHorizontal: 5,
    height: 45,
    display: 'flex'
  },
  icon: {
    marginTop: 7,
    marginBottom: 0
  },
  password: {
    flex: 1,
  },
  button: {
    marginTop: 5,
    paddingHorizontal: 40,
    width: '90%',
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  textButton: {
    color: "#fff",
    textTransform: 'none'
  },
});
