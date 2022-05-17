import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Pressable, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';
import { modDate, getDate, validateError } from '../../functions/helpers';
import { formatDate, event } from '../../interfaces/interfaces';
import { colors } from '../../theme/colors';
import { screen } from '../../theme/styles';
import { useQuery } from 'react-query';
import { GetEvents } from '../../api/Api';
import { PildorEvent } from '../../components/PildorEvent';
import { useIsFocused } from '@react-navigation/native';
import { ShowMessage } from '../../components/modals/ModalShowMessage';

export const EventsScreen = () => {
    const isfocused = useIsFocused();
    const { service, setMessage, expired, message } = useContext(AppContext);
    const [events, setevents] = useState<Array<event>>([]);
    const [Pressed, setPressed] = useState<boolean>(false);
    const [auto, setauto] = useState<boolean>(false);

    const [StartRecients, setStartRecients] = useState<formatDate | undefined>(() => modDate({ dateI: new Date(service!.entryDate) }));
    const [EndRecients, setEndRecients] = useState<formatDate | undefined>(() => modDate({ dateI: new Date(getDate().DATE.toJSON()) }));

    const [data, setdata] = useState<{ id_service: string; start: string; end: string; }>({
        id_service: (service) ? service.id_service : '',
        start: `${StartRecients?.date.date}T${StartRecients?.time.time}`,
        end: `${EndRecients?.date.date}T${EndRecients?.time.time}`
    });

    const Events = useQuery(['Events'], () => GetEvents(data), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: false,
        retry: 1,
        onSuccess: data => {
            setPressed(false);
            setStartRecients(() => EndRecients);
            filtro(data.events);
        },
        onError: error => {
            setPressed(false);
            setMessage(validateError(`${error}`));
        }
    });

    const filtro = (eventsSF: Array<event>) => {
        let MissingEvents: Array<event> = [];
        eventsSF.forEach(async el => {
            const Ev = events.find(fi => JSON.stringify(el) === JSON.stringify(fi));
            if (Ev === undefined) { MissingEvents = [...MissingEvents, el]; }
        });
        setevents(() => [...MissingEvents.reverse(), ...events]);
    }
    const actual = () => {
        setPressed(true);
        setEndRecients(() => getDate());
    }

    useEffect(() => {
        Events.refetch();
    }, []);

    useEffect(() => {

        const send = {
            id_service: (service) ? service.id_service : '',
            start: `${StartRecients?.date.date}T${StartRecients?.time.time}`,
            end: `${EndRecients?.date.date}T${EndRecients?.time.time}`
        }
        setdata(() => send);
    }, [EndRecients]);

    useEffect(() => {
        Events.refetch();
    }, [data]);


    useEffect(() => {
        if (expired !== undefined && auto) {
            const reconsulted = setInterval(() => actual(), 1000 * (60 * 5));
            // const reconsulted = setInterval(() => actual(), 1000 * (5));
            return () => clearInterval(reconsulted);
        }
    });

    const renderItem = (el: any) => {
        let Data: event;
        Data = el.item;
        return (
            <Pressable onPress={() => { }}>
                <PildorEvent ev={Data} />
            </Pressable>
        );
    }

    return (
        <SafeAreaView style={[screen.full]}>
            {isfocused && <ShowMessage show={(Events.isLoading || Events.isFetching || Pressed) ? true : false} loading />}
            {(isfocused && message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido')) &&
                <ShowMessage show message={{
                    title: 'ERROR',
                    icon: true,
                    type: message.type,
                    message: message.message,
                }} />}
            <View style={[{ flex: 9 }, {}]}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={actual}
                            tintColor="#F8852D"
                        />
                    }
                    data={events}
                    renderItem={renderItem}
                    keyExtractor={(item, idx) => `${item.FechaOriginal} ${item.Hora}-${idx}`}
                    onEndReachedThreshold={0}
                    onEndReached={({ distanceFromEnd }) => {
                    }}
                />
            </View>
            <View style={[style.buttonContainer]}>
                <Button
                    style={{ borderRadius: 15, borderWidth: 2, marginHorizontal: 5 }}
                    contentStyle={{ height: 50, }}
                    color={(auto) ? colors.auto : colors.background}
                    icon={(auto) ? 'stop' : 'play'}
                    mode='contained'
                    loading={(Events.isFetching || Events.isLoading) ? true : false}
                    onPress={() => setauto(!auto)}
                    disabled={((Events.isFetching || Events.isLoading || Pressed) ? true : false)}
                > {(auto) ? 'parar' : 'iniciar'} </Button>
                {
                    (!auto) &&
                    <Button
                        style={{ borderRadius: 15, borderWidth: 2 }}
                        contentStyle={{ height: 50, }}
                        color={colors.background}
                        icon={'database-refresh-outline'}
                        mode='contained'
                        loading={(Events.isFetching || Events.isLoading) ? true : false}
                        onPress={actual}
                        disabled={((Events.isFetching || Events.isLoading || Pressed) ? true : false)}
                    > actualizar </Button>
                }
            </View>
        </SafeAreaView >
    )
}


const style = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.Primary
    }
})