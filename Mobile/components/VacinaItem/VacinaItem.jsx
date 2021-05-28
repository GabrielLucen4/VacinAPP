import React, { useState, useEffect } from 'react';

import { TouchableOpacity, Text, View } from 'react-native';

export default function VacinaItem({ dados, styles, onPress }) {
  const [expanded, setExpanded] = useState(false);
  const [doses, setDoses] = useState([]);

  const dadosVacina = dados.vacinas;

  useEffect(() => {
    const dosesTmp = [];
    for (let i = 0; i < dados.doses; i++) {
      if (dadosVacina.length === i) {
        dosesTmp.push(<Text key={i} style={styles.dosesText}>{i+1}ª Dose: {dados.dataRetorno}</Text>)
      } else if (dadosVacina.length <= i) {
        dosesTmp.push(<Text key={i} style={styles.dosesText}>{i+1}ª Dose: N/A</Text>)
      } else {
        dosesTmp.push(<Text key={i} style={styles.dosesText}>{i+1}ª Dose: OK</Text>)
      }
    }
    setDoses(dosesTmp);
  }, [])

  const onItemPress = () => {
    onPress();
    setExpanded(!expanded);
  }

  return (
    <>
      {!expanded && (
        <TouchableOpacity key={dados._id} style={styles.vacinaItemContainer} onPress={onItemPress}>
            <View style={styles.vacinaItemSubContainer}>
              <Text style={styles.vacinaItemNome}>{dados.doenca}</Text>
              <View style={styles.dosesContainer}>
                {doses}
              </View>
            </View>
            <View style={styles.vacinaItemMaisDetalhes}>
              <Text style={styles.vacinaItemMaisDetalhesText}>Mais Detalhes</Text>
            </View>
        </TouchableOpacity>
      )}
      {expanded && (
        <TouchableOpacity key={dados._id} style={styles.vacinaItemContainer} onPress={onItemPress}>
          <Text style={styles.vacinaItemNomeExpanded}>{dados.doenca}</Text>
          {dadosVacina.map((vacina, index) => {
              return (
              <View key={index} style={styles.vacinaItemDoseContainerExpanded}>
                <Text style={styles.vacinaItemDoseTextExpanded}>{index+1}º Dose:</Text>
                <Text>Data: {vacina.dataAplicacao}</Text>
                <Text>Lote: {vacina.lote}</Text>
                <Text>Vacinador: {vacina.enfermeiroNome}</Text>
                <Text>COREN: {vacina.enfermeiroCoren}</Text>
              </View>
              )
            })}
          {dadosVacina.length < dados.doses && (
            <View style={styles.vacinaItemDoseContainerExpanded}>
              <Text style={styles.vacinaItemDoseTextExpanded}>{dadosVacina.length+1}º Dose:</Text>
              <Text>Data para aplicação: {dados.dataRetorno}</Text>
            </View>
          )}
          <View style={styles.vacinaItemMaisDetalhes}>
              <Text style={styles.vacinaItemMaisDetalhesText}>Menos Detalhes</Text>
            </View>
        </TouchableOpacity>
      )}
    </>
  );
}