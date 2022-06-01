import React, { useContext } from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Background } from '../../components/Backgroud';
import { colors } from '../../theme/colors';
import { buttonStyle, screen, textStyle } from '../../theme/styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputsForgetPassword } from '../../types/Types';
import { Input } from '../../components/Input';
import { useMutation } from 'react-query';
import { ResetPassword } from '../../api/Api';
import { validateError } from '../../functions/helpers';
import { AppContext } from '../../context/AppContext';
import { ShowMessage } from '../../components/modals/ModalShowMessage';

export const ForgetPasswordScreen = () => {
    const isFocused = useIsFocused();
    const { setMessage, message } = useContext(AppContext);

    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<InputsForgetPassword>({ defaultValues: { access: '', employeeNumber: '', lastName: '', name: '' } });

    const ResetPasswordM = useMutation('ResetPasswordM', ResetPassword, {
        retry: 1,
        onSuccess: data => {
            setMessage({ message: `Contraseña restaurada, Inicie sesion nuevamente con su número de empleado`, type: 'message' });
            reset()
        },
        onError: error => {
            const message = validateError(`${error}`);
            if (message) setMessage(message);
        }
    });

    const onSubmit: SubmitHandler<InputsForgetPassword> = async ({ access, employeeNumber, lastName, name }) => {
        ResetPasswordM.mutate({ access: access.trim(), employeeNumber: employeeNumber.trim(), lastName: lastName.trim(), name: name.trim() });
    };
    return (
        <SafeAreaView style={screen.full}>
            <StatusBar backgroundColor={colors.Primary} barStyle={'light-content'} />
            {
                (message !== undefined && isFocused) &&
                <ShowMessage
                    show message={{
                        title: (message.type === 'error') ? 'Error' : (message.type === 'message') ? 'Correcto' : 'Alerta',
                        icon: true,
                        type: message.type,
                        message: message.message
                    }}
                />
            }
            {isFocused && <ShowMessage show={(ResetPasswordM.isLoading) ? true : false} loading />}
            <ScrollView>
                <Background />
                <KeyboardAvoidingView>
                    <View style={{ marginHorizontal: 20 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center', fontSize: 30, paddingTop: 50 }}>
                                APP Técnicos
                            </Text>
                            <Text
                                style={{ ...textStyle.title, color: colors.Primary, alignSelf: 'center', fontSize: 20, paddingTop: 10, fontWeight: '600' }}>
                                Ingrese su correo electronico designado por la empresa
                            </Text>

                            <Input
                                key={'name'}
                                control={control}
                                label='Nombre(s)'
                                placeholder='Ingrese su nombre'
                                name='name'
                            />
                            {errors.name && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                            <Input
                                key={'lastName'}
                                control={control}
                                label='Apellidos'
                                placeholder='Ingrese sus apellidos'
                                name='lastName'
                            />
                            {errors.lastName && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                            <Input
                                key={'access'}
                                control={control}
                                label='acceso'
                                placeholder='ejemplo@correo.com o usuario'
                                name='access'
                            />
                            {errors.access && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                            <Input
                                key={'employeeNumber'}
                                control={control}
                                label='Número de empleado'
                                placeholder='Ingrese su número de empleado'
                                name='employeeNumber'
                            />
                            {errors.employeeNumber && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}

                        </View>
                        <View style={{ ...buttonStyle.buttonContainer, marginTop: 15 }}>
                            <Button
                                style={{ borderRadius: 12, marginVertical: 10, width: '90%' }}
                                contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                                color={colors.background}
                                mode='contained'
                                loading={(ResetPasswordM.isLoading) ? true : false}
                                disabled={(ResetPasswordM.isLoading) ? true : false}
                                onPress={handleSubmit(onSubmit)}
                                labelStyle={{ fontSize: 15, color: colors.Primary }}
                            > Restablecer Contraseña </Button>

                            <Button
                                style={{ borderRadius: 12, marginVertical: 10, width: '70%' }}
                                contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                                color={colors.background}
                                icon={'login'}
                                mode='contained'
                                loading={(ResetPasswordM.isLoading) ? true : false}
                                disabled={(ResetPasswordM.isLoading) ? true : false}
                                onPress={() => navigation.dispatch(StackActions.pop())}
                                labelStyle={{ fontSize: 15, color: colors.Primary }}
                            > Iniciar Sesión </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}
