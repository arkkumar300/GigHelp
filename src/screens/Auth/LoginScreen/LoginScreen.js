import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Logo from '../../../components/Logo';
import styles from './LoginStyles';

import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.backButton}>
          {/* <Text style={styles.backArrow}>←</Text> */}
          <Icon name="angle-left" size={30} color="#000" />
        </TouchableOpacity>

        <Logo />
        <Text style={styles.tagline}>Help & Earn</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EmailLogin')}>
          <Text style={styles.buttonText}>Login Email</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PhoneLogin')}>
          <Text style={styles.buttonText}>Login Phone number</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Create New Account ?{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
            Sign up
          </Text>
        </Text>
      </View>

      <Image
        source={require('../../../assets/images/gig-login-bottom-img.jpg')}
        style={styles.footerImage}
        resizeMode="cover"
      />
    </View>
  );
};

export default LoginScreen;
