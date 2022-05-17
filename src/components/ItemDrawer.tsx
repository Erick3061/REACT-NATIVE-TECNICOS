import { DrawerContentComponentProps, DrawerItem } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react'
import { colors } from '../theme/colors';
import { Text } from 'react-native';
interface Props {
    icon_name: string;
    setActive: React.Dispatch<React.SetStateAction<string>>
    active: string;
    nameOpc: string;
    props: DrawerContentComponentProps;
    label: string;
    navigate: string;
}
export const ItemDrawer = ({ icon_name, setActive, active, nameOpc, props, label, navigate }: Props) => {
    return (
        <DrawerItem
            icon={({ size }) => (<Icon name={icon_name} color={(active === nameOpc) ? 'white' : colors.PrimaryDark} size={size} />)}
            label={({ color, focused }) => <Text style={{ marginLeft: -20, color: (focused) ? color : colors.PrimaryDark, fontSize: (focused) ? 17 : 16, fontWeight: (focused) ? 'bold' : '400' }} adjustsFontSizeToFit numberOfLines={2}>{label}</Text>}
            activeBackgroundColor={colors.Primary}
            activeTintColor={'white'}
            focused={(active === nameOpc) ? true : false}
            pressColor={colors.Primary}
            onPress={() => { setActive(nameOpc); props.navigation.navigate(navigate) }}
        />
    )
}
