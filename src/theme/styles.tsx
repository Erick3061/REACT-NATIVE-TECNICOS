import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const screen = StyleSheet.create({
    full: {
        flex: 1,
        backgroundColor: colors.background,
    },
    borde: {
        borderColor: 'red',
        borderWidth: 2
    }
});

export const textStyle = StyleSheet.create({
    title: {
        color: colors.background,
        fontSize: 22,
        alignSelf: 'flex-start',
        fontWeight: '600'
    },
    terminos: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 18,
        fontWeight: '500'
    },
    version: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
})

export const buttonStyle = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
    },

    button_borde: {
        width: '90%',
        height: 50,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        backgroundColor: 'white',
        borderColor: colors.Primary,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button2: {
        width: '98%',
        height: '98%',
        borderWidth: 2,
        backgroundColor: colors.Primary,
        borderColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: colors.Primary,
        fontWeight: '500',
    }
})

export const modalMessage = StyleSheet.create({
    dialog: {
        backgroundColor: colors.background,
        borderRadius: 15,
        shadowColor: colors.send,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.PrimaryDark
    },
    content: {
        height: 280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentOneCalendar: {
        height: 330
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        height: 50
    },
    icon: {
        color: colors.Primary,
        fontSize: 90
    },
    button: {
        elevation: 2,
        height: 40
    },
    buttonClose: {
        backgroundColor: colors.Primary
    },





    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    modalView: {
        width: 340,
        height: 330,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.Primary,
        padding: 10
    },

    textButton: {
        color: colors.background,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: 10
    },
    title: {
        fontSize: 25,
        color: colors.Primary,
        fontWeight: 'bold'
    },
    text: {
        marginBottom: 15,
        textAlign: 'justify',
        fontSize: 18,
        color: colors.Primary
    },
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

})

export const DrawerStyle = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: 'white'
    },
    userInfoSection: {
        width: '100%',
        paddingHorizontal: 5,
    },
    title: {
        color: colors.PrimaryDark,
        fontSize: 15,
        fontWeight: 'bold',
    }
});

export const generales = StyleSheet.create({
    contenedor_chico: {
        flex: 5,
        flexDirection: 'column',
        paddingHorizontal: 8,
    },
    contenedor_grande: {
        paddingHorizontal: 8,
    },
    titulo1: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    titulo2: {
        color: colors.Primary,
        fontSize: 18,
        fontWeight: 'bold'

    },
    contenedor_carta: {
        backgroundColor: 'white',
        width: '100%',
        alignItems: 'center',
        marginVertical: 5,
        borderWidth: 3,
        borderColor: colors.Primary,
        borderRadius: 10,
        padding: 5,
        shadowColor: colors.PrimaryDark,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    }
});

export const lista_Info = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: colors.Primary,
        borderWidth: 3,
        padding: 20,
        marginVertical: 5,
        marginHorizontal: 15,
    },
    subtitle_in_title: {
        color: colors.PrimaryDark,
        fontWeight: 'bold',
    },
    title: {
        color: colors.Primary,
        fontWeight: '500',
        fontSize: 16
    },
});

export const gFolio = StyleSheet.create({
    container: {
        marginVertical: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    },
    cuadros: {
        width: 75,
        height: 75,
        marginHorizontal: 4,
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: colors.Primary,
    },
    texto: {
        width: '100%',
        fontWeight: '600',
        fontSize: 20,
        textAlign: 'center',
        color: colors.background
    }
});