import React from "react";
import { Text } from "react-native";
import { colors } from "../theme/colors";
import { generales } from "../theme/styles";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const CountDownTimer = () => {
    const { expired } = useContext(AppContext);
    return (
        <>
            <Text style={{ ...generales.titulo1, color: colors.Primary, textAlign: 'center', fontSize: 30 }}>Tiempo restante:</Text>
            <Text style={{ ...generales.titulo1, color: colors.Primary, textAlign: 'center', paddingVertical: 5, fontSize: 30 }}>{`${expired?.hours.toString().padStart(2, '0')} : ${expired?.minutes.toString().padStart(2, '0')} : ${expired?.seconds.toString().padStart(2, '0')}`}</Text>
        </>
    );
}

export default CountDownTimer;