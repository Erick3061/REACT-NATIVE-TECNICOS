import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appReducer } from './AppReducer';
import { Account, AppState, Person, Service, Message, Expired } from '../interfaces/interfaces';
import { AppContextProps as AppContextProps } from '../types/Types';
import { check, PERMISSIONS, request, openSettings, PermissionStatus } from 'react-native-permissions';
import { AppState as AplicationStatus, Platform } from 'react-native';
import { useQuery } from 'react-query';
import { validarJWT } from '../api/Api';
import VersionNumber from 'react-native-version-number';
import { getExpired, validateError } from '../functions/helpers';
import { useVersionApp } from '../hooks/versionApp';
const initialState: AppState = {
    versionApp: '1.1.0',
    status: 'no-loged',
    person: undefined,
    service: undefined,
    account: undefined,
    message: undefined,
    expired: { hours: 99, minutes: 59, seconds: 59 },
    cameraPermissionStatus: 'unavailable',
    file: undefined,
    isUpdate: false,
}

export const AppContext = createContext({} as AppContextProps);

export const AppProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const versionApp = useVersionApp();
    useQuery(["JWT"], () => validarJWT(),
        {
            retry: 0,
            onSuccess: async ({ Person, token, Service, AccountMW, directory }) => {
                await versionApp.refetch()
                    .then(async data => {
                        if (data.isError) {
                            const meessage = validateError(`${data.error}`);
                            if (meessage) setMessage({ message: meessage.message, type: 'error' });
                        }
                        if (data.isSuccess) {
                            if (VersionNumber.appVersion === data.data.version) {
                                if (Person.id_role !== 1) {
                                    await AsyncStorage.clear();
                                    setMessage(validateError('No tienes acceso a este sistema'));
                                } else {
                                    await setPerson(Person, token, (directory) ? directory[0] : undefined);
                                    await setService(Service);
                                    if (Service) {
                                        const expired = getExpired(new Date(Service.exitDate));
                                        setExpired(expired);
                                    } else setExpired(undefined);
                                    if (AccountMW) setAccount(AccountMW);
                                }
                            } else setUpdate(true);
                        }
                    }).catch(err => setMessage(validateError(`${err}`)))
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

    useEffect(() => {
        AplicationStatus.addEventListener('change', state => {
            if (state !== 'active') return;
            checkCameraPermission();
        });
    }, []);

    const setPerson = async (person: Person | undefined, token: string, directory: string | undefined) => await AsyncStorage.setItem('token', token).then(() => dispatch({ type: 'logIn', payload: { person, file: directory } }));

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
    const setUpdate = async (isUpdate: boolean) => {
        dispatch({ type: 'updateApp', payload: { isUpdate } });
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
                setUpdate
            }}
        >
            {children}
        </AppContext.Provider>
    )
}