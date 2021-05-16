import React, { useEffect, useState } from "react";

import { View, Keyboard, TouchableWithoutFeedback, StyleSheet, Image, Animated, Text, StatusBar } from "react-native";

import RegisterForm from "../../components/RegisterForm/RegisterForm";

import style, { colors } from "../../style";
import Display from 'react-native-display';

export default function Register() {

  const [offset] = useState(new Animated.ValueXY({x:0, y:90}));
  const [opacity] = useState(new Animated.Value(0));
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    Animated.parallel([
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 15,
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
    setDisplay(false);
  }

  const keyboardDidHide = () => {
    setDisplay(true);
  }

  return (
    <>
      <StatusBar/>
      <Display enterDuration={500} enter="fadeIn" enable={display} style={styles.containerLogo}>
          <Image
            style={styles.image}
            source={require('../../assets/icon.png')}
          />
      </Display>
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
          <Text style={styles.title}>VacinApp</Text>
          <View style={styles.subContainer}>
            <RegisterForm />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  containerLogo: {
    flex: 0.3,
    marginTop: 80,
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
    marginTop: 35

  },
  container: {
    flex: 2,
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
