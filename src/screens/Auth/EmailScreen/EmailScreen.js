import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {Logo, BottomImage} from '../../../components/Logo';
import styles from './EmailScreenStyles';
import ApiService from '../../../services/ApiService';
import {saveData} from '../../../Utils/appData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmailLoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert('Please enter both Email and Password');
      return;
    }

    const payload = {userName, password};
    console.log(payload, 'login credentials');
    setLoading(true);

    try {
      const result = await ApiService.post('/systemuser/login', payload);
      await saveData('userInfo', result.data.user);
      // Alert.alert('Login Successful', result.message || 'You are logged in', [
      //   {text: 'OK', onPress: () => navigation.navigate('Home')},
      // ]);

      // Alert.alert('Logout', 'You have been logged out.');
      //       navigation.reset({
      //         index: 0,
      //         routes: [{ name: 'Login' }],
      //       });

      setSuccessMessage(result.message || 'You are logged in');
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });

      // setTimeout(() => {
      //   setSuccessMessage('');
      //   navigation.navigate('Home');
      // }, 2000);
    } catch (error) {
      console.log('Login failed:', error);
      Alert.alert(
        'Login Failed',
        result?.data?.message || 'Something went wrong!',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // {
  //   loading && (
  //     <View style={styles.loadingOverlay}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      <Image
        source={require('../../../assets/images/gig-login-bottom-img.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>

          <Logo />

          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.subText}>Login to continue</Text>

          {/* <Text style={styles.label}>Email :</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="email-outline"
              size={20}
              color="#888"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email :"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#888"
            />
          </View> */}

          <Text style={styles.label}>User Name :</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="account-outline"
              size={20}
              color="#888"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter User Name :"
              value={userName}
              onChangeText={setUserName}
              placeholderTextColor="#888"
            />
          </View>

          <Text style={styles.label}>Password :</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="lock-outline"
              size={20}
              color="#888"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Enter Password :"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forget Password ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}>
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
        {/* <View style={styles.footerContainer}>
        <BottomImage style={styles.footerImage} />
      </View> */}

        {successMessage !== '' && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessageText}>{successMessage}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmailLoginScreen;
