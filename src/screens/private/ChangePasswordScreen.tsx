import React, { useContext, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, SafeAreaView, View } from 'react-native';
import { colors } from '../../theme/colors';
import { AppContext } from '../../context/AppContext';
import { Button, Text, TextInput } from 'react-native-paper';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { screen } from '../../theme/styles';
import { useIsFocused } from '@react-navigation/native';
import { useMutation, useQuery } from 'react-query';
import { ChangePassword, ValidatePassword } from '../../api/Api';
import { validateError } from '../../functions/helpers';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { Input } from '../../components/Input';
import { InputsChangePassword } from '../../types/Types';
import { Input } from '../../components/Input';

export const ChangePasswordScreen = () => {
    const isFocused = useIsFocused();
    const { person, setMessage, message, logOut } = useContext(AppContext);
    const [oneFilter, setoneFilter] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm<InputsChangePassword>({ defaultValues: { confirmPassword: '', newPassword: '', password: '' } });

    const validatePasswordM = useMutation(["validatePassword"], ValidatePassword,
        {
            retry: 1,
            onMutate: () => {
                setIsLoading(true);
            },
            onSuccess: async ({ isValid }) => {
                setIsLoading(false);
                if (isValid) {
                    setMessage({ message: `Contraseña correcta...`, type: 'message' });
                    setoneFilter(true);
                }
            },
            onError: async error => {
                setIsLoading(false);
                setMessage(validateError(`${error}`))
            }
        }
    );


    const changePasswordM = useMutation(["changePassword"], ChangePassword,
        {
            retry: 1,
            onMutate: () => {
                setIsLoading(true);
            },
            onSuccess: async ({ changed }) => {
                setIsLoading(false);
                if (changed) {
                    logOut();
                    setMessage({ message: `Se cerro la sesión por seguridad \n Inicie sesón nuevamente\n Contraseña: ${getValues('newPassword')}`, type: 'message' });
                }
            },
            onError: async error => {
                setIsLoading(false);
                setMessage(validateError(`${error}`))
            }
        }
    );
    const onSubmit: SubmitHandler<InputsChangePassword> = async (data) => {
        const { confirmPassword, newPassword, password } = data;
        Keyboard.dismiss();
        try {
            if (!oneFilter) {
                if (password.length === 0) throw new Error("Debe ingresar su contraseña actual");
                validatePasswordM.mutate({ password });
            } else {
                if (newPassword.length === 0) throw new Error("El campo 'Contraseña nueva' es requerido");
                if (confirmPassword.length === 0) throw new Error("El campo 'Confirmar Contaseña' es requerido");
                if (newPassword !== confirmPassword) throw new Error("Las contraseñas no coinciden");
                if (password === newPassword) throw new Error("Debes ingresar una contraseña diferente a la actual");
                if (newPassword.indexOf(' ') >= 0 || confirmPassword.indexOf(' ') >= 0) throw new Error("La contraseña no debe contener espacios en blanco");
                changePasswordM.mutate({ password: newPassword });
            }
        } catch (error) {
            (!oneFilter) && reset();
            setMessage({ message: `${error}`, type: 'error' });
        }
    }

    return (
        <SafeAreaView style={screen.full}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {(isFocused && message !== undefined && (message.message !== 'La sesión expiró' && message.message !== 'Token invalido' && !message.message.includes('Se cerro la sesión por seguridad'))) &&
                    <ShowMessage show message={{
                        title: message.type === 'error' ? 'ERROR' : message.type === 'message' ? 'CORRECTO' : 'ALERTA',
                        icon: true,
                        type: message.type,
                        message: message.message,
                    }} />}
                {isFocused && <ShowMessage show={(IsLoading) ? true : false} loading />}
                <KeyboardAvoidingView style={{ height: '100%', width: '100%' }}>
                    <View style={{ flex: 1, marginHorizontal: 30, marginVertical: '20%' }}>
                        {
                            (!oneFilter)
                                ?
                                <>
                                    <Input
                                        control={control}
                                        name='password'
                                        key={'password'}
                                        icon='lock'
                                        label='Contraeña actual'
                                        placeholder='**********'
                                        isPassword />
                                    {errors.password && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                                </>

                                :
                                <>
                                    <Input
                                        control={control}
                                        name='newPassword'
                                        key={'newPassword'}
                                        icon='lock'
                                        label='Contraeña nueva'
                                        placeholder='**********'
                                        isPassword />
                                    {errors.newPassword && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                                    <Input
                                        control={control}
                                        name='confirmPassword'
                                        key={'confirmPassword'}
                                        icon='lock'
                                        label='Confirmar contraseña'
                                        placeholder='**********'
                                        isPassword />
                                    {errors.confirmPassword && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}

                                </>
                        }
                        <View style={{ marginTop: 15, alignItems: 'center' }}>
                            <Button
                                style={{ borderRadius: 12, marginVertical: 10, width: '70%' }}
                                contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                                color={colors.background}
                                icon={'login'}
                                mode='contained'
                                loading={(IsLoading) ? true : false}
                                onPress={handleSubmit(onSubmit)}
                                disabled={(IsLoading) ? true : false}
                                labelStyle={{ fontSize: 15, color: colors.Primary }}
                            > {(!oneFilter) ? 'Validar' : 'Cambiar contraseña'}</Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    )
}
