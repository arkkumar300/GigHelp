import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../../../services/ApiService';
import {useIsFocused} from '@react-navigation/native';
import styles from './RegisterStyles';

export default function RegisterScreen({navigation}) {
  const [identityType, setIdentityType] = useState('Aadhar Number');
  const [identityModalVisible, setIdentityModalVisible] = useState(false);
  const [identityNumber, setIdentityNumber] = useState('');
  const [identityProof, setIdentityProof] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [work, setWork] = useState('');
  const [experience, setExperience] = useState('');

  const identityOptions = ['Aadhar Number', 'PAN Number', 'Voter ID'];
  const isFocused = useIsFocused();

  const handleRegister = async () => {
    if (!userName || !phoneNumber || !email || !password || !identityNumber) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    const payload = {
      userName,
      phoneNumber,
      email,
      password,
      identityType: identityType.toLowerCase().replace(' ', ''),
      identityNumber,
      identityProof,
      skills: [
        {
          work,
          experience,
        },
      ],
    };

    try {

      const endpoint = 'systemuser/register';
      const url = `${ApiService.baseURL}/${endpoint}`
      console.log('Request URL:', url);
      const result = await ApiService.post('systemuser/register', payload);

      if (result.success) {
        // navigation.navigate('Login')
        Alert.alert(
          'Registration Successful',
          result.message || 'You are registered!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        );
      } else {
        Alert.alert(
          'Registration Failed',
          result.message || 'Something went wrong!',
        );
      }
    } catch (error) {
      Alert.alert('Error', error?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/images/gig-login-bottom-img.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={26} color="#000" />
        </TouchableOpacity>

        {/* Logo + Tagline */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../../assets/images/gig-logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Help & Earn</Text>
        </View>

        <Text style={styles.header}>Register</Text>

        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={styles.label}>Phone Number :</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 99985 55664"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={styles.input}
          placeholder="leadxpo123@gmail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password :</Text>
        <TextInput
          style={styles.input}
          placeholder="6 -20 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Identify Proof :</Text>
        <TouchableOpacity
          style={styles.dropdownTouchable}
          onPress={() => setIdentityModalVisible(true)}>
          <Text style={styles.dropdownText}>{identityType}</Text>
          <Icon name="chevron-right" size={20} color="#333" />
        </TouchableOpacity>

        <Modal visible={identityModalVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={() => setIdentityModalVisible(false)}>
            <View style={styles.modalContent}>
              {identityOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setIdentityType(option);
                    setIdentityModalVisible(false);
                  }}
                  style={styles.modalItem}>
                  <Text style={styles.modalText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="9877 6575 9875"
          value={identityNumber}
          onChangeText={setIdentityNumber}
        />

        <Text style={styles.label}>Fill the Skills</Text>
        <View style={styles.skillHeader}>
          <Text style={styles.label}></Text>
          <TouchableOpacity>
            <Icon name="plus" size={26} color="#007BFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.skillBox}>
          <TextInput
            style={styles.input}
            placeholder="Works"
            value={work}
            onChangeText={setWork}
          />
          <TextInput
            style={styles.input}
            placeholder="Experience"
            value={experience}
            onChangeText={setExperience}
          />
          <TouchableOpacity style={styles.removeSkill}>
            <Icon name="minus" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          I agree to the <Text style={styles.linkText}>Terms of Service</Text>
        </Text>

        <TouchableOpacity
          style={styles.createAccountBtn}
          onPress={handleRegister}>
          <Text style={styles.createAccountText}>Create an Account</Text>
        </TouchableOpacity>

        <Text style={styles.signInText}>
          Have an Account?{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Login')}>
            Sign in
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
