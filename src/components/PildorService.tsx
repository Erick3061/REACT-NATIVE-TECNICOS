import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { Services, Service } from '../interfaces/interfaces';
import { colors } from '../theme/colors';

interface props {
    service: Services
}

export const PildorService = ({ service }: props) => {
    return (
        <View
            style={{
                display: 'flex',
                backgroundColor: service.isActive ? colors.send : colors.background,
                marginHorizontal: 5,
                marginVertical: 5,
                padding: 5,
                borderRadius: 15,
                flexDirection: 'column',
                borderColor: colors.Primary,
                borderWidth: 2
            }}
        >

            <Text
                style={stylesHS.titulos}
                adjustsFontSizeToFit
                numberOfLines={2}
            >CUENTA: <Text style={{ color: colors.PrimaryDark, fontWeight: '400' }}>{service.nameAccount}</Text></Text>
            <Text
                style={stylesHS.titulos}
                adjustsFontSizeToFit
                numberOfLines={2}
            >Fecha y hora entrada: <Text style={{ color: colors.PrimaryDark, fontWeight: '400' }}>{`${service.entryDate}`.replace('T', ' ').replace('.000Z', '')}</Text></Text>
            <Text
                style={stylesHS.titulos}
                adjustsFontSizeToFit
                numberOfLines={2}
            >Fecha y hora salida: <Text style={{ color: colors.PrimaryDark, fontWeight: '400' }}>{`${service.exitDate}`.replace('T', ' ').replace('.000Z', '')}</Text></Text>
            <Text style={stylesHS.titulos}>Abonado/Digital: <Text style={stylesHS.subtitulos}>{service.digital}</Text></Text>
            <Text style={stylesHS.titulos}>Cliente: <Text style={stylesHS.subtitulos}>{service.accountMW}</Text></Text>
        </View>
    )
}

const stylesHS = StyleSheet.create({
    titulos: {
        fontWeight: 'bold',
        color: colors.SecondaryDark,
        fontSize: 16
    },
    subtitulos: {
        fontWeight: '500',
        color: colors.Primary,
        fontSize: 14
    },
});