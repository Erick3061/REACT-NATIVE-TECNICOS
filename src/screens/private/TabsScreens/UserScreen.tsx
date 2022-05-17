import React, { useContext, useEffect } from 'react'
import { FlatList, SafeAreaView, Text, View, RefreshControl } from 'react-native';
import { colors } from '../../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../../../context/AppContext';
import { useQueryClient } from 'react-query';
import { generales, lista_Info, screen } from '../../../theme/styles';
import { user } from '../../../interfaces/interfaces';
import { DecriptRot39 } from '../../../functions/helpers';

export const UserScreen = () => {
    const queryClient = useQueryClient();
    const { account, service } = useContext(AppContext);
    const _onRefresh = async () => queryClient.refetchQueries(['JWT']);

    const renderItem = (el: any) => {
        let Data: user;
        Data = el.item;
        return (
            <>
                <View style={{ ...lista_Info.item, flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon
                            name='person'
                            size={40}
                            color={colors.Primary}
                        />
                    </View>
                    <View style={{ flex: 8, left: 10 }}>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Código de usuario: </Text>{Data.codigo}</Text>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Nombre: </Text> {Data.nombre}</Text>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Clave: </Text> {(service?.isKeyCode) ? DecriptRot39(`${Data.clave}`) : Data.clave}</Text>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Observaciones: </Text> {Data.descripcion}</Text>
                    </View>
                </View>
            </>
        );
    }
    useEffect(() => {
        console.log(service);
    }, [service])

    return (
        (service && service.isTimeExpired)
            ?
            <Text adjustsFontSizeToFit numberOfLines={2}
                style={{ ...generales.titulo1, color: colors.Primary, textAlign: 'center', fontSize: 30, paddingHorizontal: 5 }}
            > El tiempo expiró comunicate con monitoreo </Text>
            :
            <SafeAreaView style={screen.full}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={(queryClient.getQueryState('JWT')?.isFetching) ? true : false}
                            onRefresh={_onRefresh}
                            tintColor="#F8852D"
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    data={account?.users}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.codigo}`}
                />
            </SafeAreaView>
    )
}


