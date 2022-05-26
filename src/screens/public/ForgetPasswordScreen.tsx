import React from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Background } from '../../components/Backgroud';
import { useForm } from '../../hooks/useForm';
import { colors } from '../../theme/colors';
import { buttonStyle, screen, textStyle } from '../../theme/styles';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

export const ForgetPasswordScreen = () => {
    const navigation = useNavigation();
    const { onChange, acceso } = useForm({ acceso: '', password: '' });
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

                            <TextInput
                                style={[{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }]}
                                label="Acceso"
                                placeholder="ejemplo@correo.com o usuario"
                                value={acceso}
                                onChangeText={(text) => onChange(text, 'acceso')}
                                left={
                                    <TextInput.Icon
                                        name={'account'}
                                        size={35}
                                    />
                                }
                            />
                            <TextInput
                                style={[{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }]}
                                label="Acceso"
                                placeholder="ejemplo@correo.com o usuario"
                                value={acceso}
                                onChangeText={(text) => onChange(text, 'acceso')}
                                left={
                                    <TextInput.Icon
                                        name={'account'}
                                        size={35}
                                    />
                                }
                            />
                            <TextInput
                                style={[{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }]}
                                label="Acceso"
                                placeholder="ejemplo@correo.com o usuario"
                                value={acceso}
                                onChangeText={(text) => onChange(text, 'acceso')}
                                left={
                                    <TextInput.Icon
                                        name={'account'}
                                        size={35}
                                    />
                                }
                            />
                            <TextInput
                                style={[{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }]}
                                label="Acceso"
                                placeholder="ejemplo@correo.com o usuario"
                                value={acceso}
                                onChangeText={(text) => onChange(text, 'acceso')}
                                left={
                                    <TextInput.Icon
                                        name={'account'}
                                        size={35}
                                    />
                                }
                            />
                        </View>
                        <View style={{ ...buttonStyle.buttonContainer, marginTop: 15 }}>
                            <Button
                                style={{ borderRadius: 12, marginVertical: 10, width: '90%' }}
                                contentStyle={{ height: 50, borderRadius: 12, borderWidth: 2, borderColor: colors.Primary }}
                                color={colors.background}
                                icon={'login'}
                                mode='contained'
                                // loading={(JWT.isFetching || LogIn.isFetching || JWT.isLoading || LogIn.isLoading) ? true : false}
                                onPress={() => { }}
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
