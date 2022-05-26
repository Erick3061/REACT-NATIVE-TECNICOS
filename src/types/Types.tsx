import { CalendarProps, LocaleConfig } from 'react-native-calendars';
import { Person, Service, Account, Message, Expired } from '../interfaces/interfaces';
import { colors } from '../theme/colors';
import { PermissionStatus } from 'react-native-permissions';
LocaleConfig.locales[''] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
};

export type InputsLogIn = {
    acceso: string,
    password: string,
};

export type InputsChangePassword = {
    password: string;
    newPassword: string;
    confirmPassword: string;
};

export type InputsForgetPassword = {
    name: string;
    lastName: string;
    access: string;
    employeeNumber: string;
};

export type status = 'loged' | 'no-loged';

export type AppAction =
    | { type: 'logIn', payload: { person: Person | undefined } }
    | { type: 'logOut' }
    | { type: 'setService', payload: { service: Service | undefined } }
    | { type: 'setMessage', payload: { message: Message | undefined } }
    | { type: 'setExpired', payload: { expired: Expired | undefined } }
    | { type: 'setAccount', payload: { account: Account | undefined } }
    | { type: 'setCameraPermission', payload: { cameraPermissionStatus: PermissionStatus } };

export type AppContextProps = {
    status: status;
    person: Person | undefined;
    service: Service | undefined;
    account: Account | undefined;
    message: Message | undefined;
    expired: Expired | undefined;
    cameraPermissionStatus: PermissionStatus;
    setPerson: (person: Person | undefined, token: string) => Promise<void>;
    setService: (service: Service | undefined) => Promise<void>;
    setAccount: (account: Account | undefined) => Promise<void>;
    setExpired: (account: Expired | undefined) => Promise<void>;
    setMessage: (message: Message | undefined) => Promise<void>
    logOut: () => Promise<void>;
    askCameraPermission: () => void;
    checkCameraPermission: () => void;
}

export const calendar: CalendarProps = {
    theme: {
        todayTextColor: colors.SecondaryDark,
        calendarBackground: undefined,
        textSectionTitleColor: colors.PrimaryDark,
        dayTextColor: colors.Primary,
        selectedDayTextColor: colors.background,
        monthTextColor: colors.Primary,
        arrowColor: colors.Primary,
        textDisabledColor: colors.missing,
        textDayFontFamily: 'monospace',
        textMonthFontFamily: 'monospace',
        textDayHeaderFontFamily: 'monospace',
        textDayFontWeight: '100',
        textMonthFontWeight: '100',
        textDayHeaderFontWeight: '100',
        textDayFontSize: 15,
        textMonthFontSize: 20,
        textDayHeaderFontSize: 16,
        todayButtonFontFamily: 'monospace',
        todayButtonFontWeight: 'bold',
        todayButtonFontSize: 16,
        arrowStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 20,
            width: 20,
            backgroundColor: colors.background
        },
        todayBackgroundColor: colors.background,
        arrowHeight: 40,
        arrowWidth: 40,
        weekVerticalMargin: 1,
        'stylesheet.calendar.header': {
            week: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: colors.background
            }
        }
    }
}