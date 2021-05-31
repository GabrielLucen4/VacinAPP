import React, { useEffect } from "react";

import {
  NavigationContainer
} from "@react-navigation/native";

import AsyncStorage from "@react-native-community/async-storage"

import Context from './components/Context';

import LoginCadastroStack from "./screens/LoginCadastroStack";
import MainStack from "./screens/MainStack";

import { colors } from "./style";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { enviaRegistro, login, tokenValidation } from "./controllers/paciente";

const theme = {
  ...DefaultTheme,
  roundness: 20,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
};

export default function App() {
  // variável de estado, onde o useEffect fica verificando mudanças
  // caso mude, ele vai validar o token novo.
  const [userToken, setUserToken] = React.useState("");
  // variável com estado do token se é válido (true) ou não (false)
  const [validToken, setValidToken] = React.useState(false);

  useEffect(() => {
    const validToken = async () => {
      // quando o userToken mudar
      // a função pega o token do armazenamento assíncrono
      // e verifica se é um token válido ou não.
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const status = await tokenValidation(token);
      console.log(status);
      setValidToken(status === 200);
    }
    validToken();
  }, [userToken]);

  // funções de autenticação
  const authContext = React.useMemo(() => ({
    signIn: async (email, senha) => {
      const token = await login(email, senha);
      try {
        await AsyncStorage.setItem("token", token);
        const tokenStorage = await AsyncStorage.getItem("token");
        setUserToken(tokenStorage);
      }
      catch (err) {
        console.log(err)
        return err;
      }
    },
    signOut: async () => {
      await AsyncStorage.removeItem("token");
      setUserToken(null);
    },
    signUp: async (nome, cpf, dataNasc, email, senha) => {
      // envia o registro do usuário, cadastrando-o no banco de dados
      const erro = await enviaRegistro(nome, cpf, dataNasc, email, senha);
      if (!erro) {
        // caso não ocorra nenhum erro, será feito o login do usuário novo
        const token = await login(email, senha);
        try {
          await AsyncStorage.setItem("token", token);
          const tokenStorage = await AsyncStorage.getItem("token");
          setUserToken(tokenStorage);
        }
        catch (err) {
          console.log(err);
        }
      } else {
        return erro;
      }
    }
  }), []);


  return (
   <Context.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {
            // caso o token seja válido, será carregada a stack main (telas Main e QrCodeScanner)
            // caso contrário, será carregada a stack de login/cadastro
            validToken
            ? <MainStack />
            : <LoginCadastroStack />
          }
        </NavigationContainer>
      </PaperProvider>
    </Context.Provider>
  );
}


