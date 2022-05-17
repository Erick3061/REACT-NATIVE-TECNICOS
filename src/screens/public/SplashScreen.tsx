import React from 'react';
import { View, StyleSheet, StatusBar, Image } from 'react-native';
import { colors } from '../../theme/colors';


export const SplashScreen = () => {
    // const { checaToken } = useContext(AuthContext);

    // const start = async () => {
    //     const token = await AsyncStorage.getItem('token');
    //     (!token) ? navigation.replace('InicioSesionScreen') : checaToken();
    // }
    // useEffect(() => {
    //     setTimeout(() => {W
    //         start();
    //     }, 2000, this);
    // }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.missing} barStyle="dark-content" />
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.missing
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    logo: {
        width: '70%',
        height: '15%',
        justifyContent: 'center'
    },
});

