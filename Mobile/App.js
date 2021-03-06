import React, { useEffect } from "react";

import {
  NavigationContainer
} from "@react-navigation/native";

import AsyncStorage from "@react-native-community/async-storage"

import Context from './components/Context';
import ScreenSchema from "./components/ScreenSchema";

import LoginCadastroStack from "./screens/LoginCadastroStack";
import MainStack from "./screens/MainStack";

import { colors } from "./style";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { enviaRegistro, login, tokenValidation } from "./controllers/paciente";

import { Swing } from 'react-native-animated-spinkit';

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
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);
    const validToken = async () => {
      // quando o userToken mudar
      // a função pega o token do armazenamento assíncrono
      // e verifica se é um token válido ou não.
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const status = await tokenValidation(token);
      console.log(status);
      setValidToken(status === 200);
      setIsLoading(false);
    }
    validToken();
  }, [userToken]);

  // funções de autenticação
  const authContext = React.useMemo(() => ({
    signIn: async (email, senha) => {
      setIsLoading(true);
      const token = await login(email, senha);
      try {
        await AsyncStorage.setItem("token", token);
        const tokenStorage = await AsyncStorage.getItem("token");
        setUserToken(tokenStorage);
        setIsLoading(false);
      }
      catch (err) {
        console.log(err)
        setIsLoading(false);
        return err;
      }
    },
    signOut: async () => {
      setIsLoading(true);
      await AsyncStorage.removeItem("token");
      setUserToken(null);
      setIsLoading(false);
    },
    signUp: async (nome, cpf, dataNasc, email, senha) => {
      // envia o registro do usuário, cadastrando-o no banco de dados
      setIsLoading(true);
      const erro = await enviaRegistro(nome, cpf, dataNasc, email, senha);
      if (!erro) {
        // caso não ocorra nenhum erro, será feito o login do usuário novo
        const token = await login(email, senha);
        try {
          await AsyncStorage.setItem("token", token);
          const tokenStorage = await AsyncStorage.getItem("token");
          setUserToken(tokenStorage);
          setIsLoading(false);
        }
        catch (err) {
          console.log(err);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        return erro;
      }
    }
  }), []);


  return (
   <Context.Provider value={authContext}>
      <PaperProvider theme={theme}>
        {
          isLoading ?
          <ScreenSchema>
            <Swing color="#FFF" size={100}/>
          </ScreenSchema>
          :
          <NavigationContainer>
            {
              // caso o token seja válido, será carregada a stack main (telas Main e QrCodeScanner)
              // caso contrário, será carregada a stack de login/cadastro
              validToken
              ? <MainStack />
              : <LoginCadastroStack />
            }
          </NavigationContainer>
        }
      </PaperProvider>
    </Context.Provider>
  );
}


