import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  Image,
  StyleSheet,
} from 'react-native';
import {
  TextInput,
  Button,
  Portal,
  Modal,
  Title,
  useTheme,
} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import ApiService from '../../../services/ApiService';
import {loadData} from '../../../Utils/appData';
import FileViewer from 'react-native-file-viewer';

import DocumentPicker from 'react-native-document-picker';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddTaskScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [inputHeight, setInputHeight] = useState(120);

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [openPostedIn, setOpenPostedIn] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [showVerifyKYCModal, setShowVerifyKYCModal] = useState(false);
  const [showWarningKYCModal, setShowWarningKYCModal] = useState(false);

  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);

  const [categoryName, setCategoryName] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [postedIn, setPostedIn] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  // Reset form
  const resetForm = () => {
    setCategory(null);
    setSubCategory(null);
    setCategoryName('');
    setFrom('');
    setTo('');
    setPostedIn('');
    setEndDate('');
    setAmount('');
    setPhoneNumber('');
    setDescription('');
    setFiles([]);
  };

  const getTokenAndUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await loadData('userInfo');
    return {token, userData};
  };

  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     const storedUser = await loadData('userInfo');
  //     if (storedUser) {
  //       setUserId(storedUser.userId);
  //     }
  //   };
  //   getUserInfo();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      const getUserInfo = async () => {
        const storedUser = await loadData('userInfo');
        if (storedUser) {
          setUserId(storedUser.userId);
        }
      };
      getUserInfo();
    }, []),
  );

  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchData = async () => {
  //     try {
  //       const response = await ApiService.get('systemuser/get-user', {
  //         userId,
  //       });
  //       console.log(response, 'userrrrr');

  //       setUser(response.data);
  //     } catch (error) {
  //       console.log('Error fetching profile:', error);
  //     }
  //   };

  //   fetchData();
  // }, [userId]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await ApiService.get(
  //         '/categories/get-all',
  //       );
  //       console.log(res, 'response');
  //       const formatted = res.data.map(item => ({
  //         label: item.categoryName,
  //         value: item.categoryId,
  //       }));
  //       setCategoryList(formatted);
  //       console.log(formatted, 'forrrrrrr');
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  // useEffect(() => {
  //   const fetchSubCategories = async () => {
  //     if (!category) return;
  //     try {
  //       // const {token} = await getTokenAndUser();
  //       const res = await ApiService.get(
  //         `/subcategories/get-all-categoryId?categoryId=${category}`,
  //         //   {
  //         //     headers: {Authorization: `Bearer ${token}`},
  //         //   },
  //       );
  //       const formatted = res.data.map(item => ({
  //         label: item.SubCategoryName,
  //         value: item.SubCategoryId,
  //       }));
  //       setSubCategoryList(formatted);

  //       console.log(formatted, 'sub category');

  //       const selected = categoryList.find(cat => cat.value === category);
  //       setCategoryName(selected?.label || '');

  //       if (selected?.label?.toLowerCase() === 'transport') {
  //         setFrom('Default From Location');
  //         setTo('Default To Location');
  //       } else {
  //         setFrom('');
  //         setTo('');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching subcategories:', error);
  //     }
  //   };
  //   fetchSubCategories();
  // }, [category]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      const fetchData = async () => {
        try {
          const response = await ApiService.get('systemuser/get-user', {
            userId,
          });
          console.log(response, 'userrrrr');
          setUser(response.data);
        } catch (error) {
          console.log('Error fetching profile:', error);
        }
      };

      fetchData();
    }, [userId]),
  );

  // 2. Fetch categories
  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
        try {
          const res = await ApiService.get('/categories/get-all');
          console.log(res, 'response');
          const formatted = res.data.map(item => ({
            label: item.categoryName,
            value: item.categoryId,
          }));
          setCategoryList(formatted);
          console.log(formatted, 'forrrrrrr');
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      fetchCategories();
    }, []),
  );

  // 3. Fetch subcategories when category changes (keep useEffect here — it depends on state)
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!category) return;
      try {
        const res = await ApiService.get(
          `/subcategories/get-all-categoryId?categoryId=${category}`,
        );
        const formatted = res.data.map(item => ({
          label: item.SubCategoryName,
          value: item.SubCategoryId,
        }));
        setSubCategoryList(formatted);

        console.log(formatted, 'sub category');

        const selected = categoryList.find(cat => cat.value === category);
        setCategoryName(selected?.label || '');

        if (selected?.label?.toLowerCase() === 'transport') {
          setFrom('Default From Location');
          setTo('Default To Location');
        } else {
          setFrom('');
          setTo('');
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubCategories();
  }, [category]);

  const handleFilePick = async () => {
    console.log('check1');
    try {
      console.log('check2');
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      console.log(results, 'documents results');

      const formatted = results.map(file => ({
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        name: file.name || `file-${Date.now()}`,
        type: file.type || 'application/octet-stream',
      }));

      setFiles(prev => [...prev, ...formatted]);
      console.log('Selected files:', formatted);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled picker');
      } else {
        console.error('File pick error:', err);
        Alert.alert('Error', 'File selection failed.');
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !category ||
      !subCategory
      //  ||
      // !postedIn ||
      // !endDate ||
      // !amount ||
      // !phoneNumber ||
      // !description
      //   ||
      //   files.length === 0
    ) {
      Alert.alert('Validation Error', 'Please fill category and sub category fields.');
      return;
    }

    if (categoryName.toLowerCase() === 'transport' && (!from || !to)) {
      Alert.alert(
        'Validation Error',
        'Please fill both "From" and "To" fields for Transport.',
      );
      return;
    }

    try {
      const {token, userData} = await getTokenAndUser();
      if (!userData?.userId) {
        Alert.alert('Error', 'Token or user data missing');
        return;
      }

      const categoryObj = categoryList.find(c => c.value === category);
      const subCategoryObj = subCategoryList.find(s => s.value === subCategory);
      const today = new Date().toISOString().split('T')[0];

      const formData = new FormData();
      formData.append('task', categoryObj?.label || '');
      formData.append('Categories', categoryObj?.label || '');
      formData.append('SubCategory', subCategoryObj?.label || '');
      // formData.append('targetedPostIn', postedIn);
      formData.append('targetedPostIn', today);
      formData.append('endData', endDate);
      formData.append('amount', amount);
      formData.append('phoneNumber', phoneNumber);
      formData.append('description', description);
      formData.append('from', from);
      formData.append('to', to);
      formData.append('taskUserId', userData.userId);
      formData.append('userId', userData.userId);
      formData.append('status', 'pending');

      files.forEach((file, idx) => {
        formData.append('document', {
          uri: file.uri,
          name: file.name || `file-${idx}`,
          type: file.type || 'application/octet-stream',
        });
      });

      files.forEach((file, idx) => {
        console.log(`file[${idx}]`, file);
      });

      console.log(formData, 'form data of add task');

      const response = await ApiService.post('/task/create', formData);
      console.log(response, 'responsive');

      if (response?.success) {
        Alert.alert('Success', response.message);
        resetForm();
      } else {
        Alert.alert('Failed', response.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'An error occurred while creating the task');
    }
  };

  const getFileIcon = fileName => {
    const ext = fileName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'file-pdf-box';
    if (['doc', 'docx'].includes(ext)) return 'file-word-box';
    if (['xls', 'xlsx'].includes(ext)) return 'file-excel-box';
    if (['ppt', 'pptx'].includes(ext)) return 'file-powerpoint-box';
    if (['mp4', 'mov'].includes(ext)) return 'file-video';
    if (['mp3'].includes(ext)) return 'file-music';

    return 'file';
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{padding: 20}}>
      <Title style={{marginBottom: 20, textAlign: 'center'}}>Add Task</Title>

      <DropDownPicker
        open={openCategory}
        value={category}
        items={categoryList}
        setOpen={setOpenCategory}
        setValue={setCategory}
        setItems={setCategoryList}
        placeholder="Select Category"
        zIndex={3000}
        style={{marginBottom: 10}}
        dropDownDirection="AUTO"
        listMode="SCROLLVIEW"
      />

      <DropDownPicker
        open={openSubCategory}
        value={subCategory}
        items={subCategoryList}
        setOpen={setOpenSubCategory}
        setValue={setSubCategory}
        setItems={setSubCategoryList}
        placeholder="Select Sub Category"
        zIndex={2000}
        disabled={!category}
        style={{marginBottom: 10}}
        dropDownDirection="AUTO"
        listMode="SCROLLVIEW"
      />

      {categoryName.toLowerCase() === 'transport' && (
        <>
          <TextInput
            label="From"
            value={from}
            onChangeText={setFrom}
            mode="outlined"
            style={{marginBottom: 10}}
          />
          <TextInput
            label="To"
            value={to}
            onChangeText={setTo}
            mode="outlined"
            style={{marginBottom: 10}}
          />
        </>
      )}

      {/* Posted In Date Picker */}
      {/* <TouchableOpacity onPress={() => setOpenPostedIn(true)}>
        <TextInput
          label="Posted In"
          value={postedIn}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          editable={false}
          pointerEvents="none"
          style={{marginBottom: 10}}
        />
      </TouchableOpacity> */}

      {/* End Date Picker */}
      <TouchableOpacity onPress={() => setOpenEndDate(true)}>
        <TextInput
          label="Target Date"
          value={endDate}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          editable={false}
          pointerEvents="none"
          style={{marginBottom: 10}}
        />
      </TouchableOpacity>

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={{marginBottom: 10}}
      />

      {/* <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        mode="outlined"
        keyboardType="phone-pad"
        style={{marginBottom: 10}}
      /> */}

      {/* <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={5}
        style={{marginBottom: 10}}
      /> */}

      <View style={{marginBottom: 10}}>
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={{
            minHeight: 120,
            maxHeight: 200,
            textAlignVertical: 'top',
          }}
          onContentSizeChange={event => {
            setInputHeight(event.nativeEvent.contentSize.height + 20);
          }}
        />
      </View>

      <TouchableOpacity
        onPress={handleFilePick}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <MaterialCommunityIcons name="file-upload" size={24} />
        <Text style={{marginTop: 5}}>Upload Files</Text>
        <Text style={{fontSize: 12, color: '#666'}}>
          {files.length > 0
            ? `${files.length} file(s) selected`
            : 'No files selected'}
        </Text>
      </TouchableOpacity>

      {files.length > 0 && (
        <View style={{marginBottom: 10}}>
          <Text style={{fontWeight: 'bold', marginBottom: 5}}>
            Selected Documents:
          </Text>

          {files.map((file, index) => {
            const isImage =
              file.type?.includes('image') ||
              ['jpg', 'jpeg', 'png', 'gif'].includes(
                file.name.split('.').pop().toLowerCase(),
              );

            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                }}>
                {/* File Type Icon */}
                <MaterialCommunityIcons
                  name={getFileIcon(file.name)}
                  size={22}
                  color="#1D9BFB"
                  style={{marginRight: 8}}
                />

                {/* Image Thumbnail or Text */}
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => {
                    if (file.uri) {
                      FileViewer.open(file.uri)
                        .then(() => console.log('File opened successfully'))
                        .catch(error => {
                          console.error('File open error', error);
                          Alert.alert('Error', 'Unable to open file');
                        });
                    }
                  }}>
                  {isImage ? (
                    <Image
                      source={{uri: file.uri}}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 4,
                        resizeMode: 'cover',
                      }}
                    />
                  ) : (
                    <Text style={{color: '#1D9BFB'}}>{file.name}</Text>
                  )}
                </TouchableOpacity>

                {/* Delete Icon */}
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...files];
                    updated.splice(index, 1);
                    setFiles(updated);
                  }}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={22}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      <Button
        mode="contained"
        onPress={() => {
          if (user.status === 'Pending') {
            setShowVerifyKYCModal(true);
          } else if (user.sttus === 'Rejected') {
            setShowWarningKYCModal(true);
          } else {
            handleSubmit();
          }``
        }}
        // onPress={handleSubmit}
        style={{
          marginTop: 20,
          paddingVertical: 5,
          backgroundColor: '#3797FF',
          fontSize: 20,
          // width: 150,
          // height: 60,
        }}
        contentStyle={{height: 44}}
        labelStyle={{fontSize: 20}}>
        Submit
      </Button>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={openPostedIn}
        date={tempDate}
        mode="date"
        onConfirm={date => {
          setOpenPostedIn(false);
          setTempDate(date);
          setPostedIn(date.toISOString().split('T')[0]);
        }}
        onCancel={() => setOpenPostedIn(false)}
      />

      <DatePicker
        modal
        open={openEndDate}
        date={tempDate}
        mode="date"
        onConfirm={date => {
          setOpenEndDate(false);
          setTempDate(date);
          setEndDate(date.toISOString().split('T')[0]);
        }}
        onCancel={() => setOpenEndDate(false)}
      />

      <Portal>
        <Modal
          visible={showVerifyKYCModal}
          onDismiss={() => setShowVerifyKYCModal(false)}
          contentContainerStyle={styles.kycModalContainer}>
          <View style={styles.kycHeader}>
            <Image
              source={require('../../../assets/images/verify-icon.png')} // 👈 Put your image in assets folder
              style={styles.kycIcon}
              resizeMode="contain"
            />
            <Text style={styles.kycHeaderText}>Verifying</Text>
          </View>

          <View style={styles.kycBody}>
            <Text style={styles.kycStatus}>KYC Verifying</Text>
            <Text style={styles.kycTitle}>You can't add task.</Text>

            <TouchableOpacity
              style={styles.kycButton}
              onPress={() => {
                setShowVerifyKYCModal(false);
                navigation.navigate('Profile');
              }}>
              <Text style={styles.kycButtonText}>For More</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={showWarningKYCModal}
          onDismiss={() => setShowWarningKYCModal(false)}
          contentContainerStyle={styles.warningKycModalContainer}>
          <View style={styles.warningKycHeader}>
            <Image
              source={require('../../../assets/images/danger-icon.png')} // Replace with your warning icon
              style={styles.warningKycIcon}
              resizeMode="contain"
            />
            <Text style={styles.warningKycHeaderText}>Whoops</Text>
          </View>

          <View style={styles.warningKycBody}>
            <Text style={styles.warningKycTitle}>KYC Rejected</Text>
            <Text style={styles.warningKycStatus}>You can't add task.</Text>

            <TouchableOpacity
              style={styles.warningKycButton}
              onPress={() => {
                setShowWarningKYCModal(false);
                navigation.navigate('Profile');
              }}>
              <Text style={styles.warningKycButtonText}>For More</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      {/* <Portal>
        <Modal
          visible={showKYCModal}
          onDismiss={() => setShowKYCModal(false)}
          contentContainerStyle={styles.kycModalContainer}>
          {user.status === 'Pending' && (
            <>
              <View style={[styles.kycHeader, {backgroundColor: '#FFC107'}]}>
                <Image
                  source={require('../../../assets/images/verify-icon.png')}
                  style={styles.kycIcon}
                  resizeMode="contain"
                />
                <Text style={styles.kycHeaderText}>Verifying</Text>
              </View>

              <View style={styles.kycBody}>
                <Text style={styles.kycTitle}>Your Account</Text>
                <Text style={styles.kycStatus}>Verifying</Text>

                <TouchableOpacity
                  style={styles.kycButton}
                  onPress={() => {
                    setShowKYCModal(false);
                    navigation.navigate('Profile');
                  }}>
                  <Text style={styles.kycButtonText}>For More</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {user.status === 'Rejected' && (
            <>
              <View style={[styles.kycHeader, {backgroundColor: '#f44336'}]}>
                <Image
                  source={require('../../../assets/images/danger-icon.png')}
                  style={styles.kycIcon}
                  resizeMode="contain"
                />
                <Text style={styles.kycHeaderText}>Whoops</Text>
              </View>

              <View style={styles.kycBody}>
                <Text style={styles.kycTitle}>KYC</Text>
                <Text style={styles.kycStatus}>
                  Under Process. You can't add task.
                </Text>

                <TouchableOpacity
                  style={styles.kycButton}
                  onPress={() => {
                    setShowKYCModal(false);
                    navigation.navigate('Profile');
                  }}>
                  <Text style={styles.kycButtonText}>For More</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Modal>
      </Portal> */}
    </KeyboardAwareScrollView>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  kycModalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 30,
    overflow: 'hidden',
  },
  kycHeader: {
    backgroundColor: '#FFC107',
    paddingVertical: 20,
    alignItems: 'center',
  },
  kycIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  kycHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  kycBody: {
    padding: 20,
    alignItems: 'center',
  },
  kycTitle: {
    fontSize: 16,
    color: '#444',
  },
  kycStatus: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  kycButton: {
    marginTop: 20,
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  kycButtonText: {
    fontSize: 16,
    color: '#333',
  },
  warningKycModalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 30,
    overflow: 'hidden',
  },
  warningKycHeader: {
    backgroundColor: '#f44336', // red
    alignItems: 'center',
    paddingVertical: 20,
  },
  warningKycIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  warningKycHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  warningKycBody: {
    alignItems: 'center',
    padding: 20,
  },
  warningKycTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningKycStatus: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  warningKycButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  warningKycButtonText: {
    color: '#444',
    fontWeight: 'bold',
  },
});
