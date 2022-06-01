import React, { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { screen, textStyle } from '../../theme/styles';
import { colors } from '../../theme/colors';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import { getServices } from '../../api/Api';
import { formatDate, Services } from '../../interfaces/interfaces';
import { getDate, modDate, validateError } from '../../functions/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { PildorService } from '../../components/PildorService';
import { FAB, Text } from 'react-native-paper';
import { ModalCalendar } from '../../components/modals/ModalCalendar';
import { ModalTwoCalendar } from '../../components/modals/ModalTwoCalendar';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../routes/PrivatedStackScreen';
import moment from 'moment';

interface Props extends StackScreenProps<RootStackParams, 'Menu'> { };
export const ServicesScreen = ({ navigation }: Props) => {
    const queryClient = useQueryClient();
    const isFocused = useIsFocused();
    const { setMessage, message, logOut, person } = useContext(AppContext);
    const [start, setstart] = useState<formatDate>(getDate());
    const [end, setend] = useState<formatDate>(getDate());
    const [selectStart, setselectStart] = useState<formatDate>(getDate());
    const [selectEnd, setselectEnd] = useState<formatDate>(getDate());
    const [filtrado, setfiltrado] = useState<Array<Services>>();
    const [Pressed, setPressed] = useState<boolean>(false);
    const [interv, setinterv] = useState<boolean>(false);

    const [open, setOpen] = useState<boolean>(false);
    const [openI, setOpenI] = useState<boolean>(false);



    const MyServices = useQuery('MyServices', () => getServices({ start: start.date.date, end: end.date.date, technical: person?.id_person }), {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: data => {
            setfiltrado(() => data.services);
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

    const _onRefresh = async () => {
        await MyServices.refetch();
        await queryClient.resetQueries('JWT');
    };
    const renderItem = (el: any) => {
        let Data: Services;
        Data = el.item;
        return (
            <TouchableOpacity
                delayPressIn={0.5}
                delayPressOut={0.5}
                onPress={() => {
                    if (!Data.isActive) {
                        navigation.navigate('ServiceDetails', { el: Data });
                    } else {
                        setMessage({ message: `Servicio activo\n\n${Data.isDelivered ? `COMUNICATE A MONITOREO PARA REGISTRAR TU SALIDA\n\nFOLIO: ${Data.folio}` : ''}`, type: 'warning' });
                    }
                }}
            >
                <PildorService service={Data} />
            </TouchableOpacity>
        );
    }

    const forDay = (format: string) => {
        const mod: string = getDate().DATE.toJSON();
        const newDate: formatDate = modDate({ dateI: new Date(`${format}${mod.slice(10, mod.length)}`) });
        setstart(newDate);
        setend(newDate);
    }

    useEffect(() => {
        MyServices.refetch();
    }, [start, end, interv]);

    useEffect(() => {
        MyServices.refetch();
    }, []);

    return (
        <SafeAreaView style={[screen.full]}>
            {isFocused && <ModalTwoCalendar show={openI} setOpen={setOpenI} start={selectStart} end={selectEnd} setselectEnd={setselectEnd} setselectStart={setselectStart} setend={setend} setinterv={setinterv} setstart={setstart} />}
            {isFocused && <ModalCalendar show={open} setOpen={setOpen} current={start} forDay={forDay} />}
            {isFocused && <ShowMessage show={(MyServices.isLoading || MyServices.isFetching || Pressed) ? true : false} loading />}
            {(isFocused && message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido')) &&
                <ShowMessage show message={{
                    title: message.type === 'error' ? 'ERROR' : message.type === 'message' ? 'CORRECTO' : 'ALERTA',
                    icon: true,
                    type: message.type,
                    message: message.message
                }}
                />}

            <View style={[{ flex: 9 }, {}]}>
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={2}
                    style={{ ...textStyle.title, color: colors.PrimaryDark, height: 30, textAlign: 'center', width: '100%' }}
                >Inicio: {start.date.date} Final: {end.date.date}</Text>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={_onRefresh}
                            tintColor="#F8852D"
                        />
                    }
                    data={filtrado}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.id_service}`}
                    onEndReachedThreshold={0}
                />
            </View>
            <View style={[style.buttonContainer, { position: 'relative' }]}>
                <FAB
                    style={style.fab}
                    icon="arrow-left-thick"
                    color={colors.PrimaryDark}
                    animated
                    loading={(MyServices.isLoading || MyServices.isFetching) ? true : false}
                    onPress={() => {
                        setstart(modDate({ dateI: start.DATE, days: -1 }));
                        setend(modDate({ dateI: end.DATE, days: -1 }));
                    }}
                    disabled={((MyServices.isLoading || MyServices.isFetching || Pressed) ? true : false)}
                />
                <FAB
                    style={style.fab}
                    icon="calendar-start"
                    color={colors.PrimaryDark}
                    animated
                    loading={(MyServices.isLoading || MyServices.isFetching) ? true : false}
                    onPress={() => setOpenI(() => true)}
                    disabled={((MyServices.isLoading || MyServices.isFetching || Pressed) ? true : false)}
                />
                <FAB
                    style={style.fab}
                    icon="calendar"
                    color={colors.PrimaryDark}
                    animated
                    loading={(MyServices.isLoading || MyServices.isFetching) ? true : false}
                    onPress={() => setOpen(() => true)}
                    disabled={((MyServices.isLoading || MyServices.isFetching || Pressed) ? true : false)}
                />
                <FAB
                    style={style.fab}
                    icon="arrow-right-thick"
                    color={colors.PrimaryDark}
                    animated
                    loading={(MyServices.isLoading || MyServices.isFetching) ? true : false}
                    onPress={() => {
                        const newDate = modDate({ dateI: end.DATE, days: 1 });
                        if (moment(modDate({ dateI: end.DATE, days: 1 }).DATE) <= moment(getDate().DATE)) {
                            setstart(modDate({ dateI: start.DATE, days: 1 }));
                            setend(newDate);
                        }
                    }}
                    disabled={((moment(modDate({ dateI: end.DATE, days: 1 }).DATE) <= moment(getDate().DATE)) ? (MyServices.isLoading || MyServices.isFetching || Pressed) ? true : false : true)}
                />
            </View>
        </SafeAreaView >
    )
}

const style = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.Primary
    },
    fab: {
        marginHorizontal: 20,
        backgroundColor: colors.background,
    },
})
