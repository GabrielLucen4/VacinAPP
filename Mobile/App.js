import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import Register from "./screens/Register";
import Login from "./screens/Login";
import Main from "./screens/Main";
import QRCodeVacinaScanner from "./screens/QRCodeScanner";

import style, { colors } from "./style";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 20,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
};

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size={large}/>
      </View>
    );
  }

  return (
    /*
    <Register/>
    <Login/>
    <Main/>
    */
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: colors.primary }} />
      <SafeAreaView style={style.preencher}>
        <PaperProvider theme={theme}>
          <StatusBar />
          <KeyboardAvoidingView
            style={styles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <QRCodeVacinaScanner />
          </KeyboardAvoidingView>
        </PaperProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#49A7C2",
  },
});
