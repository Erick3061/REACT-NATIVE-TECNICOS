import React from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Background } from '../../components/Backgroud';
import { colors } from '../../theme/colors';
import { buttonStyle, screen, textStyle } from '../../theme/styles';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputsForgetPassword } from '../../types/Types';
import { Input } from '../../components/Input';

export const ForgetPasswordScreen = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<InputsForgetPassword>({ defaultValues: { access: '', employeeNumber: '', lastName: '', name: '' } });
    const onSubmit: SubmitHandler<InputsForgetPassword> = async (data) => {
        const { access, employeeNumber, lastName, name } = data;
        console.log(data);

    };
    return (
        <SafeAreaView style={screen.full}>
            <StatusBar backgroundColor={colors.Primary} barStyle={'light-content'} />
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
                                icon='account'
                                label='Nombre'
                                placeholder='Ingrese su nombre'
                                name='name'
                            />
                            {errors.name && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                            <Input
                                key={'lastName'}
                                control={control}
                                icon='account'
                                label='Apellidos'
                                placeholder='Ingrese sus apellidos'
                                name='lastName'
                            />
                            {errors.lastName && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                            <Input
                                key={'access'}
                                control={control}
                                icon='account'
                                label='acceso'
                                placeholder='ejemplo@correo.com o usuario'
                                name='access'
                            />
                            {errors.access && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                            <Input
                                key={'employeeNumber'}
                                control={control}
                                icon='account'
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
                                icon={'login'}
                                mode='contained'
                                // loading={(JWT.isFetching || LogIn.isFetching || JWT.isLoading || LogIn.isLoading) ? true : false}
                                onPress={handleSubmit(onSubmit)}
                                // disabled={(JWT.isFetching || LogIn.isFetching || JWT.isLoading || LogIn.isLoading) ? true : false}
                                labelStyle={{ fontSize: 15, color: colors.Primary }}
                            > Restablecer Contraseña </Button>

                            <Button
                                style={{ borderRadius: 12, marginVertical: 10, width: '70%' }}
                                contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                                color={colors.background}
                                icon={'login'}
                                mode='contained'
                                // loading={(JWT.isFetching || LogIn.isFetching || JWT.isLoading || LogIn.isLoading) ? true : false}
                                onPress={() => navigation.dispatch(StackActions.pop())}
                                // disabled={(JWT.isFetching || LogIn.isFetching || JWT.isLoading || LogIn.isLoading) ? true : false}
                                labelStyle={{ fontSize: 15, color: colors.Primary }}
                            > Iniciar Sesión </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}
