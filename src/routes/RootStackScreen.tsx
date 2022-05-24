import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import { ProtectedScreen } from './PrivatedStackScreen';
import { PublicStackScreen } from './PublicStackScreen';
export const RootStackScreen = () => {
    const { status, askCameraPermission } = useContext(AppContext);
    useEffect(() => {
        askCameraPermission()
    }, []);
    return ((status === 'no-loged') ? <PublicStackScreen /> : <ProtectedScreen />)
}
