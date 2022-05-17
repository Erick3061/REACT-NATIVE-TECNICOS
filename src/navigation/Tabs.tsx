import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ContactScreen } from '../screens/private/TabsScreens/ContactScreen';
import { colors } from '../theme/colors';
import { ZoneScreen } from '../screens/private/TabsScreens/ZoneScreen';
import { UserScreen } from '../screens/private/TabsScreens/UserScreen';

export type Root = {
    ZoneScreen: undefined;
    UserScreen: undefined;
    ContactScreen: undefined;
}

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTab = createMaterialTopTabNavigator<Root>();

export const AcountDataTopTabs = () => {
    return (
        <TopTab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'white',
                sceneAnimationEnabled: true,
                tabBarStyle: {
                    backgroundColor: colors.Primary,
                    elevation: 10,
                },
                tabBarIcon: ({ color, focused }) => {
                    let iconName: string = (route.name === 'UserScreen') ? (focused) ? 'people' : 'people-outline'
                        : (route.name === 'ZoneScreen') ? (focused) ? 'git-merge' : 'git-merge-outline'
                            : (route.name === 'ContactScreen') ? (focused) ? 'call' : 'call-outline'
                                : 'call';
                    return (<Icon name={iconName} size={25} color={color} />)
                },
                tabBarShowLabel: false,
                lazy: true,
                tabBarBounces: true,

            })}
        >
            <TopTab.Screen name="ZoneScreen" options={{ tabBarLabel: 'ZONAS' }} component={ZoneScreen} />
            <TopTab.Screen name="UserScreen" options={{ tabBarLabel: 'USUARIOS' }} component={UserScreen} />
            <TopTab.Screen name="ContactScreen" options={{ tabBarLabel: 'CONTACTOS' }} component={ContactScreen} />
        </TopTab.Navigator>
    );
}