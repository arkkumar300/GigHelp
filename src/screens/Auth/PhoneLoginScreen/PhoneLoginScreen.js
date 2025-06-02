import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Logo from '../../../components/Logo';
import styles from './PhoneLoginStyles';

const PhoneLoginScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('');

    return (
        <View style={styles.container}>
            <Logo />
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number :"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Otp')}>
                <Text style={styles.buttonText}>Get OTP</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Create New Account?{' '}
                <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
                    Sign up
                </Text>
            </Text>
        </View>
    );
};

export default PhoneLoginScreen;
