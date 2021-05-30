import React, { useState } from "react";

import { View } from "react-native";
import { TextInput, Button } from "react-native-paper";

import Context from '../../components/Context';

export default function LoginForm({ styles, navigation, setErro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostraSenha, setMostraSenha] = useState(false);

  const { signIn } = React.useContext(Context);

  const inverteMostraSenha = () => {
    setMostraSenha(!mostraSenha);
  };

  const [preenchido, setPreenchido] =  useState({
    email: false,
    senha: false
  });


  const validaEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase())) {
      setPreenchido({...preenchido, email: true});
    } else {
      setPreenchido({...preenchido, email:false});
    }
  }

  const validaSenha = (senha) => {
    if(senha.length >= 5) {
      setPreenchido({...preenchido, senha: true});
    } else {
      setPreenchido({...preenchido, senha:false});
    }
  }

  return (
    <React.Fragment>
      <TextInput
        style={styles.input}
        label="E-mail"
        keyboardType="email-address"
        autoCorrect={false}
        mode="outlined"
        onChangeText={email => {
          email = email.trim()
          setEmail(email);
          validaEmail(email);
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
        style={styles.input}
        label="Senha"
        secureTextEntry={!mostraSenha}
        autoCorrect={false}
        mode="outlined"
        onChangeText={senha => {
          senha = senha.trim()
          setSenha(senha);
          validaSenha(senha);
        }}
      />

      <View style={styles.containerButtons}>
        <Button
          mode="contained"
          style={styles.buttonLogin}
          labelStyle={styles.loginText}
          onPress={async () => {
            const erro = await signIn(email, senha);
            if (erro) {
              setErro("E-mail e/ou senha inválidos.");
            }
          }}
        >
          Acessar
        </Button>

        <Button
          color={"#2d819f"}
          mode="contained"
          style={styles.buttonSignup}
          labelStyle={styles.signupText}
          onPress={() => navigation.push("Cadastro", { email, senha, preenchido })}
        >
          Cadastrar
        </Button>
      </View>
    </React.Fragment>
  );
}
