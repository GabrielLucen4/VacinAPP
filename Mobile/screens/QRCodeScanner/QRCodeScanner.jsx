import React, { useEffect, useState } from 'react';

import { View, Text, Alert, StyleSheet } from 'react-native';

import AsyncStorage from "@react-native-community/async-storage";

import ScreenSchema from '../../components/ScreenSchema/ScreenSchema';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { Button } from 'react-native-paper';
import { cadastraVacinacao } from '../../controllers/vacinacao';


export default function QRCodeVacinaScanner({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    async function requestPermission () {
      try {
        const { status } = await Camera.requestPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      }
      catch (e) {
        console.log(e)
      }
    }
    requestPermission();
  }, [hasCameraPermission])

  const handleQrCodeRead = async (result) => {
    const token = await AsyncStorage.getItem("token");

    setScanned(true);
    cadastraVacinacao(result.data, token).then(status => {
      if (status === 400) {
        Alert.alert("Erro ao confirmar vacinação.");
        setTimeout(() => {
          setScanned(false);
        }, 2000);
      } else {
        navigation.pop();
      }
    }).catch(err => {
      Alert.alert(err);
    })
  }

  return (
    <ScreenSchema>
      <View style={styles.container}>
        <Button
          icon="arrow-left"
          mode="text"
          labelStyle={{ color: "white", fontSize: 24 }}
          onPress={() => navigation.pop()}
        >Sair</Button>
        {scanned}
      </View>
      {
        hasCameraPermission === null
        ? <Text style={{ color: "#FFF" }}>Solicitando permissão de câmera.</Text>
        : hasCameraPermission === false
          ? <Text style={{ color: "#FFF" }}>Permição de câmera negada!</Text>
          : <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleQrCodeRead}
              style={{
                height: '80%',
                width: '100%',
              }}/>
      }
    </ScreenSchema>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '10%',
    alignItems: 'flex-start',
    justifyContent: "flex-start",
    width: '100%'
  }
})