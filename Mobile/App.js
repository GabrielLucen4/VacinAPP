import React from "react";
import { KeyboardAvoidingView, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, View } from "react-native";

import Register from "./screens/Register";
import Login from "./screens/Login";

import { colors } from "./style";

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
  return (
    /*
    <Login/>
    */
   <PaperProvider theme={theme}>
      <KeyboardAvoidingView style={styles.background} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Register/>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#49A7C2",
  }
})