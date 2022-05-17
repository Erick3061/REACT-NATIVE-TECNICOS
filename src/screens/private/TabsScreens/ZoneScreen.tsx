import React, { useContext } from 'react'
import { Text, View, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { colors } from '../../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../../../context/AppContext';
import { zone } from '../../../interfaces/interfaces';
import { generales, lista_Info, screen } from '../../../theme/styles';
import { useQueryClient } from 'react-query';

export const ZoneScreen = () => {
    const queryClient = useQueryClient();
    const { account, service } = useContext(AppContext);
    const _onRefresh = async () => queryClient.refetchQueries(['JWT']);
    const renderItem = (el: any) => {
        let Data: zone;
        Data = el.item;
        return (
            <>
                <View style={{ ...lista_Info.item, flexDirection: 'row' }}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon
                            name='radio-button-on-outline'
                            size={40}
                            color={colors.Primary}
                        />
                    </View>
                    <View style={{ flex: 8, left: 10 }}>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Numero de zona: </Text> {Data.codigo}</Text>
                        <Text style={lista_Info.title}><Text style={lista_Info.subtitle_in_title}>Descripción: </Text> {Data.descripcion}</Text>
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
                    data={account?.zones}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.codigo}`}
                />
            </SafeAreaView>
    )
}
