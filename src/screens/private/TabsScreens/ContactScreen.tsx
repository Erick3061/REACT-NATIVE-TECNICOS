import React, { useContext } from 'react'
import { FlatList, RefreshControl, SafeAreaView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import { AppContext } from '../../../context/AppContext';
import { useQueryClient } from 'react-query';
import { lista_Info, generales, screen } from '../../../theme/styles';
import { contact } from '../../../interfaces/interfaces';

export const ContactScreen = () => {
    const queryClient = useQueryClient();
    const { account, service } = useContext(AppContext);
    const _onRefresh = async () => queryClient.refetchQueries(['JWT']);

    const renderItem = (el: any) => {
        let Data: contact;
        Data = el.item;
        return (
            <>
                <View style={{ ...lista_Info.item, flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon
                            name='call'
                            size={40}
                            color={colors.Primary}
                        />
                    </View>
                    <View style={{ flex: 8, left: 10 }}>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Código: </Text>{Data.codigo}</Text>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Nombre: </Text>{Data.contacto}</Text>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Telefono: </Text> {Data.telefono}</Text>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Observaciones: </Text> {Data.descripcion}</Text>
                    </View>
                </View>
            </>
        );
    }

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
                    data={account?.contacts}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.codigo}`}
                />
            </SafeAreaView>

    )
}

