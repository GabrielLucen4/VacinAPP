import React from 'react';

import { TouchableOpacity, Image } from 'react-native';

export default function BotaoQrCode({ styles }) {
  return (
    <TouchableOpacity style={styles.qrCodeButton}>
        <Image
          style={styles.qrCodeImage}
          source={require('../../assets/qrcode.png')}
        />
    </TouchableOpacity>
  )
}