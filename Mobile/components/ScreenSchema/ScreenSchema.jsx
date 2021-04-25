import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import style, { colors } from "../../style";

export default function ScreenSchema({ children }) {
  return (
    <>
      <SafeAreaView style={{flex:0, backgroundColor: colors.primary}}/>
      <SafeAreaView style={style.preencher}>
        <StatusBar />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={style.preencher}
        >
          {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

