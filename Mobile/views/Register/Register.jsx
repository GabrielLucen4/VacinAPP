import React, { useState } from "react";

import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

import ScreenSchema from "../../components/ScreenSchema";
import Header from "../../components/Header";

import { enviaRegistro } from "../../controllers/paciente";

const moment = require('moment');
export default function Register() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [senha, setSenha] = useState("");
  const [mostraSenha, setMostraSenha] = useState(false);

  const [formularioValido, setFormularioValido] = useState(false);
  const [erros, setErros] = useState({
    nome: false,
    cpf: false,
    email: false,
    dataNasc: false,
    senha: false
  });
  const [preenchido, setPreenchido] =  useState({
    nome: false,
    cpf: false,
    email: false,
    dataNasc: false,
    senha: false
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

  const inverteMostraSenha = () => {
    setMostraSenha(!mostraSenha);
  };

  return (
    <ScreenSchema>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <Header />
          <View style={styles.campos}>
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
            <View style={styles.button}>
              <Button
                icon="account-plus"
                mode="contained"
                disabled={!formularioValido}
                onPress={() => {
                  enviaRegistro(nome, cpf, dataNasc, email, senha);
                }}
                labelStyle={styles.textButton}
              >
                Registrar-se
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenSchema>
  );
}

const styles = StyleSheet.create({
  campos: {
    padding: 24,
    flexDirection: "column",
  },
  input: {
    marginBottom: 10,
    marginHorizontal: 5,
  },
  inputPassword: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  password: {
    flex: 1,
  },
  button: {
    marginTop: 5,
    paddingHorizontal: 40,
  },
  textButton: {
    color: "#fff",
  },
});
