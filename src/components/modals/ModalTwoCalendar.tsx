import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { modalMessage } from '../../theme/styles';
import { colors } from '../../theme/colors';
import { getDate, cretateFormatDate, modDate } from '../../functions/helpers';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { formatDate } from '../../interfaces/interfaces';
import { Button, Dialog, Portal } from 'react-native-paper';
import { MarkingProps } from '../../../node_modules/react-native-calendars/src/calendar/day/marking';
import { calendar } from '../../types/reducersTypes';

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    show: boolean;
    start: formatDate;
    end: formatDate;
    setselectStart: React.Dispatch<React.SetStateAction<formatDate>>;
    setselectEnd: React.Dispatch<React.SetStateAction<formatDate>>;
    setinterv: React.Dispatch<React.SetStateAction<boolean>>;
    setstart: React.Dispatch<React.SetStateAction<formatDate>>;
    setend: React.Dispatch<React.SetStateAction<formatDate>>;
}

declare type MarkedDatesType = {
    [key: string]: MarkingProps;
};
export const ModalTwoCalendar = ({ start, end, setOpen, show, setselectEnd, setselectStart, setinterv, setend, setstart }: Props) => {

    const closeModal = () => {
        setOpen(() => false);
    }

    const [interval, setinterval] = useState<MarkedDatesType>({});

    useEffect(() => {
        setinterval({});
        const difference = Math.abs(start.DATE.getTime() - end.DATE.getTime());
        const days = Math.round(difference / (1000 * 3600 * 24));
        let interval: MarkedDatesType = {};
        for (let i = 0; i <= days; i++) {
            const date = modDate({ dateI: start.DATE, days: i });
            if (i === 0) interval = { ...interval, [start.date.date]: { startingDay: true, color: colors.PrimaryLight, textColor: colors.background } }
            else interval = { ...interval, [date.date.date]: { color: colors.PrimaryLight, textColor: colors.background } }
            if (i === days) interval = { ...interval, [end.date.date]: { endingDay: true, color: colors.PrimaryLight, textColor: colors.background } }
        }
        setinterval(interval);
    }, [start, end]);

    return (
        <Portal>
            <Dialog
                style={[modalMessage.dialog, { shadowColor: colors.Primary, backgroundColor: 'white' }]}
                visible={show}
                onDismiss={() => closeModal()}
            >
                <Dialog.ScrollArea>
                    <ScrollView style={{ paddingVertical: 10 }}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>Seleccione el inicio de la consulta</Text>
                        <Calendar
                            style={styles.calendar}
                            theme={calendar.theme}
                            current={start.date.date}
                            maxDate={end.date.date}
                            markingType='period'
                            markedDates={{ ...interval }}
                            onDayPress={(props) => {
                                const selected = cretateFormatDate({ date: props.dateString });
                                setselectStart(selected);
                            }}
                        />
                        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>Seleccione el final de la consulta</Text>
                        <Calendar
                            theme={calendar.theme}
                            style={{
                                borderColor: colors.Primary,
                                borderWidth: 1,
                                borderRadius: 10,
                                width: '100%',
                                paddingVertical: 10,
                            }}
                            current={end.date.date}
                            minDate={start.date.date}
                            maxDate={getDate().date.date}
                            markingType='period'
                            markedDates={{ ...interval }}
                            onDayPress={(props) => {
                                const selected = cretateFormatDate({ date: props.dateString });
                                setselectEnd(selected);
                            }}
                        />
                        <View style={{ alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10, display: 'flex', flexDirection: 'row' }}>
                            <Button
                                contentStyle={{ height: 40 }}
                                mode='contained'
                                onPress={() => {
                                    setOpen(() => false);
                                    setinterv(true);
                                    setstart(start);
                                    setend(end);
                                }}
                                disabled={false}
                            > consultar </Button>
                            <Button
                                contentStyle={{ height: 40 }}
                                mode='contained'
                                onPress={() => {
                                    setOpen(() => false);
                                }}
                                disabled={false}
                            > cancelar </Button>
                        </View >
                    </ScrollView>
                </Dialog.ScrollArea>
            </Dialog>
        </Portal>
    )
}

export const styles = StyleSheet.create({
    calendar: {
        borderRadius: 8,
        borderColor: colors.Primary,
        borderWidth: 1,
        paddingBottom: 5
    },
    text: {
        paddingTop: 5,
        fontSize: 23,
        fontWeight: '500',
        color: colors.Primary,
        textAlign: 'justify'
    }
});