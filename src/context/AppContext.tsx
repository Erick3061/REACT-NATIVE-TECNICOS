import React, { createContext, useEffect, useReducer } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { appReducer } from './AppReducer';
import { Account, AppState, Person, Service, Message, Expired } from '../interfaces/interfaces';
import { AppContextProps as AppContextProps } from '../types/reducersTypes';
import { check, PERMISSIONS, request, openSettings, PermissionStatus } from 'react-native-permissions';
import { AppState as AplicationStatus, Platform } from 'react-native';
import { useQuery } from 'react-query';
import { validarJWT } from '../api/Api';
import { getExpired, validateError } from '../functions/helpers';
const initialState: AppState = {
    versionApp: '1.1.0',
    status: 'no-loged',
    person: undefined,
    service: undefined,
    account: undefined,
    message: undefined,
    expired: { hours: 99, minutes: 59, seconds: 59 },
    cameraPermissionStatus: 'unavailable'
}

export const AppContext = createContext({} as AppContextProps);

export const AppProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const JWT = useQuery(["JWT"], () => validarJWT(),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            enabled: true,
            refetchInterval: false,
            retry: 1,
            onSuccess: async ({ Person, token, Service, AccountMW }) => {
                if (Person.id_role !== 1) {
                    await AsyncStorage.clear();
                    setMessage(validateError('No tienes acceso a este sistema'));
                } else {
                    await setPerson(Person, token);
                    await setService(Service);
                    if (Service) {
                        const expired = getExpired(new Date(Service.exitDate));
                        setExpired(expired);
                    } else {
                        setExpired(undefined);
                    }
                    if (AccountMW) {
                        setAccount(AccountMW);
                    }
                }
            },
            onError: async error => {
                if (state.message === undefined) {
                    await AsyncStorage.clear();
                    logOut();
                    setMessage(validateError(`${error}`))
                }
            }
        }
    );

    const validarToken = async () => {
        console.log(state);
        const token = await AsyncStorage.getItem('token');
        if (token !== null) {
            JWT.refetch();
        }
    }

    useEffect(() => {
        validarToken();
        AplicationStatus.addEventListener('change', state => {
            if (state !== 'active') return;
            checkCameraPermission();
        });
    }, []);

    const setPerson = async (person: Person | undefined, token: string) => await AsyncStorage.setItem('token', token).then(() => dispatch({ type: 'logIn', payload: { person } }));

    const setService = async (service: Service | undefined) => dispatch({ type: 'setService', payload: { service } });

    const setAccount = async (account: Account | undefined) => dispatch({ type: 'setAccount', payload: { account } });

    const setExpired = async (expired: Expired | undefined) => dispatch({ type: 'setExpired', payload: { expired } });

    const setMessage = async (message: Message | undefined) => dispatch({ type: 'setMessage', payload: { message } });

    const logOut = async () => {
        await AsyncStorage.clear()
        dispatch({ type: 'logOut' });
    }

    const askCameraPermission = async () => {
        let permissionStatus: PermissionStatus;
        if (Platform.OS === 'ios') permissionStatus = await request(PERMISSIONS.IOS.CAMERA);
        else permissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
        if (permissionStatus === 'blocked') openSettings();
        dispatch({ type: 'setCameraPermission', payload: { cameraPermissionStatus: permissionStatus } })
    }

    const checkCameraPermission = async () => {
        let permissionStatus: PermissionStatus;
        if (Platform.OS === 'ios') permissionStatus = await check(PERMISSIONS.IOS.CAMERA);
        else permissionStatus = await check(PERMISSIONS.ANDROID.CAMERA);
        dispatch({ type: 'setCameraPermission', payload: { cameraPermissionStatus: permissionStatus } })
    }

    return (
        <AppContext.Provider
            value={{
                ...state,
                setPerson,
                setService,
                setAccount,
                setMessage,
                setExpired,
                logOut,
                askCameraPermission,
                checkCameraPermission,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}