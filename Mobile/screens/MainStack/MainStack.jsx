import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Main from '../Main';
import QRCodeVacinaScanner from '../QRCodeScanner';

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

const MainStack = ({navigation}) => (
  <RootStack.Navigator headerMode="none"
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      transitionSpec: {
        open: configOpen,
        close: configClose
      }
    }}>
    <RootStack.Screen name="Main" component={Main}/>
    <RootStack.Screen name="QRCodeScanner" component={QRCodeVacinaScanner}/>
  </RootStack.Navigator>
);



export default MainStack;