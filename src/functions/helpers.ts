import { formatDate, Message, user, zone } from '../interfaces/interfaces';
export const validateError = (error: string) => {
    const result = (!error.includes('No hay token en la petición'))
        ? (`${error}`.includes('JsonWebTokenError') || `${error}`.includes('TokenExpiredError'))
            ? (error.includes('TokenExpiredError')) ? 'La sesión expiró' : 'Token invalido' : error
        : undefined;
    if (result !== undefined) {
        const resp: Message = { message: result, type: 'error' };
        return resp;
    } else {
        return undefined;
    }
}

const esLetra = (caracter: string) => {
    let ascii = caracter.toUpperCase().charCodeAt(0);
    return ascii > 64 && ascii < 91;
};

const esNumero = (caracter: string) => {
    let ascii = caracter.toUpperCase().charCodeAt(0);
    return ascii > 47 && ascii < 58;
};

//SOLO FUNCIONA CON MAYUSCULAS Y NUMEROS
export const DecriptRot39 = (text: string) => {
    const Code = [...text].map((el) => (esLetra(String.fromCharCode(el.charCodeAt(0) - 39)) || esNumero(String.fromCharCode(el.charCodeAt(0) - 39))) ? String.fromCharCode(el.charCodeAt(0) - 39) : String.fromCharCode(el.charCodeAt(0)));
    return Code.join('');
}

export const getExpired = (date: Date) => {
    const Fecha = new Date(date);
    const Final = new Date(Fecha.getTime() + Fecha.getTimezoneOffset() * 60000);
    const actual = new Date();
    const time = (Final.getTime() - actual.getTime());

    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return { hours: hours + (days * 24), minutes, seconds }
}

export const FormatoFechaPlusMinus = (seconds: number, minutes: number, hours: number): string => {
    const fecha = new Date();
    fecha.setHours(fecha.getHours() + hours);
    fecha.setMinutes(fecha.getMinutes() + minutes);
    fecha.setSeconds(fecha.getSeconds() + seconds);
    const a: number = fecha.getFullYear();
    const m: number = fecha.getMonth();
    const d: number = fecha.getDate();
    const h: number = fecha.getHours();
    const min: number = fecha.getMinutes();
    const seg: number = fecha.getSeconds();
    return `${a}-${m + 1}-${d} ${h}:${min}:${seg}`;
}

export const validateZones = (z: Array<zone>, ze: Array<string>) => {
    const missingZone = z.filter(f => `${f.codigo}` !== ze.find(fi => fi === `${f.codigo}`)).map(z => `${z.codigo}`);
    const indefiniteZone = ze.filter(f => z.find(fi => `${fi.codigo}` === f) === undefined);
    return { missingZone, indefiniteZone }
}

export const validateUsers = (u: Array<user>, ue: Array<string>) => {
    const missingUser = u.filter(f => `${f.codigo}` !== ue.find(fi => fi === f.codigo)).map(z => `${z.codigo}`);
    const indefiniteUser = ue.filter(f => u.find(fi => `${fi.codigo}` === f) === undefined);
    return { missingUser, indefiniteUser }
}

export const getDate = (): formatDate => {
    const newDate: Date = new Date();
    const [day, month, year]: Array<string> = newDate.toLocaleDateString("es-MX", {
        year: 'numeric', month: 'numeric', day: 'numeric'
    }).split('/');
    const date: string = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const time: string = `${newDate.toTimeString().slice(0, 8)}`;
    const [hour, minute, second]: Array<number> = time.split(':').map(m => parseInt(m));
    const json: string = `${date}T${time}.000Z`;
    const dateGenerated: Date = new Date(json);
    const weekday = dateGenerated.getDay();
    return {
        DATE: dateGenerated,
        date: { date, day: parseInt(day), month: parseInt(month), year: parseInt(year) },
        time: { time, hour, minute, second },
        weekday
    };
}
export const modDate = ({ hours, minutes, seconds, dateI, days, months }: { dateI?: Date, seconds?: number, minutes?: number, hours?: number, days?: number, months?: number }): formatDate => {
    const newDate = (dateI) ? new Date(dateI.toJSON()) : getDate().DATE;
    (hours) && newDate.setHours(newDate.getHours() + hours);
    (minutes) && newDate.setMinutes(newDate.getMinutes() + minutes);
    (seconds) && newDate.setSeconds(newDate.getSeconds() + seconds);
    (days) && newDate.setDate(newDate.getDate() + days);
    (months) && newDate.setMonth(newDate.getMonth() + months);
    const [date, time] = newDate.toJSON().split('.')[0].split('T');
    const [year, month, day]: Array<number> = date.split('-').map(m => parseInt(m));
    const [hour, minute, second]: Array<number> = time.split(':').map(m => parseInt(m));
    const weekday = newDate.getDay();
    return {
        DATE: newDate,
        date: { date, day, month, year },
        time: { time, hour, minute, second },
        weekday
    };
}

export const cretateFormatDate = ({ date, dateObjet }: { date: string, dateObjet?: { year: string, month: string, day: string } }): formatDate => {
    const mod: string = getDate().DATE.toJSON();
    const newDate: formatDate = (dateObjet)
        ? modDate({ dateI: new Date(`${dateObjet.year}-${dateObjet.month}-${dateObjet.day}${mod.slice(10, mod.length)}`) })
        : modDate({ dateI: new Date(`${date}${mod.slice(10, mod.length)}`) });
    return newDate;
}

export const LeapYear = (year: number): boolean => ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? true : false;