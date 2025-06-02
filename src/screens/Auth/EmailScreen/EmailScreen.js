import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Logo from '../../../components/Logo';
import styles from './EmailScreenStyles';

const EmailLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.buttonText}>Login</Text>
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

export default EmailLoginScreen;
