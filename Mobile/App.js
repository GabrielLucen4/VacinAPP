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
  const [userToken, setUserToken] = React.useState(null);
  const [validToken, setValidToken] = React.useState(false);

  useEffect(() => {
    const validToken = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const status = await tokenValidation(token);
      console.log(status);
      setValidToken(status === 200);
    }
    validToken();
  }, [userToken]);

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
      }
    },
    signOut: async () => {
      await AsyncStorage.removeItem("token");
      setUserToken(null);
    },
    signUp: async (nome, cpf, dataNasc, email, senha) => {
      await enviaRegistro(nome, cpf, dataNasc, email, senha);
      const token = await login(email, senha);
      try {
        await AsyncStorage.setItem("token", token);
        const tokenStorage = await AsyncStorage.getItem("token");
        setUserToken(tokenStorage);
      }
      catch (err) {
        console.log(err)
      }
    }
  }));


  return (
    /*
    <Main/>
    <Register/>
    <Login/>
    <QRCodeVacinaScanner />
    <LoginCadastroStack/>
    */
   <Context.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {
            validToken
            ? <MainStack />
            : <LoginCadastroStack />
          }
        </NavigationContainer>
      </PaperProvider>
    </Context.Provider>
  );
}


