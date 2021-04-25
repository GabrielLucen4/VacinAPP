import React from 'react';

import { View, StyleSheet} from 'react-native';
import { Title } from 'react-native-paper';

import { colors } from '../../style';

export default function Header() {
  return (
    <View style={styles.conteudo}>
      <View>
        <Title style={styles.title}>VacinApp</Title>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 24
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24
  }
});