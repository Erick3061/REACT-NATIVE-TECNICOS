import React, { useContext, useState } from 'react'
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerHeaderProps, DrawerItem } from '@react-navigation/drawer'
import { HomeScreen } from '../screens/private/HomeScreen';
import { Title, Drawer, Avatar, IconButton, Appbar, List } from 'react-native-paper';
import { View, StatusBar, Text } from 'react-native';
import { AccountServiceTopTabs, AcountDataTopTabs } from './Tabs';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { ItemDrawer } from '../components/ItemDrawer';
import { ChangePasswordScreen } from '../screens/private/ChangePasswordScreen';
import { DrawerStyle } from '../theme/styles';
import { AccountGeneral } from '../screens/private/AccountGeneral';
import { EventsScreen } from '../screens/private/EventsScreen';
import { HistoryScreen } from '../screens/private/HistoryScreen';
import { ValidateServiceScreen } from '../screens/private/ValidateServiceScreen';
import { ServicesScreen } from '../screens/private/ServicesScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { LoadFiles } from '../screens/private/LoadFiles';
export type RootDrawerNAvigator = {
    HomeScreen: undefined;
    AccountGeneral: undefined;
    AccountServiceTopTabs: undefined;
    AcountDataTopTabs: undefined;
    ChangePasswordScreen: undefined;
    HistoryScreen: undefined;
    EventsScreen: undefined;
    ValidateServiceScreen: undefined;
    ServicesScreen: undefined;
    LoadFiles: undefined;
}

export const Menu = () => {
    const { service } = useContext(AppContext);
    const menuDrawer = createDrawerNavigator<RootDrawerNAvigator>();
    return (
        <menuDrawer.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.Primary },
                headerTintColor: colors.background,
                drawerType: 'front',
                drawerStatusBarAnimation: 'fade',
                drawerPosition: 'left',
                drawerActiveTintColor: 'pink',
                header: (props) => <MenuHeader {...props} />,
                drawerStyle: { width: '80%', backgroundColor: 'rgba(0,0,0,0.0)' }
            }}
            drawerContent={(props) => <MenuContent {...props} />}
            useLegacyImplementation
            detachInactiveScreens
        >
            {
                (service && !service.withOutFolio) ?
                    <>
                        <menuDrawer.Screen name="AccountGeneral" options={{ title: 'Datos Generales' }} component={AccountGeneral} />
                        <menuDrawer.Screen name="AcountDataTopTabs" options={{ title: 'Datos del sistema' }} component={AcountDataTopTabs} />
                        <menuDrawer.Screen name="HistoryScreen" options={{ title: 'Historial de Eventos' }} component={HistoryScreen} />
                        <menuDrawer.Screen name="EventsScreen" options={{ title: 'Eventos en tiempo real' }} component={EventsScreen} />
                        <menuDrawer.Screen name="AccountServiceTopTabs" options={{ title: 'Obtener folio' }} component={AccountServiceTopTabs} />
                        <menuDrawer.Screen name="ValidateServiceScreen" options={{ title: 'Obtener folio' }} component={ValidateServiceScreen} />
                        <menuDrawer.Screen name="ChangePasswordScreen" options={{ title: 'Cambiar contraseña' }} component={ChangePasswordScreen} />
                        <menuDrawer.Screen name="ServicesScreen" options={{ title: 'Mis servicios' }} component={ServicesScreen} />
                    </>
                    :
                    <>
                        <menuDrawer.Screen name='HomeScreen' options={{ title: 'Inicio' }} component={HomeScreen} />
                        <menuDrawer.Screen name="ChangePasswordScreen" options={{ title: 'Cambiar contraseña' }} component={ChangePasswordScreen} />
                        <menuDrawer.Screen name="ServicesScreen" options={{ title: 'Mis servicios' }} component={ServicesScreen} />
                    </>
            }
        </menuDrawer.Navigator>
    )

}

const MenuHeader = ({ layout, navigation, options, route }: DrawerHeaderProps) => {
    const { expired, service } = useContext(AppContext);
    return (
        <Appbar.Header>
            <Appbar.Content titleStyle={{ fontSize: 22 }} title={options.title} subtitle={(service !== undefined)
                ? (expired !== undefined && !service.isTimeExpired)
                    ? <Text style={{ left: 15, fontSize: 18, color: 'white', fontWeight: '400' }}>{`Tiempo restante: ${expired?.hours.toString().padStart(2, '0')} : ${expired?.minutes.toString().padStart(2, '0')} : ${expired?.seconds.toString().padStart(2, '0')}`}</Text>
                    : <Text style={{ left: 15, fontSize: 18, color: 'white', fontWeight: '400' }}>{`el tiempo expiró`}</Text>
                : <Text style={{ left: 15, fontSize: 18, color: 'white', fontWeight: '400' }} >--:--:--</Text>
            } />
            <Appbar.Action icon={'menu'} size={30} onPress={() => navigation.openDrawer()} />
        </Appbar.Header>
    )
}

const MenuContent = (props: DrawerContentComponentProps) => {
    const { logOut, person, service } = useContext(AppContext);
    const [active, setActive] = useState('HomeScreen');
    const close = async () => await logOut();

    return (
        <View style={[{ flex: 1, backgroundColor: colors.white, borderTopRightRadius: 15, borderBottomRightRadius: 15 }]}>
            <StatusBar backgroundColor={colors.Primary} barStyle="light-content" />
            <Drawer.Section style={{ ...DrawerStyle.userInfoSection }}>
                <List.Item
                    {...props}
                    style={{ backgroundColor: 'rgba(0,0,0,0)', marginLeft: -10 }}
                    titleStyle={{ fontSize: 20, color: colors.PrimaryDark, fontWeight: 'bold' }}
                    title={person?.enterpriceShortName}
                    right={() => <IconButton
                        style={{ position: 'absolute', right: 0, backgroundColor: colors.PrimaryDark }}
                        icon="close"
                        color={colors.background}
                        size={25}
                        onPress={() => props.navigation.closeDrawer()}
                    />}
                />
                <Avatar.Image size={100} source={{ uri: `https://pem-sa.ddns.me/assets/personal/${person?.personName} ${person?.lastname}.jpg` }} />
                <Title numberOfLines={1} adjustsFontSizeToFit style={DrawerStyle.title}>{person?.personName} {person?.lastname}</Title>
                <Title numberOfLines={1} adjustsFontSizeToFit style={{ ...DrawerStyle.title, marginTop: -10 }}>E-mail: {person?.email}</Title>
                <Title numberOfLines={1} adjustsFontSizeToFit style={{ ...DrawerStyle.title, marginTop: -10 }}>Usuario:{person?.nameUser}</Title>
            </Drawer.Section>
            <DrawerContentScrollView {...props}>
                {
                    (service && !service.withOutFolio) ?
                        <>
                            <ItemDrawer
                                active={active}
                                icon_name='home-outline'
                                nameOpc='HomeScreen'
                                props={props}
                                setActive={setActive}
                                label="Datos Generales"
                                navigate='AccountGeneral'
                            />
                            <ItemDrawer
                                active={active}
                                icon_name='business-outline'
                                nameOpc='AcountDataTopTabs'
                                props={props}
                                setActive={setActive}
                                label="Datos del sistema"
                                navigate='AcountDataTopTabs'
                                key='AcountDataTopTabs'
                            />
                            <ItemDrawer
                                active={active}
                                icon_name='time-outline'
                                nameOpc='HistoryScreen'
                                props={props}
                                setActive={setActive}
                                label="Historial de Eventos"
                                navigate='HistoryScreen'
                                key='HistoryScreen'
                            />
                            <ItemDrawer
                                active={active}
                                icon_name='list-circle-outline'
                                nameOpc='EventsScreen'
                                props={props}
                                setActive={setActive}
                                label="Eventos en tiempo real"
                                navigate='EventsScreen'
                                key='EventsScreen'
                            />
                        </>
                        :
                        <ItemDrawer
                            active={active}
                            icon_name='home-outline'
                            nameOpc='HomeScreen'
                            props={props}
                            setActive={setActive}
                            label="Inicio"
                            navigate='HomeScreen'
                            key='HomeScreen'
                        />
                }

                <ItemDrawer
                    active={active}
                    icon_name='lock-closed-outline'
                    nameOpc='ChangePasswordScreen'
                    props={props}
                    setActive={setActive}
                    label="Cambiar contraseña"
                    navigate='ChangePasswordScreen'
                />
                <ItemDrawer
                    active={active}
                    icon_name='albums-outline'
                    nameOpc='ServicesScreen'
                    props={props}
                    setActive={setActive}
                    label="Mis Servicios"
                    navigate='ServicesScreen'
                />
                {
                    (service && !service.withOutFolio) &&
                    <>
                        <ItemDrawer
                            active={active}
                            icon_name='business-outline'
                            nameOpc='AccountServiceTopTabs'
                            props={props}
                            setActive={setActive}
                            label="Obtener folio"
                            navigate='AccountServiceTopTabs'
                            key='AccountServiceTopTabs'
                        />
                        <ItemDrawer
                            active={active}
                            icon_name='push-outline'
                            nameOpc='ValidateServiceScreen'
                            props={props}
                            setActive={setActive}
                            label="Obtener folio"
                            navigate='ValidateServiceScreen'
                            key='ValidateServiceScreen'
                        />
                    </>
                }
            </DrawerContentScrollView>
            <Drawer.Section style={{ borderBottomRightRadius: 25, borderTopWidth: 1, borderTopColor: colors.missing }}>
                <View style={{ flexDirection: 'row' }} >
                    <DrawerItem
                        style={{ flex: 5 }}
                        icon={({ size }) => (<Icon name="log-out-outline" color={colors.PrimaryDark} size={size} />)}
                        label={({ color, focused }) => <Text style={{ marginLeft: -20, color: (focused) ? color : colors.PrimaryDark, fontSize: 15, fontWeight: (focused) ? 'bold' : '400' }} adjustsFontSizeToFit numberOfLines={1}>Cerrar Sesión</Text>}
                        labelStyle={{ color: colors.PrimaryDark, fontSize: 16 }}
                        onPress={close}
                    />
                </View>
            </Drawer.Section >
        </View >
    )
}
