import { StackScreenProps } from '@react-navigation/stack';
import React, { Fragment, useContext, useState } from 'react'
import { Appbar, Card, Chip, Text, Title } from 'react-native-paper';
import { RootStackParams } from '../../routes/PrivatedStackScreen';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getImgs, getServiceWithDetails } from '../../api/Api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView, StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { validateError } from '../../functions/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { screen } from '../../theme/styles';
import { technical } from '../../interfaces/interfaces';
import { CardImage } from '../../components/CardImage';

interface Props extends StackScreenProps<RootStackParams, 'ServiceDetails'> { };
export const ServiceDetails = ({ navigation, route }: Props) => {
    const queryClient = useQueryClient();
    const { setMessage, message, logOut, person } = useContext(AppContext);
    const isFocused = useIsFocused();
    const [Technical, setTechnical] = useState<technical | undefined>();

    const [Zones, setZones] = useState<Array<{ code: string, desc: string }>>();
    const [ZonesMissing, setZonesMissing] = useState<Array<{ code: string, desc: string }>>();
    const [ZonesUndefined, setZonesUndefined] = useState<Array<string>>();

    const [Users, setUsers] = useState<Array<{ code: string, name: string }>>();
    const [UsersMissing, setUsersMissing] = useState<Array<{ code: string, name: string }>>();
    const [UsersUndefined, setUsersUndefined] = useState<Array<string>>();

    const ServiceDetails = useQuery('serviceDetails', () => getServiceWithDetails(route.params.el.id_service), {
        onSuccess: async data => {
            try {
                const technicals: Array<technical> = JSON.parse(`${data.binnacle[0].technicals}`);
                if (typeof technicals === 'object') {
                    setTechnical(technicals.find(f => f.employeeNumber === person?.employeeNumber));
                }
                const zones: Array<{ code: string, desc: string }> = JSON.parse(data.binnacle[0].zones);
                setZones(zones);
                const zonesMissing: Array<{ code: string, desc: string }> = JSON.parse(data.binnacle[0].missingZones);
                setZonesMissing(zonesMissing);
                const zonesUndefined = JSON.parse(data.binnacle[0].zonesUndefined);
                setZonesUndefined(zonesUndefined);
                const users: Array<{ code: string, name: string }> = JSON.parse(data.binnacle[0].users);
                setUsers(users);
                const usersMissing: Array<{ code: string, name: string }> = JSON.parse(data.binnacle[0].missingUsers);
                setUsersMissing(usersMissing);
                const usersUndefined = JSON.parse(data.binnacle[0].usersUndefined);
                setUsersUndefined(usersUndefined);
                if (data.service.filesCron === 'going up') {
                    getFiles.mutate({ id: data.service.id_service, type: 'Service' });
                }
            } catch (error) {
                return ShowMessage({ show: true, message: { message: `${error}`, type: 'error', icon: true, title: 'ERRROR' } });
            }
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

    const getFiles = useMutation('files', getImgs, {
        retry: 0,
        onError: error => {
            setMessage(validateError(`${error}`));
        }
    });

    return (
        <SafeAreaView style={screen.full}>
            {isFocused && <ShowMessage show={(ServiceDetails.isLoading || ServiceDetails.isFetching) ? true : false} loading />}
            {(isFocused && message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido')) &&
                <ShowMessage show message={{ title: message.type === 'error' ? 'ERROR' : message.type === 'message' ? 'CORRECTO' : 'ALERTA', icon: true, type: message.type, message: message.message }} />}
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={route.params.el.nameAccount} />
            </Appbar.Header>
            <ScrollView
                style={[{ width: '100%', height: '100%' }]}
                refreshControl={<RefreshControl refreshing={(ServiceDetails.isLoading || ServiceDetails.isFetching)}
                    onRefresh={async () => {
                        await ServiceDetails.refetch();
                        await queryClient.resetQueries('JWT');
                        await queryClient.refetchQueries('MyServices');
                    }}
                />}
            >
                {
                    (ServiceDetails.data && ServiceDetails.isSuccess) &&
                    <>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>Técnico</Title>
                                <Text style={styles.subTitle}>Nombre: <Text>{Technical?.fullName}</Text></Text>
                                <Text style={styles.subTitle}>phoneNumber: <Text>{(Technical?.phoneNumber === 'null') ? '' : Technical?.phoneNumber}</Text></Text>
                                <Text style={styles.subTitle}>Número de empleado: <Text>{Technical?.employeeNumber}</Text></Text>
                                <Text style={styles.subTitle}>Empresa: <Text>{Technical?.enterpriceShortName}</Text></Text>
                                <Text style={styles.subTitle}>Usuario: <Text>{(Technical?.nameUser === 'null') ? '' : Technical?.nameUser}</Text></Text>
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>Detalles del servicio</Title>
                                {(Technical?.withOutFolio === 'true') ? <Text style={styles.subTitle}>SIN FOLIO</Text> : (ServiceDetails.data.service.isDelivered) ? <Text style={[styles.subTitle, { fontSize: 19, marginBottom: 10, color: colors.SecondaryDark }]}>FOLIO: {ServiceDetails.data.service.folio}</Text> : <Text style={styles.subTitle}>SIN FOLIO</Text>}
                                <Text style={styles.subTitle}>Tipo de servicio: <Text style={styles.text}>{(ServiceDetails.data.service.id_type === 1 ? 'MANTENIMIENTO' : 'CENTRALIZACÓN')}</Text></Text>
                                <Text style={styles.subTitle}>Estado del enlace: <Text style={styles.text}>{ServiceDetails.data.binnacle[0].link}</Text></Text>
                                <Text style={styles.subTitle}>Dio entrada: <Text style={styles.text}>{`${ServiceDetails.data.service.grantedEntry}`}</Text></Text>
                                <Text style={styles.subTitle}>Dio salida: <Text style={styles.text}>{`${ServiceDetails.data.service.grantedExit}`}</Text></Text>
                                <Text style={styles.subTitle}>Verificación de encargado: <Text style={styles.text}>{`${ServiceDetails.data.service.firstVerification}`}</Text></Text>
                                <Text style={styles.subTitle}>Verificación de operador: <Text style={styles.text}>{`${ServiceDetails.data.service.secondVerification}`}</Text></Text>
                                <Text style={styles.subTitle}>Fecha y Hora Entrada: <Text style={styles.text}>{`${ServiceDetails.data.service.entryDate}`.replace('T', ' ').replace('.000Z', '')}</Text></Text>
                                <Text style={styles.subTitle}>Fecha y Hora Salida: <Text style={styles.text}>{`${ServiceDetails.data.service.exitDate}`.replace('T', ' ').replace('.000Z', '')}</Text></Text>
                                <Text style={styles.subTitle}>Cliente: <Text style={styles.text}>{`${ServiceDetails.data.service.accountMW}`}</Text></Text>
                                <Text style={styles.subTitle}>Digital: <Text style={styles.text}>{`${route.params.el.digital}`}</Text></Text>
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>Comentarios</Title>
                                {
                                    ServiceDetails.data.comments.map((c, idx) => {
                                        return (
                                            <Fragment key={`Comm-${idx + 1}`}>
                                                <Text style={styles.subTitle}>-{c.person}:</Text>
                                                <Text style={styles.text}>{c.comment}</Text>
                                            </Fragment>
                                        )
                                    })
                                }
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>Zonas</Title>
                                <Title style={styles.subTitle}>Zonas enviadas</Title>
                                {Zones?.map(z =>
                                    <Chip
                                        key={`ze-${z.code}`}
                                        style={styles.chip}
                                        icon="record">
                                        {z.desc}
                                    </Chip>
                                )}
                                <Title style={styles.subTitle}>Zonas faltantes</Title>
                                {ZonesMissing?.map(z =>
                                    <Chip
                                        key={`zm-${z.code}`}
                                        style={styles.chip}
                                        icon="record">
                                        {z.desc}
                                    </Chip>
                                )}
                                <Title style={styles.subTitle}>Zonas no definidas en el software</Title>
                                {ZonesUndefined?.map(z =>
                                    <Chip
                                        key={`zm-${z}`}
                                        style={styles.chip}
                                        icon="record">
                                        {z}
                                    </Chip>
                                )}

                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>Usuarios</Title>
                                <Title style={styles.subTitle}>Usuarios enviados</Title>
                                {Users?.map(u =>
                                    <Chip
                                        key={`ue-${u.code}`}
                                        style={styles.chip}
                                        icon="record">
                                        {u.name}
                                    </Chip>
                                )}
                                <Title style={styles.subTitle}>Usuarios no enviados</Title>
                                {UsersMissing?.map(u =>
                                    <Chip
                                        key={`une-${u.code}`}
                                        style={styles.chip}
                                        icon="record">
                                        {u.name}
                                    </Chip>
                                )}
                                <Title style={styles.subTitle}>Usuarios no definidos en el software</Title>
                                {UsersUndefined?.map(u =>
                                    <Chip
                                        key={`uu-${u}`}
                                        style={styles.chip}
                                        icon="record">
                                        {u}
                                    </Chip>
                                )}
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content style={{ display: 'flex' }}>
                                <Title style={styles.title}>Fotos</Title>
                                {
                                    getFiles.isLoading
                                        ? <Title style={styles.subTitle}>Cargando...</Title>
                                        : getFiles.data
                                            ? <CardImage files={getFiles.data.files} id_service={ServiceDetails.data.service.id_service} />
                                            : <Title style={styles.subTitle}>Sin imágenes</Title>
                                }
                            </Card.Content>
                        </Card>
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 30,
        shadowColor: colors.PrimaryDark,
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 10
    },
    title: {
        color: colors.SecondaryDark,
        fontSize: 25,
        marginBottom: 10
    },
    subTitle: {
        color: colors.Primary,
        fontSize: 16,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 10,
        color: colors.PrimaryLight
    },
    chip: {
        marginHorizontal: 5,
        marginVertical: 5
    },
});