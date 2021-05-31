import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Login from '../Login';
import Register from '../Register';

const RootStack = createStackNavigator();

const configOpen = {
  animation: 'timing',
  config: {
    duration: 250,
  }
}

const configClose = {
  animation: 'timing',
  config: {
    duration: 100,
  }
}

const LoginCadastroStack = ({navigation}) => (
  <RootStack.Navigator headerMode="none"
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      transitionSpec: {
        open: configOpen,
        close: configClose
      }
    }}>
    <RootStack.Screen name="Login" component={Login}/>
    <RootStack.Screen name="Cadastro" component={Register}/>
  </RootStack.Navigator>
);



export default LoginCadastroStack;