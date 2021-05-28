import React from 'react';

import { TouchableOpacity, Image } from 'react-native';

export default function BotaoQrCode({ styles, onPress }) {
  return (
    <TouchableOpacity style={styles.qrCodeButton} onPress={onPress}>
        <Image
          style={styles.qrCodeImage}
          source={require('../../assets/qrcode.png')}
        />
    </TouchableOpacity>
  )
}