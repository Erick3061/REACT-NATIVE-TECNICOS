import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { event } from '../interfaces/interfaces'
import { colors } from '../theme/colors'

interface props {
    ev: event
}
export const PildorEvent = ({ ev }: props) => {
    return (
        <View
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                backgroundColor: colors.background,
                marginHorizontal: 5,
                marginVertical: 5,
                padding: 5,
                borderRadius: 15,
                borderColor: colors.Primary,
                borderWidth: 2
            }}
        >
            <Text style={stylesHS.titulos}> FECHA Y HORA: <Text style={stylesHS.subtitulos}> {ev.FechaOriginal} {ev.Hora} </Text></Text>
            <Text style={stylesHS.titulos}> DESCRIPCIÓN: <Text adjustsFontSizeToFit numberOfLines={2} style={[stylesHS.subtitulos]}> {ev.DescripcionEvent} </Text></Text>
            <Text adjustsFontSizeToFit numberOfLines={2} style={stylesHS.titulos}> Zona/Usuario: <Text style={stylesHS.subtitulos}>{ev.CodigoZona} {ev.CodigoUsuario}</Text></Text>
            <Text style={stylesHS.titulos}> EVENTO: <Text style={stylesHS.subtitulos}> {ev.CodigoEvento} </Text></Text>
            <Text style={stylesHS.titulos}> Partición: <Text style={stylesHS.subtitulos}>{ev.Particion}</Text></Text>
        </View>
    )
}
const stylesHS = StyleSheet.create({
    titulos: {
        fontWeight: 'bold',
        color: colors.SecondaryDark,
        fontSize: 17
    },
    subtitulos: {
        fontWeight: '500',
        color: colors.Primary,
        fontSize: 15
    },
})