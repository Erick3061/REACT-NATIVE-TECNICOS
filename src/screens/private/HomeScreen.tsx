import React, { useContext } from 'react'
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateError } from '../../functions/helpers';
import { useQuery } from 'react-query';
import { validarJWT } from '../../api/Api';
import { textStyle, screen } from '../../theme/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

export const HomeScreen = () => {
    const isFocused = useIsFocused();
    const { setPerson, setService, logOut, setMessage, message } = useContext(AppContext);
    const JWT = useQuery(["JWT"], () => validarJWT(), {
        enabled: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: 1,
        onSuccess: async ({ Person, token, Service }) => {
            if (Person.id_role !== 1) {
                await AsyncStorage.clear();
                setMessage(validateError('No tienes acceso a este sistema'));
            } else {
                await setPerson(Person, token);
                setService(Service);
            }
        },
        onError: async error => {
            const message = validateError(`${error}`)
            await AsyncStorage.clear();
            logOut();
            setMessage(message);
        }
    });

    return (
        <SafeAreaView style={[screen.full, { justifyContent: 'center' }]}>
            {isFocused && (message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido')) &&
                <ShowMessage show message={{
                    title: 'ERROR',
                    icon: true,
                    type: message.type,
                    message: message.message
                }} />}
            {isFocused && <ShowMessage show={(JWT.isLoading || JWT.isFetching) ? true : false} loading />}
            <Text
                style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center', position: 'absolute', top: 10, marginVertical: 15 }}
                adjustsFontSizeToFit
                numberOfLines={1}
            >DESLIZA HACIA ABAJO PARA ACTUALIZAR</Text>
            <Image
                source={require('../../assets/logo.png')}
                style={{ borderColor: colors.PrimaryDark, width: '100%', height: 300 }}
                resizeMode='contain'
            />
            <ScrollView
                style={[{ width: '100%', height: '100%', position: 'absolute' }]}
                refreshControl={<RefreshControl refreshing={(JWT.isLoading || JWT.isFetching)} onRefresh={() => JWT.refetch()} />}
            >
                <Text></Text>
            </ScrollView>
        </SafeAreaView >
    )
}
