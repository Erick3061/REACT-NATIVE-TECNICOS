import React, { useState } from 'react'
import { TextInput } from 'react-native-paper'

interface props {
    value: string,
    onChange: (value: string, field: any) => void;
    field: string;
    icon: string;
    isPassword?: boolean;
    label: string;
    placeholder: string;
}
export const Input = ({ value, onChange, isPassword, field, icon, label, placeholder }: props) => {
    const [ShowPassword, setShowPassword] = useState<boolean>(false);
    return (
        <TextInput
            style={[{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }]}
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={(text) => onChange(text, field)}
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
    )
}
