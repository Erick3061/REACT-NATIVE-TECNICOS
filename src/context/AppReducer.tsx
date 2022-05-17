import { AppState } from '../interfaces/interfaces';
import { AppAction } from '../types/reducersTypes';

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'logIn':
            return {
                ...state,
                status: 'loged',
                person: action.payload.person
            }
        case 'logOut':
            return {
                ...state,
                status: 'no-loged',
                person: undefined,
                service: undefined,
                account: undefined,
                expired: undefined,
            }
        case 'setService':
            return {
                ...state,
                service: action.payload.service
            }
        case 'setAccount':
            return {
                ...state,
                account: action.payload.account
            }
        case 'setExpired':
            return {
                ...state,
                expired: action.payload.expired
            }
        case 'setMessage':
            return {
                ...state,
                message: action.payload.message
            }
        default:
            return state;
    }
}