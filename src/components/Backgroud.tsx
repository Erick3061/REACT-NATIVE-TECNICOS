import React from 'react'
import { View, Image } from 'react-native';

export const Background = () => {
    return (
        <View style={{ alignItems: 'center', height: 250 }}>
            <Image
                source={require('../assets/fondo1.png')}
                style={{ width: '100%', height: '100%', resizeMode: 'cover', position: 'absolute' }}
            />
            <Image
                source={{ uri: 'https://pem-sa.ddns.me/assets/logos/logo2.png' }}
                style={{ width: 200, height: 200, }}
            />
        </View>
    )
}
