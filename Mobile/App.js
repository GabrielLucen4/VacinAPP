import React, { useState, useEffect } from "react";

import {
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Keyboard
} from "react-native";

import Register from "./views/Register";

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

  const [offset] = useState(new Animated.ValueXY({x:0, y:90}));
  const [opacity] = useState(new Animated.Value(0));
  const [logo] = useState(new Animated.ValueXY({x:200, y:0}))

  useEffect(() => {
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    Animated.parallel([
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 20,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false
      })
    ]).start()
  }, [])

  const keyboardDidShow = () => {
    Animated.timing(logo.x, {
      toValue: 150,
      duration: 50,
      useNativeDriver: false
    }).start()
  }

  const keyboardDidHide = () => {
    Animated.timing(logo.x, {
      toValue: 200,
      duration: 100,
      useNativeDriver: false
    }).start()
  }

  return (
    // <PaperProvider theme={theme}>
    //   <Register/>
    // </PaperProvider>
    <KeyboardAvoidingView style={styles.background} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.containerLogo}>
        <Animated.Image style={{
          width: logo.x,
          resizeMode: "contain",
        }} source={require("./assets/icon.png")} />
      </View>

      <Animated.View style={[
        styles.container,
        {
          opacity: opacity,
          transform: [
            { translateY: offset.y}
          ]
        }
        ]}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          autoCorrect={false}
          onChangeText={() => {}}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          autoCorrect={false}
          onChangeText={() => {}}
        />

        <TouchableOpacity style={styles.btnSubmit}>
          <Text style={styles.submitText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRegister}>
          <Text style={styles.registerText}>Criar conta gratuíta</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#49A7C2",
  },
  containerLogo: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    paddingBottom: 50
  },
  input: {
    backgroundColor: "#FFF",
    width: "90%",
    marginBottom: 15,
    color: "#222",
    fontSize: 17,
    borderRadius: 10,
    padding: 10,
  },
  btnSubmit: {
    backgroundColor: "#ebae34",
    width: "90%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  submitText: {
    color: "#FFF",
    fontSize: 18
  },
  btnRegister: {
    marginTop: 10
  },
  registerText: {
    color: "#FFF"
  }
});
