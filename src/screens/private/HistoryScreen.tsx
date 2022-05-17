import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Pressable, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { useQuery } from 'react-query';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { event, formatDate } from '../../interfaces/interfaces';
import { getDate, modDate, validateError } from '../../functions/helpers';
import { GetEvents } from '../../api/Api';
import { PildorEvent } from '../../components/PildorEvent';
import { screen } from '../../theme/styles';
import { colors } from '../../theme/colors';
import { ShowMessage } from '../../components/modals/ModalShowMessage';

export const HistoryScreen = () => {
    const isFocused = useIsFocused();
    const { service, setMessage, message } = useContext(AppContext);
    const [days, setdays] = useState<number>(1);
    const [events, setevents] = useState<Array<event>>([]);
    const [Pressed, setPressed] = useState<boolean>(false);
    const [EndAncients, setEndAncients] = useState<formatDate | undefined>(() => modDate({ dateI: new Date(service!.entryDate), days: -1 }));
    const [StartAncients, setStartAncients] = useState<formatDate | undefined>(() => modDate({ dateI: new Date(service!.entryDate) }));

    const [StartRecients, setStartRecients] = useState<formatDate | undefined>(() => modDate({ dateI: new Date(service!.entryDate) }));
    const [EndRecients, setEndRecients] = useState<formatDate | undefined>(() => modDate({ dateI: new Date(service!.entryDate) }));

    const [data, setdata] = useState<{ id_service: string; start: string; end: string; }>({
        id_service: (service) ? service.id_service : '',
        start: `${EndAncients?.date.date}T${EndAncients?.time.time}`,
        end: `${StartAncients?.date.date}T${StartAncients?.time.time}`
    });

    const [btn, setbtn] = useState<'ancients' | 'recients'>('ancients');

    const Events = useQuery(['History'], () => GetEvents(data), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: false,
        retry: 1,
        onSuccess: data => {
            setPressed(false);
            if (btn == 'ancients') {
                setStartAncients(() => EndAncients);
                filtro(data.events);
            } else {
                setStartRecients(() => EndRecients);
                filtro(data.events);
            }
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
        if (btn === 'ancients') {
            setevents(() => [...events, ...MissingEvents.reverse()]);
        } else {
            setevents(() => [...MissingEvents.reverse(), ...events]);
        }
    }
    const actual = () => {
        setPressed(true);
        setbtn('recients');
        setEndRecients(() => getDate());
    }
    const old = () => {
        setPressed(true);
        if (days >= 10) {
            setPressed(false);
            setMessage({ message: 'No puedes retroceder mas de 10 dias', type: 'error' })
        } else {
            setPressed(false)
            setbtn('ancients');
            setdays(() => days + 1);
            setEndAncients(() => modDate({ dateI: StartAncients?.DATE, days: -1 }));
        }
    }

    useEffect(() => {
        Events.refetch();
    }, [])

    useEffect(() => {
        const send = {
            id_service: (service) ? service.id_service : '',
            start: `${EndAncients?.date.date}T${EndAncients?.time.time}`,
            end: `${StartAncients?.date.date}T${StartAncients?.time.time}`
        }
        setdata(() => send);
    }, [EndAncients]);

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
            {isFocused && <ShowMessage show={(Events.isLoading || Events.isFetching || Pressed) ? true : false} loading />}
            {(isFocused && message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido')) &&
                <ShowMessage show message={{
                    title: 'ERROR',
                    icon: true,
                    type: message.type,
                    message: message.message
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
                    style={{ borderRadius: 15, borderWidth: 2, marginHorizontal: 5, }}
                    contentStyle={{ height: 50, }}
                    color={colors.background}
                    icon={'calendar-clock'}
                    mode='contained'
                    loading={(Events.isFetching || Events.isLoading) ? true : false}
                    onPress={old}
                    disabled={((Events.isFetching || Events.isLoading || Pressed) ? true : false)}
                > antiguos </Button>
                <Button
                    style={{ borderRadius: 15, borderWidth: 2 }}
                    contentStyle={{ height: 50, }}
                    color={colors.background}
                    icon={'calendar-clock'}
                    mode='contained'
                    loading={(Events.isFetching || Events.isLoading) ? true : false}
                    onPress={actual}
                    disabled={((Events.isFetching || Events.isLoading || Pressed) ? true : false)}
                > recientes </Button>
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