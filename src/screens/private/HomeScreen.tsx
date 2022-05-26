import React, { useContext, useState } from 'react';
import { Image, RefreshControl, ScrollView } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { useQueryClient } from 'react-query';
import { textStyle, screen } from '../../theme/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Snackbar, Text } from 'react-native-paper';

export const HomeScreen = () => {
    const queryClient = useQueryClient();
    const isFocused = useIsFocused();
    const { message, person } = useContext(AppContext);
    return (
        <SafeAreaView style={[screen.full, { justifyContent: 'center' }]}>
            {isFocused && (message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido')) &&
                <ShowMessage show message={{
                    title: 'ERROR',
                    icon: true,
                    type: message.type,
                    message: message.message
                }} />}
            {isFocused && <ShowMessage show={(queryClient.getQueryState('JWT')?.isFetching) ? true : false} loading />}
            <ScrollView
                style={[{ width: '100%', height: '100%', position: 'absolute' }]}
                refreshControl={<RefreshControl refreshing={(queryClient.getQueryState('JWT')!.isFetching)} onRefresh={() => queryClient.refetchQueries('JWT')} />}
            >
                <Text style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center', top: 10, marginVertical: 15, paddingHorizontal: 5, fontWeight: 'bold' }}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                >{person?.enterpriceShortName}</Text>
                <Image
                    source={require('../../assets/logo.png')}
                    style={{ borderColor: colors.PrimaryDark, width: '100%', height: 300 }}
                    resizeMode='contain'
                />
            </ScrollView>
            <Snackbar
                visible
                style={{ backgroundColor: colors.background }}
                theme={{ colors: { surface: colors.Primary } }}
                onDismiss={() => { }}
            >
                DESLIZA HACIA ABAJO PARA ACTUALIZAR
            </Snackbar>
        </SafeAreaView >
    )
}
