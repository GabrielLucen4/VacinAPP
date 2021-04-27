import React from "react";

import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import ScreenSchema from "../../components/ScreenSchema";
import Header from "../../components/Header";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

import style, { colors } from "../../style";

export default function Register() {

  return (
    <ScreenSchema>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={style.preencher}>
          <Header />
          <RegisterForm />
        </View>
      </TouchableWithoutFeedback>
    </ScreenSchema>
  );
}
