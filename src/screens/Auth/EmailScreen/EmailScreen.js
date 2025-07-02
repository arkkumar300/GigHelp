import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import Logo from '../../../components/Logo';
import styles from './EmailScreenStyles';
import ApiService from '../../../services/ApiService';
import {saveData} from '../../../Utils/appData';

const EmailLoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both Email and Password');
    }

    const payload = {
      email,
      password,
    };
    console.log(payload, 'login credentials');
    
    try {
      const result = await ApiService.post('systemuser/login', payload);
      console.log(result.data.user, 'result');
      await saveData("userInfo",result.data.user)
      Alert.alert('Login Successful', result.message || 'You are logged in', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      console.log('Login failed:', error);
      Alert.alert(
        'Login Failed',
        error?.data?.message || 'Something went wrong!',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.welcomeText}>Welcome back,</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email :"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password :"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Create New Account?{' '}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('Register')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default EmailLoginScreen;
