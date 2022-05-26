import React, { useState } from 'react'
import { Control, Controller, FormState, useController, UseFormRegister } from 'react-hook-form';
import { TextInput } from 'react-native-paper'
import { InputsLogIn } from '../types/Types';

// interface props {
//     control: Control<any, any>
//     name: any;
//     icon: string;
//     isPassword?: boolean;
//     label: string;
//     placeholder: string;
// }
// export const Input = ({ isPassword, name, icon, label, placeholder, control }: props) => {
//     const { field } = useController({ control, defaultValue: '', name });
//     const [ShowPassword, setShowPassword] = useState<boolean>(false);
//     return (
//         <TextInput
//             style={[{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }]}
//             label={label}
//             placeholder={placeholder}
//             value={field.value}
//             onChangeText={field.onChange}
//             secureTextEntry={isPassword ? !ShowPassword : undefined}
//             left={
//                 <TextInput.Icon
//                     name={icon}
//                     size={35}
//                 />
//             }
//             right={
//                 isPassword ?
//                     < TextInput.Icon
//                         name={ShowPassword ? 'eye' : 'eye-off'}
//                         onPress={() => setShowPassword(!ShowPassword)}
//                         forceTextInputFocus={false}
//                         size={35}
//                         animated
//                     />
//                     : undefined
//             }
//         />
//     )
// }

interface iputProps {
    register: UseFormRegister<any>
    formState: FormState<any>
    name: any;
    icon: string;
    isPassword?: boolean;
    label: string;
    placeholder: string;
}
export const Input = ({ isPassword, name, icon, label, placeholder, register }: iputProps) => {
    const [ShowPassword, setShowPassword] = useState<boolean>(false);
    return (
        <>
            <TextInput
                {...register(name, { required: true })}
                style={[{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }]}
                label={label}
                placeholder={placeholder}

                secureTextEntry={isPassword ? !ShowPassword : undefined}
                left={
                    <TextInput.Icon
                        name={icon}
                        size={35}
                    />
                }
                right={
                    isPassword ?
                        < TextInput.Icon
                            name={ShowPassword ? 'eye' : 'eye-off'}
                            onPress={() => setShowPassword(!ShowPassword)}
                            forceTextInputFocus={false}
                            size={35}
                            animated
                        />
                        : undefined
                }
            />
            {errors.acceso?.type === 'required' && <Text>requerido</Text>}
        </>

    )
}