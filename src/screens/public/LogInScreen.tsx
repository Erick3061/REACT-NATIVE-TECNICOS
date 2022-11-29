import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, StatusBar, KeyboardAvoidingView, ScrollView, SafeAreaView } from 'react-native';
import { RootStackParams } from '../../routes/PublicStackScreen';
import { colors } from '../../theme/colors';
import { screen, textStyle } from '../../theme/styles';
import { Background } from '../../components/Backgroud';
import { AppContext } from '../../context/AppContext';
import { useMutation, useQueryClient } from 'react-query';
import { logIn } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { getExpired, validateError } from '../../functions/helpers';
import { Button, Text, Title } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import VersionNumber from 'react-native-version-number';
import { useForm, SubmitHandler } from "react-hook-form";
import { InputsLogIn } from '../../types/Types';
import { Input } from '../../components/Input';
import { useVersionApp } from '../../hooks/versionApp';

interface Props extends StackScreenProps<RootStackParams, 'LogInScreen'> { };
export const LogInScreen = ({ navigation }: Props) => {
    const isFocused = useIsFocused();
    const queryClient = useQueryClient();
    const versionApp = useVersionApp();

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<InputsLogIn>({ defaultValues: { acceso: '', password: '' } });
    const { setPerson, setService, message, setMessage, setAccount, setExpired, isUpdate, setUpdate } = useContext(AppContext);

    const onSubmit: SubmitHandler<InputsLogIn> = async (data) => {
        const { acceso, password } = data;
        await versionApp.refetch()
            .then(data => {
                if (data.isError) {
                    const meessage = validateError(`${data.error}`);
                    if (meessage) setMessage({ message: meessage.message, type: 'error' });
                }

                if (data.isSuccess) (VersionNumber.appVersion === data.data.version) ? LogIn.mutate({ acceso, password }) : setUpdate(true);
            }).catch(err => setMessage(validateError(`${err}`)))
    };

    const LogIn = useMutation(["LogIn"], logIn,
        {
            retry: 1,
            onSuccess: async ({ Person, token, Service, AccountMW, directory }) => {
                reset();
                if (Person.id_role !== 1) {
                    await AsyncStorage.clear();
                    setMessage(validateError('No tienes acceso a este sistema'));
                } else {
                    await setPerson(Person, token, (directory) ? directory[0] : undefined);
                    await setService(Service);
                    await setAccount(AccountMW);
                    if (Service) {
                        const expired = getExpired(new Date(Service.exitDate));
                        await setExpired(expired);
                    } else {
                        await setExpired(undefined);
                    }
                }
            },
            onError: async error => {
                const message = validateError(`${error}`);
                if (message) setMessage({ message: message.message, type: message.type });
                setValue('password', '');
            }
        }
    );

    return (
        <SafeAreaView style={[screen.full]}>
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
            {isFocused && <ShowMessage show={(queryClient.getQueryState('JWT')?.isFetching || LogIn.isLoading || versionApp.isFetching || LogIn.isLoading || versionApp.isLoading) ? true : false} loading />}
            {isUpdate && <ShowMessage show update={versionApp.data?.url} />}
            <StatusBar backgroundColor={colors.Primary} barStyle={'light-content'} />
            <ScrollView>
                <Background />
                <Title style={{ color: colors.Primary, alignSelf: 'center', fontSize: 30, paddingTop: 50 }}> APP Técnicos </Title>
                <KeyboardAvoidingView style={{ paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Input
                            key={'acceso'}
                            control={control}
                            icon='account'
                            label='acceso'
                            placeholder='ejemplo@correo.com o usuario'
                            name='acceso'
                        />
                        {errors.acceso && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                        <Input
                            key={'password'}
                            control={control}
                            icon='lock'
                            label='password'
                            placeholder='ejemplo@correo.com o usuario'
                            name='password'
                            isPassword
                        />
                        {errors.password && <Text style={{ color: colors.Secondary }}>Campo requerido</Text>}
                    </View>
                    <Button
                        style={{ borderRadius: 12, marginVertical: 10, width: '70%', alignSelf: 'center', marginTop: 40 }}
                        contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                        color={colors.background}
                        icon={'login'}
                        mode='contained'
                        loading={(LogIn.isLoading || versionApp.isFetching || LogIn.isLoading || versionApp.isLoading) ? true : false}
                        onPress={handleSubmit(onSubmit)}
                        disabled={(LogIn.isLoading || versionApp.isFetching || LogIn.isLoading || versionApp.isLoading) ? true : false}
                        labelStyle={{ fontSize: 15, color: colors.Primary }}
                    > Iniciar Sesión </Button>
                    <Button
                        style={{ borderRadius: 12, marginVertical: 10, width: '70%', alignSelf: 'center' }}
                        contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                        color={colors.background}
                        icon={'lock-question'}
                        mode='contained'
                        loading={(LogIn.isLoading || versionApp.isFetching || LogIn.isLoading || versionApp.isLoading) ? true : false}
                        onPress={() => { navigation.navigate('ForgetPasswordScreen') }}
                        disabled={(LogIn.isLoading || versionApp.isFetching || LogIn.isLoading || versionApp.isLoading) ? true : false}
                        labelStyle={{ fontSize: 15, color: colors.Primary }}
                    > Olvidé mi contraseña </Button>
                </KeyboardAvoidingView>
                <Text style={textStyle.terminos}>Terminos y conciciones</Text>
                <Text style={textStyle.version}>versión: {VersionNumber.appVersion}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
