import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from "react-native";
import style, { colors } from "../../style";

export default function ScreenSchema({ children }) {
  // configurações de tela, para que se mantenha dentro dos limites do iOS e Android
  // e também, o KeyboradAvoidingView, para quando o teclado aparecer, os TextFields
  // subirem juntos e não ficarem obstruidos pelo teclado.
  return (
    <React.Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: colors.primary }} />
      <SafeAreaView style={style.preencher}>
          <StatusBar />
          <KeyboardAvoidingView
            style={styles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {children}
          </KeyboardAvoidingView>
      </SafeAreaView>
    </React.Fragment>
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
