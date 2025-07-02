import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {TextInput, Button, Title, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import ApiService from '../../../services/ApiService';
import {loadData} from '../../../Utils/appData';
// import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddTaskScreen = () => {
  const theme = useTheme();

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [openPostedIn, setOpenPostedIn] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const {token} = await getTokenAndUser();
        const res = await ApiService.get(
          '/categories/get-all',
          //   {
          //     headers: {Authorization: `Bearer ${token}`},
          //   },
        );
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
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!category) return;
      try {
        // const {token} = await getTokenAndUser();
        const res = await ApiService.get(
          `/subcategories/get-all-categoryId?categoryId=${category}`,
          //   {
          //     headers: {Authorization: `Bearer ${token}`},
          //   },
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

  // const handleFilePick = async () => {
  //   try {
  //     const results = await DocumentPicker.pickMultiple({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     setFiles(results);
  //   } catch (err) {
  //     if (!DocumentPicker.isCancel(err)) {
  //       console.error(err);
  //     }
  //   }
  // };

  const handleFilePick = () => {
    const options = {
      mediaType: 'mixed',
      selectionLimit: 0,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const selectedFiles = response.assets.map(asset => ({
          uri:
            Platform.OS === 'ios'
              ? asset.uri.replace('file://', '')
              : asset.uri,
          name: asset.fileName || `file-${Date.now()}`,
          type: asset.type || 'application/octet-stream',
        }));
        setFiles(selectedFiles);
        console.log('Files selected:', selectedFiles);
      }
    });
  };

  const handleSubmit = async () => {
    if (
      !category ||
      !subCategory ||
      !postedIn ||
      !endDate ||
      !amount ||
      !phoneNumber ||
      !description
      //   ||
      //   files.length === 0
    ) {
      Alert.alert('Validation Error', 'Please fill all the required fields.');
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

      const formData = new FormData();
      formData.append('task', categoryObj?.label || '');
      formData.append('Categories', categoryObj?.label || '');
      formData.append('SubCategory', subCategoryObj?.label || '');
      formData.append('targetedPostIn', postedIn);
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
      <TouchableOpacity onPress={() => setOpenPostedIn(true)}>
        <TextInput
          label="Posted In"
          value={postedIn}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          editable={false}
          pointerEvents="none"
          style={{marginBottom: 10}}
        />
      </TouchableOpacity>

      {/* End Date Picker */}
      <TouchableOpacity onPress={() => setOpenEndDate(true)}>
        <TextInput
          label="End Date"
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

      <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        mode="outlined"
        keyboardType="phone-pad"
        style={{marginBottom: 10}}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={5}
        style={{marginBottom: 10}}
      />

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

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{marginTop: 20, paddingVertical: 5}}
        contentStyle={{height: 50}}
        labelStyle={{fontSize: 18}}>
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
    </KeyboardAwareScrollView>
  );
};

export default AddTaskScreen;
