import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Menu } from '../navigation/Menu';
import { colors } from '../theme/colors';
import { ServiceDetails } from '../screens/private/ServiceDetails';
import { Services } from '../interfaces/interfaces';
export type RootStackParams = {
    Menu: undefined;
    ServiceDetails: { el: Services };
}
const RootStack = createStackNavigator<RootStackParams>();
export const ProtectedScreen = () => {

    const { expired, setExpired, service } = useContext(AppContext);

    const countDown = () => {
        if (expired?.hours === 0 && expired.minutes === 0 && expired.seconds === 0)
            setExpired(undefined);
        else if (expired?.minutes === 0 && expired.seconds === 0) {
            if (expired.hours - 1 < 0) setExpired(undefined);
            setExpired({ hours: expired!.hours - 1, minutes: 59, seconds: 59 });
        } else if (expired?.seconds === 0) {
            setExpired({ hours: expired!.hours, minutes: expired!.minutes - 1, seconds: 59 });
        } else {
            setExpired({ hours: expired!.hours, minutes: expired!.minutes, seconds: expired!.seconds - 1 });
        }
    };

    useEffect(() => {
        // setExpired(expired)
        // if (expired && service && service.withOutFolio && service.isTimeExpired) {
        // const interval = setInterval(() => countDown(), 900);
        // return () => clearInterval(interval);
        // } else {
        //     setExpired(undefined);
        // }
        if (expired !== undefined) {
            const interval = setInterval(() => countDown(), 900);
            return () => clearInterval(interval);
        }
    }, [expired]);

    return (
        <RootStack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: colors.Primary, elevation: 0, shadowColor: 'transparent', },
            }}
        >
            <RootStack.Screen name="Menu" component={Menu} />
            <RootStack.Screen name="ServiceDetails" component={ServiceDetails} />
        </RootStack.Navigator>
    )
}
