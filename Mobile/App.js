// React imports
import React from 'react';
// View imports
import Register from './views/Register';

import { colors } from './style';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 20,
  colors: {
    ...DefaultTheme.colors,
    ...colors
  }
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Register/>
    </PaperProvider>
  );
}
