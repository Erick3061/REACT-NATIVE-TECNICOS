import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, datalogIn, event, LogInData, ResponseApi, responseLoadFile, ServiceDetails, Services } from '../interfaces/interfaces';

// export const baseUrl = 'https://pem-sa.ddns.me:3007/api';
// const baseUrl = 'http://127.0.0.1:3007/api';
export const baseUrl = 'http://192.168.1.65:3007/api';
export const Api = async (endpoint: string, data: object = {}, method: 'GET' | 'POST' = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;
    const token = await AsyncStorage.getItem('token');
    const headers: HeadersInit_ | undefined = {};
    (token) ? Object.assign(headers, { 'Content-type': 'application/json', 'x-token': token }) : Object.assign(headers, { 'Content-type': 'application/json', });
    return (method === 'GET') ? fetch(url, { method, headers }) : fetch(url, { method, headers, body: JSON.stringify(data) });
}

export const loadFile = async ({ file, id_service }: { file: FormData, id_service: string }) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${baseUrl}/files/loadFile/${id_service}`, {
            body: file,
            headers: (token) ? { 'Content-type': 'multipart/form-data', 'x-token': token } : { 'Content-Type': 'multipart/form-data' },
            method: 'PUT'
        })
        const { status, data, errors }: ResponseApi<responseLoadFile> = await response.json();
        if (status && data) return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const getImgs = async (id_service: string) => {
    try {
        const response = await Api(`files/getImgs/${id_service}`, {}, 'GET');
        const { status, data, errors }: ResponseApi<{ files: Array<string> }> = await response.json();
        if (status && data) return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
};

export const deleteImg = async (props: { id_service: string, file: string }) => {
    try {
        const response = await Api(`files/deleteFileToService`, props, 'POST');
        const { status, data, errors }: ResponseApi<{ isDeleted: boolean }> = await response.json();
        if (status && data) return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
};

export const logIn = async ({ acceso, password }: LogInData) => {
    try {
        const response = await Api('auth/logIn', { acceso, password }, 'POST');
        const { status, data, errors }: ResponseApi<datalogIn> = await response.json();
        if (status && data) return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
};

export const ChangePassword = async ({ password }: { password: string }) => {
    try {
        const response = await Api(`auth/changePassword`, { password }, 'POST');
        const { status, data, errors }: ResponseApi<{ changed: boolean }> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const ValidatePassword = async ({ password }: { password: string }) => {
    try {
        const response = await Api(`sys/validatePassword`, { password }, 'POST');
        const { status, data, errors }: ResponseApi<{ isValid: boolean }> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const validarJWT = async () => {
    try {
        const response = await Api('auth/validaJWT', {}, 'GET');
        const { status, data, errors }: ResponseApi<datalogIn> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
};

export const GetAccountMW = async (id_service: string) => {
    try {
        const response = await Api(`sys/getAccountsMW?id_service=${id_service}`, {}, 'GET');
        const { status, data, errors }: ResponseApi<{ account: Account }> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const GetEvents = async ({ end, id_service, start }: { id_service: string, start: string, end: string }) => {
    try {
        const response = await Api(`sys/getEvents/${id_service}/${start}/${end}`, {}, 'GET');
        const { status, data, errors }: ResponseApi<{ events: Array<event> }> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const GetVerification = async (id_service: string) => {
    try {
        const response = await Api(`sys/verifyEventsService/${id_service}`, {}, 'GET');
        const { status, data, errors }: ResponseApi<{ zones: Array<string>, users: Array<string> }> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const GetVersionApp = async () => {
    try {
        const response = await Api(`sys/getVersionApp`, {}, 'GET');
        const { status, data, errors }: ResponseApi<{ version: string, url: string }> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const getServiceWithDetails = async (id_service: string) => {
    try {
        const response = await Api(`sys/getServiceDetails/${id_service}`, {}, 'GET');
        const { status, data, errors }: ResponseApi<ServiceDetails> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

export const getServices = async ({ end, start, account, technical }: { start: string, end: string, technical?: string, account?: string }) => {
    try {
        let path: string = `sys/getServices/${start}/${end}`;
        let query: string = `${(technical) ? `?technical=${technical}` : (account) ? `?account=${account}` : ''}`;
        if (technical && account) throw new Error("Solo se debe enviar un parámetro");
        const response = await Api(`${path}${query}`, {}, 'GET');
        const { status, data, errors }: ResponseApi<{ services: Array<Services> }> = await response.json();
        if (status && data)
            return data;
        throw new Error(errors![0].msg);
    } catch (error) { throw new Error(`${error}`); }
}

