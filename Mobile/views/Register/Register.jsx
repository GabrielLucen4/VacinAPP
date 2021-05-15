import React from "react";

import { View, Keyboard, TouchableWithoutFeedback, StyleSheet, Image } from "react-native";
import { Title } from 'react-native-paper';

import ScreenSchema from "../../components/ScreenSchema";
import Header from "../../components/Header";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

import style, { colors } from "../../style";

export default function Register() {
  return (
    <ScreenSchema>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={style.preencher}>
          <View style={styles.conteudo}>
            <Image
              width="50%"
              style={styles.image}
              source={require('../../assets/icon.png')}
            />
            <View>
              <Title style={styles.title}>VacinApp</Title>
            </View>
          </View>
          <RegisterForm />
        </View>
      </TouchableWithoutFeedback>
    </ScreenSchema>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    backgroundColor: colors.primary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 24
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'stretch'
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 36
  }
});
