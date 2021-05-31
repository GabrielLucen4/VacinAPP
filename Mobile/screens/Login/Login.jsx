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

import ScreenSchema from "../../components/ScreenSchema/ScreenSchema";
import LoginForm from '../../components/LoginForm';


export default function Login({ navigation }) {
  // valores inciais de posição, opacidade e tamanho para que as animações ocorram
  const [offset] = useState(new Animated.ValueXY({x:0, y:90}));
  const [opacity] = useState(new Animated.Value(0));
  const [logo] = useState(new Animated.ValueXY({x:200, y:0}));

  // variável onde será armazenada as mensagens de erro, caso tenha
  const [erro, setErro] = useState(undefined);


  useEffect(() => {
    // listeners de teclado, para quando o teclado subir, o logo diminuir,
    // e quando o teclado fechar, o logo aumentar novamente
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    Animated.parallel([
      // sobe o container de login
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 20,
        useNativeDriver: false
      }),
      // aumenta a opacidade dele
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
      duration: 100,
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
      <ScreenSchema>
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
              {
                // caso haja algum erro durante o login, será mostrado aqui o erro que foi retornado
                erro &&
                <Text style={styles.erro}>{erro}</Text>
              }
              <LoginForm styles={styles} navigation={navigation} setErro={setErro}/>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScreenSchema>
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
    paddingBottom: 90,
  },
  subContainer: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 20
  },
  erro: {
    color: "red",
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