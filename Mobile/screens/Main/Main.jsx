import React, { useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";

import { Transitioning, Transition } from "react-native-reanimated";

import VacinaItem from "../../components/VacinaItem";
import BotaoQrCode from "../../components/BotaoQrCode";

export default function Main() {
  const data = [
    {
      _id: "456",
      nome: "CoronaVac",
      doses: 2,
      vacina: [
        {
          tipo: "Covid - China",
          dose: 1,
          lote: "LX074C",
          dataAplicacao: "23/04/2021",
          enfermeiro: {
            nome: "Rodrigo Lins",
            coren: "000.123.456-SP",
          }
        },
        {
          tipo: "Covid - China",
          dose: 2,
          lote: "LX073B",
          dataAplicacao: "23/05/2021",
          enfermeiro: {
            nome: "Gabriel Santos",
            coren: "000.456.789-SP",
          }
        }
      ],
      dataRetorno: "10/08/21",
    }
  ];

  const transitionRef = useRef();
  const transition = <Transition.Change interpolation="easeInOut" />

  const onPress = () => {
    transitionRef.current.animateNextTransition();
  }

  const renderItem = ({ item }) => {
    return <VacinaItem dados={item} styles={styles} onPress={onPress}/>
  };

  return (
    <>
      <View style={styles.containerHeader}>
        <Text style={styles.vacinAppText}>VacinApp</Text>
        <View style={styles.nomeContainer}>
          <Text style={styles.nomeText}>Nathan Marrega</Text>
        </View>
      </View>
      <View style={styles.containerVacinas}>
        <Transitioning.View ref={transitionRef} transition={transition} style={{ flex: 1 }}>
          <FlatList
            keyExtractor={(item) => item._id}
            data={data}
            renderItem={renderItem}
          />
        </Transitioning.View>
        <BotaoQrCode styles={styles} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    marginTop: 10,
    flex: 0.2,
    width: "90%",
    justifyContent: "space-around",
    alignItems: "center"
  },
  vacinAppText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFF",
  },
  nomeContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center"
  },
  nomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  containerVacinas: {
    flex: 1,
    marginTop: 10,
    width: "87%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20
  },
  vacinaItemContainer: {
    borderWidth: 3,
    borderColor: "#49A7C2",
    borderRadius: 20,
    minHeight: 110,
    padding: 4,
    //justifyContent: "center",
    alignItems: "center",
    marginBottom: 12
  },
  vacinaItemSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center"
  },
  vacinaItemNome: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  dosesContainer: {
    flex: 1,
    borderLeftWidth: 2,
    borderColor: "#49A7C2",
    height: '90%',
    justifyContent: "center"
  },
  dosesText: {
    marginLeft: 20,
    fontWeight: "500"
  },
  vacinaItemMaisDetalhes: {
    backgroundColor: "#49A7C2",
    width: '90%',
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  vacinaItemMaisDetalhesText: {
    color: "#FFF",
    fontWeight: "500"
  },
  vacinaItemContainerExpanded: {
    borderWidth: 3,
    borderColor: "#49A7C2",
    borderRadius: 20,
    padding: 4,
    justifyContent: 'space-around',
    alignItems: "center",
    marginBottom: 12
  },
  vacinaItemNomeExpanded: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  vacinaItemDoseContainerExpanded: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 10
  },
  vacinaItemDoseTextExpanded: {
    fontWeight: "500"
  },
  qrCodeButton: {
    top: '90%',
    left: "88%",
    zIndex: 1,
    position: "absolute",
    backgroundColor: "#49A7C2",
    shadowColor: "#000",
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    padding: 12,
    borderRadius: 100,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  qrCodeImage: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    backgroundColor: "#49A7C2"
  },
});
