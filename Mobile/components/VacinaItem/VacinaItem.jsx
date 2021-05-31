import React, { useState, useEffect } from "react";

import { TouchableOpacity, Text, View } from "react-native";

export default function VacinaItem({ dados, styles, onPress }) {
  // estado do card da vacina (expandido = true, não expandido = false)
  const [expanded, setExpanded] = useState(false);
  // informação das doses
  const [doses, setDoses] = useState([]);

  // Array das doses tomadas
  const dadosVacina = dados.vacinas;

  useEffect(() => {
    const dosesTmp = [];
    for (let dose = 0; dose < dados.doses; dose++) {
      let quantidadeDosesTomadas = dadosVacina.length;

      // se a quantidade de doses tomadas for igual o numero da dose,
      // será apresentada a data de retorno, pois será a próxima dose a ser tomada
      if (quantidadeDosesTomadas === dose) {
        dosesTmp.push(
          <Text key={dose} style={styles.dosesText}>
            {dose + 1}ª Dose: {dados.dataRetorno}
          </Text>
        );
      }
      // caso a quantidade de doses tomadas seja menor que o número da dose,
      // será apresentado como N/A (não aplicável), pois há doses antes dessa a serem tomadas
      else if (quantidadeDosesTomadas <= dose) {
        dosesTmp.push(
          <Text key={dose} style={styles.dosesText}>
            {dose + 1}ª Dose: N/A
          </Text>
        );
      }
      // caso seja menor, será marcado como OK, pois a dose foi tomada
      else {
        dosesTmp.push(
          <Text key={dose} style={styles.dosesText}>
            {dose + 1}ª Dose: OK
          </Text>
        );
      }
    }
    setDoses(dosesTmp);
  }, []);

  const onItemPress = () => {
    onPress();
    setExpanded(!expanded);
  };

  return (
    <>
      {!expanded ? (
        <TouchableOpacity
          key={dados._id}
          style={styles.vacinaItemContainer}
          onPress={onItemPress}
        >
          <View style={styles.vacinaItemSubContainer}>
            <Text style={styles.vacinaItemNome}>{dados.doenca}</Text>
            <View style={styles.dosesContainer}>{doses}</View>
          </View>
          <View style={styles.vacinaItemMaisDetalhes}>
            <Text style={styles.vacinaItemMaisDetalhesText}>Mais Detalhes</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          key={dados._id}
          style={styles.vacinaItemContainer}
          onPress={onItemPress}
        >
          <Text style={styles.vacinaItemNomeExpanded}>{dados.doenca}</Text>
          {dadosVacina.map((vacina, index) => {
            return (
              <View key={index} style={styles.vacinaItemDoseContainerExpanded}>
                <Text style={styles.vacinaItemDoseTextExpanded}>
                  {index + 1}º Dose:
                </Text>
                <Text>Data: {vacina.dataAplicacao}</Text>
                <Text>Lote: {vacina.lote}</Text>
                <Text>Vacinador: {vacina.enfermeiroNome}</Text>
                <Text>COREN: {vacina.enfermeiroCoren}</Text>
              </View>
            );
          })}
          {dadosVacina.length < dados.doses && (
            <View style={styles.vacinaItemDoseContainerExpanded}>
              <Text style={styles.vacinaItemDoseTextExpanded}>
                {dadosVacina.length + 1}º Dose:
              </Text>
              <Text>Data para aplicação: {dados.dataRetorno}</Text>
            </View>
          )}
          <View style={styles.vacinaItemMaisDetalhes}>
            <Text style={styles.vacinaItemMaisDetalhesText}>
              Menos Detalhes
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}
