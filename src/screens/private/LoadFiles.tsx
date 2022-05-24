import React, { useContext, useState } from 'react';
import { FAB, Portal, Provider, Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { useMutation } from 'react-query';
import { loadFile } from '../../api/Api';

export const LoadFiles = () => {
    const isFocused = useIsFocused();
    const [isLoading, setisLoading] = useState<boolean>(false);
    const { message, setMessage, askCameraPermission, service } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const loadFileM = useMutation('loadfileMutuate', loadFile, {
        onMutate: () => {
            setisLoading(true);
        },
        onSuccess: (data) => {
            setisLoading(false);
            setMessage({ message: JSON.stringify(data), type: 'message' })
        },
        onError: (error) => {
            setMessage({ message: `${error}`, type: 'error' })
            setisLoading(false);
        }
    });

    const takePhoto = () => {
        const formData = new FormData();
        launchCamera({ mediaType: 'photo' }, async ({ assets, didCancel, errorCode, errorMessage }) => {
            if (errorMessage) {
                askCameraPermission();
            }
            if (assets) {
                console.log(assets);
                const fileUpload = {
                    uri: assets[0].uri,
                    type: assets[0].type,
                    name: assets[0].fileName,
                }
                formData.append('file', fileUpload);
                formData.append('id_service', `${service?.id_service}`);
                console.log(formData);

                loadFileM.mutate(formData);
            }
        });
    }

    return (
        <Provider>
            {
                (
                    message !== undefined &&
                    (message.message !== 'La sesión expiró' && message.message !== 'Token invalido') &&
                    isFocused) &&
                <ShowMessage
                    show message={{
                        icon: true,
                        type: message.type,
                        message: message.message,
                        title: (message.type === 'error') ? 'ERROR' : (message.type === 'message') ? 'Correcto' : 'Alerta'
                    }}
                />
            }
            {isFocused && <ShowMessage show={(isLoading) ? true : false} loading />}
            <Portal>
                <FAB.Group
                    fabStyle={{ backgroundColor: isOpen ? colors.PrimaryDark : colors.Primary }}
                    visible
                    open={isOpen}
                    icon={isOpen ? 'camera-plus' : 'camera-plus-outline'}
                    actions={[
                        {
                            style: { backgroundColor: colors.Primary },
                            labelStyle: { backgroundColor: colors.background },
                            color: colors.background,
                            labelTextColor: colors.PrimaryDark,
                            icon: 'delete',
                            label: 'Eliminar foto',
                            onPress: () => console.log('Pressed notifications'),
                        },
                        {
                            style: { backgroundColor: colors.Primary },
                            labelStyle: { backgroundColor: colors.background },
                            color: colors.background,
                            labelTextColor: colors.PrimaryDark,
                            icon: 'file-image-plus',
                            label: 'Agragar foto',
                            onPress: () => takePhoto(),
                            small: false,
                        },
                    ]}
                    onStateChange={({ open }) => setIsOpen(open)}
                    onPress={() => setIsOpen(true)}
                />
            </Portal>
        </Provider>
    )
}
