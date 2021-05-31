import React, { useEffect, useState } from "react";

import { View, Keyboard, TouchableWithoutFeedback, StyleSheet, Image, Animated, Text, StatusBar, TouchableOpacity } from "react-native";
import { Button } from 'react-native-paper';

import ScreenSchema from "../../components/ScreenSchema/ScreenSchema";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

export default function Register({ navigation, route }) {

  // estados inciais das animações
  const [margin] = useState(new Animated.Value(35));
  const [offset] = useState(new Animated.ValueXY({x:0, y:90}));
  const [offsetLogo] = useState(new Animated.ValueXY({x:0, y:0}));
  const [opacity] = useState(new Animated.Value(0));

  // variável para armazenamento dos erros
  const [erro, setErro] = useState(undefined);

  useEffect(() => {
    // listeners de teclado, para quando o teclado subir, o logo subir,
    // e quando o teclado fechar, o logo abaixar novamente
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    Animated.parallel([
      // sobe o container de cadastro
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 15,
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
    Animated.parallel([
      Animated.timing(margin, {
        toValue: -120,
        duration: 400,
        useNativeDriver: false
      }),
      Animated.spring(offsetLogo.y, {
        toValue: -200,
        speed: 4,
        bounciness: 15,
        useNativeDriver: false
      })
    ]).start()
  }

  const keyboardDidHide = () => {
    Animated.parallel([
      Animated.timing(margin, {
        toValue: 35,
        duration: 150,
        useNativeDriver: false
      }),
      Animated.spring(offsetLogo.y, {
        toValue: 0,
        speed: 0.5,
        bounciness: 10,
        useNativeDriver: false
      })
    ]).start()
  }

  return (
    <ScreenSchema>
      <StatusBar/>
      <Animated.View style={[styles.containerLogo, {transform: [{translateY: offsetLogo.y}]}]}>
          <Image
            style={styles.image}
            source={require('../../assets/icon.png')}
          />
      </Animated.View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View style={[
          styles.container,
          {
            opacity: opacity,
            transform: [
              { translateY: offset.y }
            ]
          }
        ]}>
          <Animated.Text style={[styles.title, { marginTop: margin }]}>VacinApp</Animated.Text>
          <View style={styles.subContainer}>
            {erro && 
              <Text style={{textAlign: "center", color: "red"}}>{erro}</Text>
            }
            <RegisterForm dadosRecebidos={route.params} setErro={setErro} />
          </View>
          <TouchableOpacity style={{marginTop: 20}}>
            <Button icon="arrow-left" labelStyle={{color: "#FFF"}} onPress={() => navigation.pop()}>Voltar para a tela de login</Button>
          </TouchableOpacity>
        </Animated.View>
      </TouchableWithoutFeedback>
    </ScreenSchema>
  );
}

const styles = StyleSheet.create({
  containerLogo: {
    flex: 0.3,
    marginTop: 60,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 130,
    resizeMode: 'contain'
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 36,

  },
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    paddingBottom: 100,
  },
  containerBack: {
    flex: 3,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    paddingBottom: 100,
  },
  subContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 20
  }
});
