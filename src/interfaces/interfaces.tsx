import { status } from "../types/Types";
import { PermissionStatus } from 'react-native-permissions';
import { ImagePickerResponse } from 'react-native-image-picker';
export interface Message {
    message: string;
    type: 'error' | 'message' | 'warning';
}
export interface Expired {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface AppState {
    versionApp: string;
    status: status;
    message: Message | undefined;
    person: Person | undefined;
    service: Service | undefined;
    account: Account | undefined;
    expired: Expired | undefined;
    cameraPermissionStatus: PermissionStatus;
    file: string | undefined;
    isUpdate: boolean;
}

export interface Account {
    CodigoCte: string;
    CodigoAbonado: string;
    Nombre: string;
    Direccion: string;
    partitions: Array<partition>;
    zones: Array<zone>;
    users: Array<user>;
    contacts: Array<contact>;
    panel: panel;
}

export interface partition {
    codigo: number | null;
    descripcion: string | null;
}
export interface zone {
    codigo: number | null;
    descripcion: string | null;
}
export interface user {
    codigo: string | null;
    nombre: string | null;
    clave: string | null;
    descripcion: string | null;
}
export interface contact {
    codigo: number | null;
    telefono: string | null;
    contacto: string | null;
    descripcion: string | null;
}
export interface panel {
    nombre: string | null;
    ubicacion: string | null;
    descripcion: string | null;
    UbicacionCliente: string | null;
    MunicipioCliente: string | null;
    EstadoCliente: string | null;
}

export interface Person {
    id_person: string;
    id_enterprice: number;
    id_role: number;
    enterpriceShortName: string;
    personName: string;
    lastname: string;
    email: string | null;
    password: string;
    phoneNumber: string | null;
    employeeNumber: string;
    status: string;
    nameUser: string | null;
    withOutFolio?: boolean | null;
}

export interface Service {
    id_service: string;
    grantedEntry: string;
    grantedExit: string | null;
    firstVerification: string | null;
    secondVerification: string | null;
    id_type: number;
    folio: string;
    entryDate: Date;
    exitDate: Date;
    accountMW: string;
    isDelivered: boolean;
    isKeyCode: boolean;
    isOpCi: boolean;
    isTimeExpired: boolean;
    isActive: boolean;
    withOutFolio: boolean;
    filesCron: string | null;
}


export interface LogInData {
    acceso: string;
    password: string;
}

export interface ResetPasswordProps {
    access: string;
    name: string;
    lastName: string;
    employeeNumber: string;
}


export interface Errors {
    msg: string;
    param: string;
    value: string;
    location: string;
}

export interface ResponseApi<T> {
    status: boolean;
    data?: T;
    errors?: Array<Errors>
}


export interface datalogIn {
    Person: Person;
    token: string;
    Service?: Service;
    AccountMW?: Account;
    directory?: Array<string>;
}

export interface responseLoadFile {
    isInserted: boolean;
    nameFile: string;
    directoryFile: string;
    fullDirectory: string;
}

export interface event {
    FechaOriginal: string;
    FechaFormat: string;
    Dia: string;
    Hora: string;
    CodigoEvento: string;
    CodigoAlarma: string;
    DescripcionAlarm: string;
    CodigoZona: string;
    DescripcionZona: string;
    CodigoUsuario: string;
    NombreUsuario: string;
    DescripcionEvent: string;
    Particion: number;
    ClaveMonitorista: string;
    NomCalifEvento: string;
    FechaPrimeraToma: string;
    HoraPrimeraToma: string;
    FechaFinalizo: string;
    HoraFinalizo: string;
}

export interface date {
    date: string;
    day: number;
    month: number;
    year: number;
};

export interface time {
    time: string;
    hour: number;
    minute: number;
    second: number;
};
export interface formatDate {
    DATE: Date;
    date: date;
    time: time;
    weekday: number;
}

export interface Comment {
    id_service: string;
    person: string;
    comment: string;
}

export interface Binnacle {
    id_service: string;
    zones: string;
    missingZones: string;
    zonesUndefined: string;
    users: string;
    missingUsers: string;
    usersUndefined: string;
    link: string;
    technicals: string;
}

export interface ServiceDetails {
    service: Service;
    comments: Array<Comment>;
    binnacle: Array<Binnacle>;
}

export interface Services {
    id_service: string;
    accountMW: string;
    isTimeExpired?: boolean;
    isDelivered?: boolean;
    isActive?: boolean;
    entryDate: Date;
    exitDate: Date;
    folio: string;
    digital: string | null;
    nameAccount: string | null;
}

export interface technical {
    employeeNumber: string;
    enterpriceShortName: string;
    fullName: string;
    id_enterprice: number;
    nameUser: string;
    phoneNumber: string;
    withOutFolio: string;
}