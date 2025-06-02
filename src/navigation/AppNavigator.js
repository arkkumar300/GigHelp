import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen/RegisterScreen';
import OtpScreen from '../screens/Auth/OtpScreen/OtpScreen'
import EmailLoginScreen from '../screens/Auth/EmailScreen/EmailScreen';
import PhoneLoginScreen from '../screens/Auth/PhoneLoginScreen/PhoneLoginScreen';
// import MainTabNavigator from './MainTabNavigator'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
        {/* <Stack.Screen name="Main" component={MainTabNavigator} /> */}
    </Stack.Navigator>
);

export default AppNavigator;
