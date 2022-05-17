import React, { useEffect } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Pildor } from '../../components/Pildor';
import { colors } from '../../theme/colors';
import { generales, screen } from '../../theme/styles';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getExpired, validateError } from '../../functions/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { useQuery } from 'react-query';
import { GetAccountMW, validarJWT } from '../../api/Api';
import { useIsFocused } from '@react-navigation/native';
import { Text } from 'react-native-paper';

export const AccountGeneral = () => {
    const { service, account, setAccount, logOut, message, setMessage, setPerson, setService, setExpired, expired } = useContext(AppContext);
    const isFocused = useIsFocused();
    const JWT = useQuery(["JWT"], () => validarJWT(), {
        enabled: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: 1,
        onSuccess: async ({ Person, token, Service }) => {
            await setPerson(Person, token);
            setService(Service);
            if (Service) {
                const expired = getExpired(new Date(Service.exitDate));
                setExpired(expired);
            } else {
                setExpired(undefined);
            }
        },
        onError: async error => {
            const message = validateError(`${error}`)
            await AsyncStorage.clear();
            logOut();
            setMessage(message);
        }
    });

    const Account = useQuery(["Account"], () => GetAccountMW((service?.id_service) ? service.id_service : ''), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: true,
        retry: 1,
        onSuccess: data => {
            const { account } = data;
            setAccount(account);
        },
        onError: async error => {
            const message = validateError(`${error}`)
            setMessage(message)
            if (message?.message === 'La sesión expiró' || message?.message === 'Token invalido') {
                await AsyncStorage.clear();
                await logOut();
            }
        }
    });
    const consulta = () => {
        Account.refetch().then(() => {
            JWT.refetch();
        })
    }
    useEffect(() => {
        consulta();
    }, [service]);
    return (
        <SafeAreaView style={screen.full}>
            {(isFocused && message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido')) && <ShowMessage show message={{
                title: 'ERROR',
                icon: true, type: message.type,
                message: message.message
            }} />}
            {isFocused && <ShowMessage show={(Account.isLoading || Account.isFetching) ? true : false} loading />}
            <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={consulta} />}>
                {
                    (service && !service.isTimeExpired) &&
                        (expired) ?
                        <>
                            <Text style={{ ...generales.contenedor_carta, ...generales.titulo1, paddingVertical: 15, textAlign: 'center' }}>{account?.Nombre}</Text>
                            <View style={{ flexDirection: 'row' }} >
                                <Pildor
                                    contenedor='chico'
                                    titulo1='Digital'
                                    titulo2={account?.CodigoAbonado}
                                    icon_name='newspaper-outline'
                                    key='Digital'
                                />
                                <Pildor
                                    contenedor='chico'
                                    titulo1='Panel'
                                    titulo2={account?.panel.nombre}
                                    icon_name='tv-outline'
                                    key='Panel'
                                />
                            </View>
                            <Pildor
                                contenedor='grande'
                                titulo1='Direccón'
                                titulo2={account?.Direccion}
                                icon_name='book-outline'
                                key='Direccón'
                            />
                            <Pildor
                                contenedor='grande'
                                titulo1='Ubicacón'
                                titulo2={account?.panel.UbicacionCliente}
                                icon_name='navigate-outline'
                                key='Ubicacón'
                            />
                            <Pildor
                                contenedor='grande'
                                titulo1='Municipio'
                                titulo2={account?.panel.MunicipioCliente}
                                icon_name='locate-outline'
                                key='Municipio'
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Pildor
                                    contenedor='chico'
                                    titulo1='Estado'
                                    titulo2={account?.panel.EstadoCliente}
                                    icon_name='pin-outline'
                                    key='Estado'
                                />
                                <Pildor
                                    contenedor='chico'
                                    titulo1='Palabra clave'
                                    titulo2={''}
                                    icon_name='help-outline'
                                    key='Palabra clave'
                                />
                            </View>
                        </>
                        :
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={2}
                            style={{ ...generales.titulo1, color: colors.Primary, textAlign: 'center', fontSize: 30, paddingHorizontal: 5 }}
                        >
                            El tiempo expiró comunicate con monitoreo
                        </Text>
                }
            </ScrollView>
        </SafeAreaView >
    )
}
