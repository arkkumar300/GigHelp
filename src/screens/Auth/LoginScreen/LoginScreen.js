import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Logo from '../../../components/Logo';
import styles from './LoginStyles';
import {loadData} from '../../../Utils/appData';

// import {Icon} from 'react-native-vector-icons/MaterialCommunityIcons';
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
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
          {/* <Icon name="account" size={30} color="#000" /> */}
        </TouchableOpacity>

        <Logo />
        <Text style={styles.tagline}>Help & Earn</Text>

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
          Create New Account ?{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Register')}>
            Sign up
          </Text>
        </Text>
      </View>

      {/* <Image
        source={require('../../../assets/images/gig-login-bottom-img.jpg')}
        style={styles.footerImage}
        resizeMode="cover"
      /> */}
    </View>
  );
};

export default LoginScreen;

// import React from 'react';
// import { View, Text } from 'react-native';

// const LoginScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//       <Text style={{ fontSize: 24, color: 'black' }}>Login Screen is working</Text>
//     </View>
//   );
// };

// export default LoginScreen;
