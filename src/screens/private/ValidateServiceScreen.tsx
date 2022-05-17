import React, { useContext, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native';
import { Text } from 'react-native';
import { useQuery } from 'react-query';
import { AppContext } from '../../context/AppContext';
import { GetVerification } from '../../api/Api';
import { validateError, validateUsers, validateZones } from '../../functions/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gFolio, screen, textStyle } from '../../theme/styles';
import { useIsFocused } from '@react-navigation/native';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { Button } from 'react-native-paper';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';

export const ValidateServiceScreen = () => {
    const isFocused = useIsFocused();
    const { service, setMessage, account, message } = useContext(AppContext);
    const [Verify, setVerify] = useState<{ zones: Array<string>, users: Array<string> } | undefined>(undefined);

    const verify = useQuery(["verify"], () => GetVerification(service!.id_service), {
        enabled: true,
        retry: 1,
        onSuccess: data => setVerify(() => data),
        onError: async error => {
            const message = validateError(`${error}`)
            setMessage(message)
        }
    });

    useEffect(() => {
        (isFocused) && verify.refetch();
    }, [isFocused]);

    const validarServicio = async () => {
        if (account && verify.isSuccess && service) {
            const { indefiniteZone, missingZone } = validateZones(account.zones, verify.data.zones);
            const { indefiniteUser, missingUser } = validateUsers(account.users, verify.data.users);

            if (service.isOpCi) {
                if (missingZone.length !== 0) {
                    setMessage({
                        message: `Faltan zonas por enviar ${(indefiniteZone.length > 0) ? `y existen zonas no registradas en el software` : ''} `,
                        type: 'error'
                    });
                } else {
                    if (indefiniteZone.length > 0) {
                        setMessage({
                            message: `Existen zonas no registradas en el software\n\nComunicate a monitoreo`,
                            type: 'error'
                        });
                    } else {
                        if (missingUser.length === account.users.length) {
                            setMessage({
                                message: `Falta al menos una apertura o cierre por enviar ${(indefiniteZone.length > 0) ? `y existen usuarios no registrados en el software` : ''}`,
                                type: 'error'
                            });
                        } else {
                            if (indefiniteUser.length > 0) {
                                setMessage({
                                    message: `Existen usuarios no registrados en el Software\n\nComunicate a monitoreo`,
                                    type: 'error'
                                });
                            } else {
                                setMessage({
                                    message: `Comunicate a monitoreo para la liberación de tu FOLIO`,
                                    type: 'message'
                                });
                            }
                        }
                    }
                }
            } else {
                if (missingZone.length !== 0) {
                    setMessage({
                        message: `Faltan zonas por enviar ${(indefiniteZone.length > 0) ? `y existen zonas no registradas en el software` : ''} `,
                        type: 'error'
                    });
                } else {
                    if (indefiniteZone.length > 0) {
                        setMessage({
                            message: `Existen zonas no registradas en el software\n\nComunicate a monitoreo`,
                            type: 'error'
                        });
                    } else {
                        setMessage({
                            message: `Comunicate a monitoreo para la liberación de tu FOLIO`,
                            type: 'message'
                        });
                    }
                }
            }
        }
    }


    return (
        <SafeAreaView style={screen.full}>
            {
                (
                    message !== undefined &&
                    (message.message !== 'La sesión expiró' && message.message !== 'Token invalido') &&
                    isFocused) &&
                <ShowMessage
                    show message={{
                        icon: true,
                        type: message.type,
                        message: message.message,
                        title: (message.type === 'error') ? 'ERROR' : (message.type === 'message') ? 'Correcto' : 'Alerta'
                    }}
                />
            }
            {isFocused && <ShowMessage show={(verify.isLoading || verify.isFetching) ? true : false} loading />}
            <ScrollView refreshControl={<RefreshControl refreshing={(verify.isLoading || verify.isFetching) ? true : false} onRefresh={() => verify.refetch()} />} >
                <Text style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center' }}>Zonas Enviadas</Text>
                <View style={gFolio.container}>
                    {
                        (verify.isSuccess && Verify && account) &&
                        account.zones.map((el) => {
                            return (
                                <View
                                    key={`CuadroZonas${el.codigo}`}
                                    style={{ ...gFolio.cuadros, backgroundColor: ((`${el.codigo}` === Verify.zones.find(z => z === `${el.codigo}`)) ? `rgba(0, 160, 0, .9)` : `rgba(134, 134, 134, 0.5)`) }}
                                >
                                    <Icon
                                        name='radio-button-on-outline'
                                        size={30}
                                        color={'white'}
                                    />
                                    <Text style={gFolio.texto}>{el.codigo}</Text>
                                </View>
                            )
                        })
                    }
                </View>
                {
                    service?.isOpCi &&
                    <>
                        <Text style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center' }}>Zonas no definidas en el software</Text>
                        <View style={gFolio.container}>
                            {
                                (verify.isSuccess && account) &&
                                verify.data.zones.map(ze => {
                                    if (account.zones.find(f => `${f.codigo}` === `${ze}`) === undefined) {
                                        return (
                                            <View
                                                key={`CuadroZonasUndefined${ze}`}
                                                style={{ ...gFolio.cuadros, backgroundColor: `rgba(160, 160, 0, .9)` }}
                                            >
                                                <Icon
                                                    name='radio-button-on-outline'
                                                    size={30}
                                                    color={'white'}
                                                />
                                                <Text style={gFolio.texto}>{ze}</Text>
                                            </View>
                                        )
                                    }
                                })
                            }
                        </View>
                    </>
                }
                <Text style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center' }}>Usuarios enviados</Text>
                <View style={gFolio.container}>
                    {
                        (Verify && account) &&
                        account.users.map((el) => {
                            return (
                                <View
                                    key={`CuadroUsers${el.codigo}`}
                                    style={{ ...gFolio.cuadros, backgroundColor: ((`${el.codigo}` === Verify.users.find(z => z === `${el.codigo}`)) ? `rgba(0, 160, 0, .9)` : `rgba(134, 134, 134, 0.5)`) }}
                                >
                                    <Icon
                                        name='person-outline'
                                        size={30}
                                        color={'white'}
                                    />
                                    <Text style={gFolio.texto}>{el.codigo}</Text>
                                </View>
                            )
                        })
                    }
                </View>

                <Text style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center' }}>Usuarios no definidos en el software</Text>
                <View style={gFolio.container}>
                    {
                        (verify.isSuccess && account) &&
                        verify.data.users.map(ze => {
                            if (account?.users.find(f => `${f.codigo}` === `${ze}`) === undefined) {
                                return (
                                    <View
                                        key={`CuadroUsersUndefined${ze}`}
                                        style={{ ...gFolio.cuadros, backgroundColor: `rgba(160, 160, 0, .9)` }}
                                    >
                                        <Icon
                                            name='person-outline'
                                            size={30}
                                            color={'white'}
                                        />
                                        <Text style={gFolio.texto}>{ze}</Text>
                                    </View>
                                )
                            }
                        })
                    }
                </View>

                <View style={{ alignItems: 'center', marginBottom: 25 }}>
                    <Button
                        style={{ borderRadius: 12, marginVertical: 10, width: '70%' }}
                        contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                        color={colors.background}
                        icon={'download'}
                        mode='contained'
                        loading={(verify.isFetching || verify.isLoading) ? true : false}
                        onPress={validarServicio}
                        disabled={(verify.isFetching || verify.isLoading) ? true : false}
                        labelStyle={{ fontSize: 15, color: colors.Primary }}
                    > Obtener folio</Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
