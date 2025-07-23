import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Logo, BottomImage} from '../../../components/Logo';
import styles from './LoginStyles';
import {loadData} from '../../../Utils/appData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const storedUser = await loadData('userInfo');
      if (storedUser) {
        setUserInfo(storedUser);
      }
    };
    getUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={28} color="#000" />
      </TouchableOpacity>

      <View style={styles.contentWrapper}>
        <Logo style={{width: 250, height: 100, resizeMode: 'contain'}} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EmailLogin')}>
          <Text style={styles.buttonText}>Login Email</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PhoneLogin')}>
          <Text style={styles.buttonText}>Login Phone number</Text>
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

      <View style={styles.footerContainer}>
        <BottomImage style={styles.footerImage} />
      </View>
    </View>
  );
};

export default LoginScreen;
