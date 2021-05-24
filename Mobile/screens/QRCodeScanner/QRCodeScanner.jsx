import React, { useEffect, useState } from 'react';

import { View, Text, Alert, StyleSheet } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { Button } from 'react-native-paper';

export default function QRCodeVacinaScanner() {
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

  const handleQrCodeRead = result => {
    setScanned(true);
    Alert.alert(JSON.stringify(result.data));
  }

  return (
    <>
      <View style={styles.container}>
        <Button
          icon="arrow-left"
          mode="text"
          labelStyle={{ color: "white", fontSize: 24 }}
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
    </>
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