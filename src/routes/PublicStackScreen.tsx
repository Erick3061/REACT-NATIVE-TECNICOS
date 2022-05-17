import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ForgetPasswordScreen } from '../screens/public/ForgetPasswordScreen';
import { LogInScreen } from '../screens/public/LogInScreen';
export type RootStackParams = {
    LogInScreen: undefined;
    ForgetPasswordScreen: undefined;
}
const RootStack = createStackNavigator<RootStackParams>();
export const PublicStackScreen = () => {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="LogInScreen" component={LogInScreen} />
            <RootStack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
        </RootStack.Navigator>
    )
}
