import React, { createContext, useReducer } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { appReducer } from './AppReducer';
import { Account, AppState as AppState, Person, Service, Message, Expired } from '../interfaces/interfaces';
import { AppContextProps as AppContextProps } from '../types/reducersTypes';

const initialState: AppState = {
    versionApp: '1.1.0',
    status: 'no-loged',
    person: undefined,
    service: undefined,
    account: undefined,
    message: undefined,
    expired: { hours: 99, minutes: 59, seconds: 59 }
}

export const AppContext = createContext({} as AppContextProps);

export const AppProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const setPerson = async (person: Person | undefined, token: string) => await AsyncStorage.setItem('token', token).then(() => dispatch({ type: 'logIn', payload: { person } }));

    const setService = async (service: Service | undefined) => dispatch({ type: 'setService', payload: { service } });

    const setAccount = async (account: Account | undefined) => dispatch({ type: 'setAccount', payload: { account } });

    const setExpired = async (expired: Expired | undefined) => dispatch({ type: 'setExpired', payload: { expired } });

    const setMessage = async (message: Message | undefined) => dispatch({ type: 'setMessage', payload: { message } });

    const logOut = async () => {
        await AsyncStorage.clear()
        dispatch({ type: 'logOut' });
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

            }}
        >
            {children}
        </AppContext.Provider>
    )
}