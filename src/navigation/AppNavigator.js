// AppNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from '../screens/Auth/SplashScreen';
import AuthLoadingScreen from '../screens/Auth/AuthLoadingScreen';
import LoginScreen from '../screens/Auth/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen/RegisterScreen';
import OtpScreen from '../screens/Auth/OtpScreen/OtpScreen';
import EmailLoginScreen from '../screens/Auth/EmailScreen/EmailScreen';
import PhoneLoginScreen from '../screens/Auth/PhoneLoginScreen/PhoneLoginScreen';

import DrawerNavigator from '../DrawerNavigator/DrawerNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Splash">
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />

    {/* Auth Screens */}
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Otp" component={OtpScreen} />
    <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
    <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />

    {/* Main App Screens */}
    <Stack.Screen name="Home" component={DrawerNavigator} />
  </Stack.Navigator>
);

export default AppNavigator;
