import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { ProtectedScreen } from './PrivatedStackScreen';
import { PublicStackScreen } from './PublicStackScreen';
export const RootStackScreen = () => {
    const { status } = useContext(AppContext);
    return ((status === 'no-loged') ? <PublicStackScreen /> : <ProtectedScreen />)
}
