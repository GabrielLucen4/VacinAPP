import React, { useState, useEffect } from "react";

import {
  View,
  Image,
  StatusBar,
  Text,
  StyleSheet,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";

import { TextInput, Button, Title } from "react-native-paper";

import style, { colors } from "../../style";

export default function Login() {
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
        <>
          <StatusBar/>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.containerLogo}>
              <Animated.Image style={{
                width: logo.x,
                resizeMode: "contain",
              }} source={require("../../assets/icon.png")} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Animated.View style={[
              styles.container,
              {
                opacity: opacity,
                transform: [
                  { translateY: offset.y}
                ]
              }
            ]}>
              <Text style={styles.title}>VacinApp</Text>
              <View style={styles.subContainer}>
                <TextInput
                  style={styles.input}
                  label="E-mail"
                  autoCorrect={false}
                  mode="outlined"
                  onChangeText={() => {}}
                />

                <TextInput
                  style={styles.input}
                  label="Senha"
                  autoCorrect={false}
                  mode="outlined"
                  onChangeText={() => {}}
                />

                <View style={styles.containerButtons}>
                  <Button
                    mode="contained"
                    style={styles.buttonLogin}
                    labelStyle={styles.loginText}>
                    Acessar
                  </Button>

                  <Button
                    color={'#2d819f'}
                    mode="contained"
                    style={styles.buttonSignup}
                    labelStyle={styles.signupText}>
                    Cadastrar
                  </Button>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </>
    );
}

const styles = StyleSheet.create({
  containerLogo: {
    flex: 1,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 36,
    marginBottom: 0
  },
  container: {
    flex: 1.4,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    paddingBottom: 50,
  },
  subContainer: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 20
  },
  input: {
    width: "90%",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  containerButtons: {
    width: "90%",
    flexDirection: 'row-reverse',
    justifyContent: "space-between"
  },
  buttonLogin: {
    width: "50%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  buttonSignup: {
    width: "45%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  loginText: {
    color: "#FFF",
    textTransform: 'none',
  },
  signupText: {
    color: "#FFF",
    textTransform: 'none',
  }
});