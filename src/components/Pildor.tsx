import React from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { generales } from '../theme/styles';
interface Props {
    contenedor: 'chico' | 'grande';
    titulo1: string | null | undefined;
    titulo2: string | null | undefined;
    icon_name: string;
}
export const Pildor = ({ contenedor, titulo1, titulo2, icon_name }: Props) => {
    return (
        <View style={(contenedor === 'chico') ? generales.contenedor_chico : generales.contenedor_grande} >
            <View style={generales.contenedor_carta}>
                <Text style={generales.titulo2}>{titulo1?.trim()}</Text>
                <Icon name={icon_name} size={40} color={colors.Primary} />
                <Text style={{ ...generales.titulo2, fontSize: 15 }}>{titulo2?.trim()}</Text>
            </View>
        </View >
    )
}
