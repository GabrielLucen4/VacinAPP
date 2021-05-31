import React, { useRef, useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Transitioning, Transition } from "react-native-reanimated";
import AsyncStorage from "@react-native-community/async-storage";

import ScreenSchema from "../../components/ScreenSchema/ScreenSchema";
import Context from "../../components/Context";
import VacinaItem from "../../components/VacinaItem";
import BotaoQrCode from "../../components/BotaoQrCode";
import { Button } from "react-native-paper";

import jwtDecode from "jwt-decode";
import { getVacinacoes } from "../../controllers/vacinacao";

export default function Main({ navigation }) {
  // Nome do paciente.
  const [nome, setNome] = useState("");
  // Dados das vacinações tomadas.
  const [data, setData] = useState([]);

  // Configs da animação de transição do card da vacina
  const transitionRef = useRef();
  const transition = <Transition.Change interpolation="easeInOut" />;

  // Pega função de singout do Context
  const { signOut } = React.useContext(Context);

  // Quando o card é pressionado, ele faz a animação de transição.
  const onPress = () => {
    transitionRef.current.animateNextTransition();
  };

  // renderiza os cards das Vacinas
  const renderItem = ({ item }) => {
    return <VacinaItem dados={item} styles={styles} onPress={onPress} />;
  };

  // função para tratar o nome, pega somente o primeiro e o último sobrenome
  const trataNome = (nome) => {
    const nomes = nome.split(" ");
    nome = nomes[0] + " " + nomes[nomes.length - 1];
    return nome;
  };

  useEffect(() => {
    // Pega as informações do paciente no banco de dados, como nome e as vacinações
    async function getInfo() {
      const token = await AsyncStorage.getItem("token");
      const getNome = async () => {
        let nome = jwtDecode(token).nome; // faz o decode no token para pegar o nome do paciente.
        nome = trataNome(nome);
        setNome(nome);
      };
      const getVacinacoesUser = async () => {
        const data = await getVacinacoes(token);
        setData(data);
      };
      getNome();
      getVacinacoesUser();
    }

    // listener para quando a tela estiver em voltar ao foco,
    // buscar as informações de novo no banco de dados
    const unsubscribe = navigation.addListener("focus", async () => {
      await getInfo();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScreenSchema>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            signOut();
          }}
        >
          <Button icon="logout" labelStyle={styles.logoutLabel}></Button>
        </TouchableOpacity>
        <View style={styles.subContainerHeader}>
          <Text style={styles.vacinAppText}>VacinApp</Text>
          <View style={styles.nomeContainer}>
            <Text style={styles.nomeText}>{nome}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={styles.containerVacinas}>
        {
          // caso o paciente tenha alguma vacinação registrada,
          // será mostrada a FlatList com as vacinações,
          // caso contrário, será mostrado o texto: Nenhuma vacina cadastrada.
          data.length > 0 ? (
            <Transitioning.View
              ref={transitionRef}
              transition={transition}
              style={{ flex: 1 }}
            >
              <FlatList
                keyExtractor={(item) => item._id}
                data={data}
                renderItem={renderItem}
              />
            </Transitioning.View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma vacina cadastrada.</Text>
            </View>
          )
        }
        <BotaoQrCode
          styles={styles}
          onPress={() => navigation.navigate("QRCodeScanner")}
        />
      </View>
    </ScreenSchema>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: "row",
    flex: 0.2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 0,
  },
  logoutButton: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
  },
  logoutLabel: {
    color: "#FFF",
    fontSize: 32,
  },
  subContainerHeader: {
    flex: 6,
    width: "90%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  vacinAppText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFF",
  },
  nomeContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
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
    padding: 20,
    marginBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#a0a0a0",
    fontSize: 16,
  },
  vacinaItemContainer: {
    borderWidth: 3,
    borderColor: "#49A7C2",
    borderRadius: 20,
    minHeight: 110,
    padding: 4,
    //justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  vacinaItemSubContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  dosesText: {
    fontWeight: "500",
  },
  vacinaItemMaisDetalhes: {
    backgroundColor: "#49A7C2",
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  vacinaItemMaisDetalhesText: {
    color: "#FFF",
    fontWeight: "500",
  },
  vacinaItemContainerExpanded: {
    borderWidth: 3,
    borderColor: "#49A7C2",
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
  },
  vacinaItemNomeExpanded: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  vacinaItemDoseContainerExpanded: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  vacinaItemDoseTextExpanded: {
    fontWeight: "500",
  },
  qrCodeButton: {
    top: "92%",
    left: "85%",
    zIndex: 1,
    position: "absolute",
    backgroundColor: "#49A7C2",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
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
    backgroundColor: "#49A7C2",
  },
});
