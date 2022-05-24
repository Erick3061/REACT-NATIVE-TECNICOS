import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react'
import { View, StatusBar, KeyboardAvoidingView, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { RootStackParams } from '../../routes/PublicStackScreen';
import { useForm } from '../../hooks/useForm';
import { colors } from '../../theme/colors';
import { screen, textStyle } from '../../theme/styles';
import { Background } from '../../components/Backgroud';
import { AppContext } from '../../context/AppContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { GetVersionApp, logIn } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShowMessage } from '../../components/modals/ModalShowMessage';
import { getExpired, validateError } from '../../functions/helpers';
import { Button, Text, Title } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { Input } from '../../components/Input';
import VersionNumber from 'react-native-version-number';

interface Props extends StackScreenProps<RootStackParams, 'LogInScreen'> { };
export const LogInScreen = ({ navigation, route }: Props) => {
    const isFocused = useIsFocused();
    const queryClient = useQueryClient();
    // const { onChange, acceso, password, reset } = useForm({ acceso: '', password: '' });
    const { onChange, acceso, password, reset } = useForm({ acceso: 'erick.andrade@pem-sa.com', password: '1' });
    const { setPerson, setService, message, setMessage, setAccount, setExpired } = useContext(AppContext);
    const [IsUpdate, setIsUpdate] = useState<boolean>(false);

    const LogIn = useMutation(["LogIn"], logIn,
        {
            retry: 1,
            onSuccess: async ({ Person, token, Service, AccountMW }) => {
                if (Person.id_role !== 1) {
                    await AsyncStorage.clear();
                    setMessage(validateError('No tienes acceso a este sistema'));
                } else {
                    await setPerson(Person, token);
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
            onError: async error => setMessage(validateError(`${error}`))
        }
    );

    const VersionApp = useQuery(["VersionApp"], () => GetVersionApp(),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: false,
            retry: 1,
        }
    );

    const onLogIn = async () => {
        await VersionApp.refetch()
            .then(data => {
                if (data.isError) {
                    setMessage(validateError(`${data.error}`));
                }
                if (data.isSuccess) {
                    if (VersionNumber.appVersion === data.data.version) {
                        LogIn.mutate({ acceso, password });
                        reset();
                    } else {
                        setIsUpdate(true);
                    }
                }
            })
            .catch(err => setMessage(validateError(`${err}`)))
    }

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
            {isFocused && <ShowMessage show={(queryClient.getQueryState('JWT')?.isFetching || LogIn.isLoading || VersionApp.isFetching || LogIn.isLoading || VersionApp.isLoading) ? true : false} loading />}
            {IsUpdate && <ShowMessage show update={VersionApp.data?.url} />}
            <StatusBar backgroundColor={colors.Primary} barStyle={'light-content'} />
            <ScrollView>
                <Background />
                <Title style={{ color: colors.Primary, alignSelf: 'center', fontSize: 30, paddingTop: 50 }}> APP Técnicos </Title>
                <KeyboardAvoidingView style={{ paddingHorizontal: 20 }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Input key={'user'} field='acceso' icon='account' onChange={onChange} value={acceso} label='Acceso' placeholder='ejemplo@correo.com o usuario' />
                        <Input key={'password'} field='password' icon='lock' onChange={onChange} value={password} label='Contraeña' placeholder='Escriba su contraseña' isPassword />
                    </View>
                    <Button
                        style={{ borderRadius: 12, marginVertical: 10, width: '70%', alignSelf: 'center', marginTop: 40 }}
                        contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                        color={colors.background}
                        icon={'login'}
                        mode='contained'
                        loading={(LogIn.isLoading || VersionApp.isFetching || LogIn.isLoading || VersionApp.isLoading) ? true : false}
                        onPress={onLogIn}
                        disabled={(LogIn.isLoading || VersionApp.isFetching || LogIn.isLoading || VersionApp.isLoading) ? true : false}
                        labelStyle={{ fontSize: 15, color: colors.Primary }}
                    > Iniciar Sesión </Button>
                    <Button
                        style={{ borderRadius: 12, marginVertical: 10, width: '70%', alignSelf: 'center' }}
                        contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                        color={colors.background}
                        icon={'lock-question'}
                        mode='contained'
                        loading={(LogIn.isLoading || VersionApp.isFetching || LogIn.isLoading || VersionApp.isLoading) ? true : false}
                        onPress={() => { navigation.navigate('ForgetPasswordScreen') }}
                        disabled={(LogIn.isLoading || VersionApp.isFetching || LogIn.isLoading || VersionApp.isLoading) ? true : false}
                        labelStyle={{ fontSize: 15, color: colors.Primary }}
                    > Olvidé mi contraseña </Button>
                </KeyboardAvoidingView>
                <Text style={textStyle.terminos}>Terminos y conciciones</Text>
                <Text style={textStyle.version}>versión: {VersionNumber.appVersion}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
