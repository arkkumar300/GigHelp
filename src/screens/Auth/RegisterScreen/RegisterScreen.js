import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  console.log(errors, 'errorsss');

  const validateFields = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!userName.trim()) newErrors.userName = 'User name is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please re-enter your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    console.log(errors, 'abcd');
  }, [errors]);

  // const handleRegister = async () => {
  //   if (!validateFields()) return; // Stop if validation fails

  //   const payload = {
  //     name,
  //     phoneNumber,
  //     email,
  //     password,
  //     userName,
  //   };

  //   try {
  //     const result = await ApiService.post('systemuser/register', payload);

  //     if (result.success) {
  //       Alert.alert(
  //         'Registration Successful',
  //         result.message || 'You are registered!',
  //         [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
  //       );
  //     } else {
  //       Alert.alert('Registration Failed', result.message || 'Something went wrong!');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', error?.data?.message || 'Something went wrong!');
  //   }
  // };

  const handleRegister = async () => {
    if (!validateFields()) return;

    const payload = {name, phoneNumber, email, password, userName};

    try {
      const result = await ApiService.post('/systemuser/register', payload);

      if (result.success) {
        Alert.alert(
          'Registration Successful',
          result.message || 'You are registered!',
          [{text: 'OK', onPress: () => navigation.navigate('Login')}],
        );
      } else {
        if (result.errors) {
          setErrors(prev => ({...prev, ...result.errors}));
          console.log(result,"result")
        }
        Alert.alert(
          'Registration Failed',
          result.message || 'Something went wrong!',
        );
      }
    } catch (error) {
      console.log('===== AXIOS ERROR =====');
      console.log('Message:', error.message);
      console.log('Response:', error.response?.data);

      const backendErrors = error.response?.data?.errors; // ✅ FIXED path
      if (backendErrors) {
        setErrors(prev => ({...prev, ...backendErrors}));
      }

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong!',
      );
    }
  };

  const handleChange = (setter, field) => value => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''})); // Remove error when typing
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
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Image
            source={require('../../../assets/images/gig-logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.header}>Register</Text>

        {/* Name */}
        <Text style={styles.label}>
          Name <Text style={{color: 'red'}}>*</Text>:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={handleChange(setName, 'name')}
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

        {/* Email */}
        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Phone Number */}
        <Text style={styles.label}>
          Phone Number <Text style={{color: 'red'}}>*</Text>:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="+91 1234567890"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handleChange(setPhoneNumber, 'phoneNumber')}
        />
        {errors.phoneNumber ? (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        ) : null}

        {/* User Name */}
        <Text style={styles.label}>
          User Name <Text style={{color: 'red'}}>*</Text>:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={userName}
          onChangeText={handleChange(setUserName, 'userName')}
        />
        {errors.userName ? (
          <Text style={styles.errorText}>{errors.userName}</Text>
        ) : null}

        {/* Password */}
        <Text style={styles.label}>
          Password <Text style={{color: 'red'}}>*</Text>:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="6 - 20 characters"
          secureTextEntry
          value={password}
          onChangeText={handleChange(setPassword, 'password')}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        {/* Confirm Password */}
        <Text style={styles.label}>
          Re-enter Password <Text style={{color: 'red'}}>*</Text>:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={handleChange(setConfirmPassword, 'confirmPassword')}
        />
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}

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

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   ScrollView,
//   SafeAreaView,
//   Image,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import ApiService from '../../../services/ApiService';
// import {useIsFocused} from '@react-navigation/native';
// import styles from './RegisterStyles';
// import { Logo } from '../../../components/Logo';

// export default function RegisterScreen({navigation}) {
//   const [identityType, setIdentityType] = useState('Aadhar Number');
//   const [identityModalVisible, setIdentityModalVisible] = useState(false);
//   const [identityNumber, setIdentityNumber] = useState('');
//   const [identityProof, setIdentityProof] = useState('');
//   const [name, setName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [userName, setUserName] = useState('');
//   const [password, setPassword] = useState('');
//   // const [work, setWork] = useState('');
//   const [experience, setExperience] = useState('');
//   const [skills, setSkills] = useState([{work: '', experience: ''}]);

//   const identityOptions = ['Aadhar Number', 'PAN Number', 'Voter ID'];
//   const isFocused = useIsFocused();

//   const addSkill = () => {
//     setSkills([...skills, {work: '', experience: ''}]);
//   };

//   const updateSkill = (index, field, value) => {
//     const updatedSkills = [...skills];
//     updatedSkills[index][field] = value;
//     setSkills(updatedSkills);
//   };

//   const removeSkill = index => {
//     const updatedSkills = skills.filter((_, i) => i !== index);
//     setSkills(updatedSkills);
//   };

//   const handleRegister = async () => {
//     console.log("check 0")
//     if (!name || !phoneNumber || !email || !password) {
//       Alert.alert('Missing Fields', 'Please fill all required fields.');
//       return;
//     }

//     const payload = {
//       name,
//       phoneNumber,
//       email,
//       password,
//       identityType: identityType.toLowerCase().replace(' ', ''),
//       identityNumber,
//       identityProof,
//       skills: [
//         {
//           work,
//           experience,
//         },
//       ],
//     };

//     console.log("check 1")
//     try {
//       console.log("check 2")
//       const endpoint = 'systemuser/register';
//       const url = `${ApiService.baseURL}/${endpoint}`;
//       console.log('Request URL:', url);
//       const result = await ApiService.post('systemuser/register', payload);

//       if (result.success) {
//         // navigation.navigate('Login')
//         Alert.alert(
//           'Registration Successful',
//           result.message || 'You are registered!',
//           [
//             {
//               text: 'OK',
//               onPress: () => navigation.navigate('Login'),
//             },
//           ],
//         );
//       } else {
//         Alert.alert(
//           'Registration Failed',
//           result.message || 'Something went wrong!',
//         );
//       }
//     } catch (error) {
//       Alert.alert('Error', error?.data?.message || 'Something went wrong!');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Image
//         source={require('../../../assets/images/gig-login-bottom-img.jpg')}
//         style={styles.backgroundImage}
//         resizeMode="cover"
//       />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}>
//           <Icon name="arrow-left" size={28} color="#000" />
//         </TouchableOpacity>

//         {/* Logo + Tagline */}
//         <View style={styles.logoWrapper}>
//           <Image
//             source={require('../../../assets/images/gig-logo1.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </View>

//         {/* <Logo /> */}

//         <Text style={styles.header}>Register</Text>

//         <Text style={styles.label}>Name:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={name}
//           onChangeText={setName}
//         />
//         <Text style={styles.label}>Email :</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="example@gmail.com"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />

//         <Text style={styles.label}>Phone Number :</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="+91 1234567890"
//           keyboardType="phone-pad"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//         />

//         <Text style={styles.label}>User Name :</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="User Name"
//           // keyboardType="email-address"
//           value={userName}
//           onChangeText={setUserName}
//         />

//         <Text style={styles.label}>Password :</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="6 -20 characters"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         {/* <Text style={styles.label}>Identify Proof :</Text>
//         <TouchableOpacity
//           style={styles.dropdownTouchable}
//           onPress={() => setIdentityModalVisible(true)}>
//           <Text style={styles.dropdownText}>{identityType}</Text>
//           <Icon name="chevron-right" size={20} color="#333" />
//         </TouchableOpacity>

//         <Modal visible={identityModalVisible} transparent animationType="fade">
//           <TouchableOpacity
//             style={styles.modalBackground}
//             activeOpacity={1}
//             onPressOut={() => setIdentityModalVisible(false)}>
//             <View style={styles.modalContent}>
//               {identityOptions.map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   onPress={() => {
//                     setIdentityType(option);
//                     setIdentityModalVisible(false);
//                   }}
//                   style={styles.modalItem}>
//                   <Text style={styles.modalText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </TouchableOpacity>
//         </Modal> */}

//         {/* <TextInput
//           style={styles.input}
//           placeholder="9877 6575 9875"
//           value={identityNumber}
//           onChangeText={setIdentityNumber}
//         /> */}

//         {/* <Text style={styles.label}>Fill the Skills</Text>
//         <View style={styles.skillHeader}>
//           <Text style={styles.label}></Text>
//           <TouchableOpacity onPress={addSkill}>
//             <Icon name="plus" size={26} color="#007BFF" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.skillBox}>
//           <TextInput
//             style={styles.input}
//             placeholder="Works"
//             value={work}
//             onChangeText={setWork}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Experience"
//             value={experience}
//             onChangeText={setExperience}
//           />
//           <TouchableOpacity style={styles.removeSkill}>
//             <Icon name="minus" size={24} color="#666" />
//           </TouchableOpacity>
//         </View> */}

//         {/* <View style={styles.skillHeader}>
//           <Text style={styles.label}>Skills:</Text>
//           <TouchableOpacity onPress={addSkill}>
//             <Icon name="plus" size={26} color="#007BFF" />
//           </TouchableOpacity>
//         </View>

//         {skills.map((skill, index) => (
//           <View key={index} style={styles.skillBox}>
//             <TextInput
//               style={styles.input}
//               placeholder="Work"
//               value={skill.work}
//               onChangeText={text => updateSkill(index, 'work', text)}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Experience"
//               value={skill.experience}
//               onChangeText={text => updateSkill(index, 'experience', text)}
//             />
//             {skills.length > 1 && (
//               <TouchableOpacity
//                 style={styles.removeSkill}
//                 onPress={() => removeSkill(index)}>
//                 <Icon name="minus" size={24} color="#666" />
//               </TouchableOpacity>
//             )}
//           </View>
//         ))} */}

//         <Text style={styles.termsText}>
//           I agree to the <Text style={styles.linkText}>Terms of Service</Text>
//         </Text>

//         <TouchableOpacity
//           style={styles.createAccountBtn}
//           onPress={handleRegister}>
//           <Text style={styles.createAccountText}>Create an Account</Text>
//         </TouchableOpacity>

//         <Text style={styles.signInText}>
//           Have an Account?{' '}
//           <Text
//             style={styles.linkText}
//             onPress={() => navigation.navigate('Login')}>
//             Sign in
//           </Text>
//         </Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
