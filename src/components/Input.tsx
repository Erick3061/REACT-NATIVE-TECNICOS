import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form';
import { TextInput } from 'react-native-paper'

interface props {
    control: Control<any, any>;
    name: string;
    icon?: string;
    isPassword?: boolean;
    label: string;
    placeholder: string;
}
export const Input = ({ isPassword, icon, label, placeholder, control, name }: props) => {
    const [ShowPassword, setShowPassword] = useState<boolean>(false);
    return (
        <Controller
            control={control}
            rules={{ required: true }}
            name={name}
            render={({ field: { value, onBlur, onChange } }) => (
                <TextInput
                    style={[{ backgroundColor: 'rgba(0,0,0,0)' }]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    label={label.toUpperCase()}
                    placeholder={placeholder}
                    secureTextEntry={isPassword ? !ShowPassword : undefined}
                    left={icon ? <TextInput.Icon name={icon} /> : undefined}
                    right={
                        isPassword ?
                            < TextInput.Icon
                                name={ShowPassword ? 'eye' : 'eye-off'}
                                onPress={() => setShowPassword(!ShowPassword)}
                                forceTextInputFocus={false}
                                animated
                            />
                            : undefined
                    }
                />
            )}
        />
    )
}