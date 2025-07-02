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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../../../services/ApiService';

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

  const handleRegister = async () => {
    if (!userName || !phoneNumber || !email || !password || !identityNumber) {
      Alert.alert('Please fill all required fields.');
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

    console.log(payload, 'payload');

    try {
      const result = await ApiService.post('systemuser/register', payload);

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
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert(
        'Registration Failed',
        error?.data?.message || 'Something went wrong!',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Register</Text>

        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mahesh"
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 99995 55564"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="6 - 20 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Identity Type:</Text>
        <TouchableOpacity
          style={styles.dropdownTouchable}
          onPress={() => setIdentityModalVisible(true)}>
          <Text style={styles.dropdownText}>{identityType}</Text>
          <Icon name="keyboard-arrow-down" size={24} color="#333" />
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
          placeholder={
            identityType === 'Aadhar Number'
              ? '8677 8875 9876'
              : identityType === 'PAN Number'
              ? 'ABCDE1234F'
              : 'XYZ1234567'
          }
          value={identityNumber}
          onChangeText={setIdentityNumber}
        />

        <Text style={styles.label}>Identity Proof (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Proof URL or Description"
          value={identityProof}
          onChangeText={setIdentityProof}
        />

        <Text style={styles.label}>Skills:</Text>
        <View style={styles.skillBox}>
          <TextInput
            style={styles.input}
            placeholder="Work (e.g., Developer)"
            value={work}
            onChangeText={setWork}
          />
          <TextInput
            style={styles.input}
            placeholder="Experience (e.g., 2 years)"
            value={experience}
            onChangeText={setExperience}
          />
        </View>

        <TouchableOpacity
          style={styles.createAccountBtn}
          onPress={handleRegister}>
          <Text style={styles.createAccountText}>Create an Account</Text>
        </TouchableOpacity>

        <Text style={styles.signInText}>
          Have an Account? <Text style={styles.linkText}>Sign in</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  dropdownTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalText: {
    fontSize: 16,
  },
  skillBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  createAccountBtn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  createAccountText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  signInText: {
    textAlign: 'center',
    fontSize: 13,
  },
  linkText: {
    color: '#007BFF',
  },
});
