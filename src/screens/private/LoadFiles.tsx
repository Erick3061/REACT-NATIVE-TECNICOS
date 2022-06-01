import React, { useContext, useState } from 'react';
import { Button, Card, Dialog, FAB, Modal, Portal, Provider, } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { useMutation, useQuery } from 'react-query';
import { loadFile, baseUrl, getImgs, deleteImg } from '../../api/Api';
import { Image, RefreshControl, View, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { validateError } from '../../functions/helpers';
import { CardImage } from '../../components/CardImage';

export const LoadFiles = () => {
    const isFocused = useIsFocused();
    const [isLoading, setisLoading] = useState<boolean>(false);
    const { message, setMessage, askCameraPermission, service } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [files, setfiles] = useState<Array<string>>([]);
    const [isViewImage, setisViewImage] = useState<boolean>(false);
    const [imageSelected, setimageSelected] = useState<string>('');

    const Files = useQuery('Files', () => getImgs({ id: service!.id_service, type: 'Service' }), {
        retry: 0,
        onSuccess: data => {
            setfiles(() => data.files);
        },
        onError: error => {
            setfiles(() => []);
            if (`${error}`.toLocaleLowerCase().includes('no se han subido fotos')) return setMessage({ message: `No se han subido fotos`, type: 'warning' });
            const message = validateError(`${error}`);
            setMessage({ message: `${message}`, type: 'error' });
        }
    });

    const loadFileM = useMutation('loadfileMutuate', loadFile, {
        retry: 0,
        onMutate: () => {
            setisLoading(true);
        },
        onSuccess: (data) => {
            setisLoading(false);
            setMessage({ message: 'Imagen insertada correctamente', type: 'message' });
            Files.refetch();
        },
        onError: (error) => {
            const message = validateError(`${error}`);
            setMessage({ message: `${message?.message}`.replace(/Error:/g, ''), type: 'error' });
            setisLoading(false);
        }
    });

    const deleteFileM = useMutation('deleteImgMutate', deleteImg, {
        retry: 1,
        onMutate: () => {
            setisLoading(true);
        },
        onSuccess: () => {
            setisLoading(false);
            setMessage({ message: 'Imagen eliminada', type: 'message' });
            Files.refetch();
        },
        onError: (error) => {
            const message = validateError(`${error}`);
            setMessage({ message: `${message}`, type: 'error' });
            setisLoading(false);
        }
    });

    const pickPhoto = () => {
        const formData = new FormData();
        launchImageLibrary({
            mediaType: 'photo'
        }, async ({ assets, didCancel, errorCode, errorMessage }) => {
            if (errorMessage) {
                setMessage({ message: `${errorMessage}`, type: 'error' });
            }
            if (assets) {
                const fileUpload = {
                    uri: assets[0].uri,
                    type: assets[0].type,
                    name: assets[0].fileName,
                }
                formData.append('file', fileUpload);
                loadFileM.mutate({ file: formData, id: service!.id_service, type: 'Service' });
            }
        });
    }

    const takePhoto = () => {
        const formData = new FormData();
        launchCamera({
            mediaType: 'photo',
            maxWidth: 1200,
            maxHeight: 2200,
            quality: 1,
            saveToPhotos: true,
        }, async ({ assets, didCancel, errorCode, errorMessage }) => {
            if (errorMessage) {
                askCameraPermission();
            }
            if (assets) {
                const fileUpload = {
                    uri: assets[0].uri,
                    type: assets[0].type,
                    name: assets[0].fileName,
                }
                formData.append('file', fileUpload);
                loadFileM.mutate({ file: formData, id: service!.id_service, type: 'Service' });
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
            {isFocused && <ShowMessage show={(isLoading || Files.isLoading || Files.isFetching) ? true : false} loading />}
            <CardImage
                key='Images'
                files={files}
                id_service={`${service?.id_service}`}
                isScrollView={{ deleteFileM: deleteFileM, Files: Files }}
            />
            <Portal>
                <FAB.Group
                    fabStyle={{ backgroundColor: isOpen ? colors.PrimaryDark : colors.Primary }}
                    visible
                    open={isOpen}
                    icon={isOpen ? 'file-image-plus' : 'file-image-plus-outline'}
                    actions={[
                        {
                            style: { backgroundColor: colors.Primary },
                            labelStyle: { backgroundColor: colors.background },
                            color: colors.background,
                            labelTextColor: colors.PrimaryDark,
                            icon: 'image-plus',
                            label: 'Agregar de la galeria de imágenes',
                            onPress: () => pickPhoto(),
                            small: false,
                        },
                        {
                            style: { backgroundColor: colors.Primary },
                            labelStyle: { backgroundColor: colors.background },
                            color: colors.background,
                            labelTextColor: colors.PrimaryDark,
                            icon: 'camera-plus',
                            label: 'Tomar una foto',
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
