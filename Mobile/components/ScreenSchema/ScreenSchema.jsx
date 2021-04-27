import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import style, { colors } from "../../style";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ScreenSchema({ children }) {
  return (
    <>
      <SafeAreaView style={{flex:0, backgroundColor: colors.primary}}/>
      <SafeAreaView style={style.preencher}>
        <StatusBar />
        <KeyboardAwareScrollView extraScrollHeight={20}>
          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}

