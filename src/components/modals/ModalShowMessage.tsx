import React, { useState } from 'react'
import { modalMessage } from '../../theme/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ActivityIndicator, Button, Dialog, IconButton, Portal, Text } from 'react-native-paper';
import { Linking } from 'react-native';

interface PropsMessage {
    show: boolean;
    loading?: boolean;
    message?: {
        icon?: boolean;
        title?: string;
        type: 'error' | 'message' | 'warning';
        message: string;
    };
    update?: string;
}

export const ShowMessage = ({ loading, message, show, update }: PropsMessage) => {
    const [close, setclose] = useState<boolean>(show);
    const { setMessage, message: MESSAGE } = useContext(AppContext);
    const closeMessage = () => {
        setMessage(undefined);
        setclose(() => false);
    }
    return (
        <Portal>
            <Dialog
                style={[modalMessage.dialog, { shadowColor: (loading) ? colors.Primary : (message?.type === 'error') ? colors.Secondary : (message?.type === 'warning') ? colors.warning : colors.Primary }]}
                visible={show}
                onDismiss={() => loading ? {} : closeMessage()}
                dismissable={loading && show ? false : true}
            >
                {
                    message &&
                    <>
                        <Dialog.Content style={modalMessage.content}>
                            {
                                (message.icon) &&
                                <Icon
                                    style={{ ...modalMessage.icon, color: (message?.type === 'error') ? colors.Secondary : (message?.type === 'warning') ? colors.warning : colors.send }}
                                    name={
                                        (message.type === 'error')
                                            ? 'close-circle-outline'
                                            : (message.type === 'message')
                                                ? 'checkmark-circle-outline'
                                                : (message.type === 'warning')
                                                    ? 'warning-outline' : 'logo-android'
                                    }
                                    size={30}
                                />
                            }
                            {(message.title) && <Text style={modalMessage.header}>{message.title}</Text>}
                            <Text style={modalMessage.text}>{message.message}</Text>
                        </Dialog.Content>
                        <Dialog.Actions style={modalMessage.footer}>
                            <Button
                                dark
                                mode='contained'
                                contentStyle={{ height: 40, backgroundColor: colors.PrimaryDark }}
                                labelStyle={{ fontWeight: 'bold', fontSize: 15 }}
                                onPress={closeMessage}
                            >CERRAR</Button>
                        </Dialog.Actions>
                    </>
                }
                {
                    loading &&
                    <>
                        <Dialog.Content style={[modalMessage.content]}>
                            <ActivityIndicator
                                animating
                                size="large"
                                color={colors.Primary}
                            />
                            <Text style={modalMessage.title}>Cargando...</Text>
                        </Dialog.Content>
                        <Dialog.Actions style={modalMessage.footer}>
                        </Dialog.Actions>
                    </>
                }
                {
                    update &&
                    <>
                        <Dialog.Title style={[modalMessage.title, { textAlign: 'center' }]}>Actualización disponible</Dialog.Title>
                        <Dialog.Content style={[modalMessage.content, { alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                            <Text style={[modalMessage.text, { textAlign: 'center' }]}>Para iniciar sersión debes actualizar</Text>
                            <IconButton
                                style={{ backgroundColor: colors.Primary, alignSelf: 'center' }}
                                icon={'cellphone-arrow-down'}
                                color={colors.background}
                                size={100}
                                onPress={() => {
                                    Linking.openURL(update)
                                }}
                            />
                            <Text style={[modalMessage.text, { textAlign: 'center' }]}>Presiona el botón para descargar la nueva actualización</Text>
                        </Dialog.Content>
                    </>
                }
            </Dialog>
        </Portal >
    )
}