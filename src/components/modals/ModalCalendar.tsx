import React from 'react';
import { modalMessage } from '../../theme/styles';
import { colors } from '../../theme/colors';
import { getDate } from '../../functions/helpers';
import { Calendar } from 'react-native-calendars';
import { formatDate } from '../../interfaces/interfaces';
import { Dialog, Portal, Text } from 'react-native-paper';
import { calendar } from '../../types/reducersTypes';

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    show: boolean;
    current: formatDate;
    forDay: (format: string) => void;
}

export const ModalCalendar = ({ show, setOpen, current, forDay }: Props) => {
    const closeMessage = () => {
        setOpen(() => false);
    }

    return (
        <Portal>
            <Dialog
                style={[modalMessage.dialog, { shadowColor: colors.Primary, backgroundColor: 'white' }]}
                visible={show}
                onDismiss={() => closeMessage()}
            >
                <Dialog.Title style={{ textAlign: 'center' }}><Text style={{ fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }}>Seleccione un día</Text></Dialog.Title>
                <Dialog.Content>
                    <Calendar
                        style={{ borderRadius: 10, borderColor: colors.PrimaryDark, borderWidth: 1, padding: 5 }}
                        theme={{
                            ...calendar.theme,
                            textSectionTitleColor: colors.Secondary,
                            monthTextColor: colors.PrimaryLight,
                            textMonthFontSize: 20,
                            textDayHeaderFontSize: 15,
                            textDayStyle: {
                                color: colors.PrimaryLight,
                                fontSize: 17,
                            },
                            arrowColor: colors.PrimaryLight,
                            contentStyle: {
                            },
                        }}
                        current={current.date.date}
                        maxDate={getDate().date.date}
                        enableSwipeMonths
                        markedDates={{
                            [current.date.date]: {
                                selected: true,
                                disableTouchEvent: true,
                                selectedColor: colors.Primary,
                                selectedTextColor: colors.background
                            }
                        }}
                        onDayPress={(props) => {
                            setOpen(false);
                            forDay(props.dateString)
                        }}
                    />
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}