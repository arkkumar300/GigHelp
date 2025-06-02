import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './OtpStyles'
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Logo from '../../../components/Logo';

const OtpScreen = ({ navigation }) => {
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    return (
        <View style={styles.container}>
            <Logo />
            <Text style={styles.title}>Verification OTP</Text>
            <OTPInputView
                pinCount={4}
                autoFocusOnLoad
                codeInputFieldStyle={styles.otpBox}
                style={styles.otpContainer}
            />
            <Text style={styles.codeText}>A Code Has been sent to your phone</Text>
            <Text style={styles.timerText}>
                Resend in <Text style={styles.blueText}>00:{timer < 10 ? `0${timer}` : timer}</Text>
            </Text>
            <TouchableOpacity style={styles.continueBtn}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OtpScreen;
