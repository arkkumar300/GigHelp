import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Logo, BottomImage} from '../../../components/Logo';
import styles from "./PhoneLoginStyles"

const {height} = Dimensions.get('window');

const PhoneLoginScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="#000" />
      </TouchableOpacity>

      <Logo />

      <Text style={styles.title}>Welcome back,</Text>
      <Text style={styles.subTitle}>Login to continue</Text>

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputContainer}>
        <Icon name="account" size={18} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number :"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => navigation.navigate('Otp')}>
        <Text style={styles.loginText}>Get OTP</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Create New Account?{' '}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('Register')}>
          Sign up
        </Text>
      </Text>

      <View style={styles.footerImageWrapper}>
        <BottomImage />
      </View>
    </View>
  );
};

export default PhoneLoginScreen;
