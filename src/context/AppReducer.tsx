import { AppState } from '../interfaces/interfaces';
import { AppAction } from '../types/Types';

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'logIn':
            return {
                ...state,
                status: 'loged',
                person: action.payload.person,
                file: action.payload.file
            }
        case 'logOut':
            return {
                ...state,
                status: 'no-loged',
                person: undefined,
                service: undefined,
                account: undefined,
                expired: undefined,
                file: undefined
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
        case 'setCameraPermission':
            return {
                ...state,
                cameraPermissionStatus: action.payload.cameraPermissionStatus
            }
        case 'updateApp':
            return {
                ...state,
                isUpdate: action.payload.isUpdate
            }
        default:
            return state;
    }
}