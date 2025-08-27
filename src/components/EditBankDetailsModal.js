import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../services/ApiService';
import {cleanString} from '../Utils/cleanString';

const EditBankDetailsModal = ({
  visible,
  onDismiss,
  user,
  editedBank,
  setEditedBank,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false); // 🔹 1. loading state

  const handleSubmit = async () => {
    setLoading(true); // 🔹 2. Start loading
    try {
      const updatedUser = {...editedBank};
      const formData = new FormData();

      Object.entries(updatedUser).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          if (
            ['accountHolder', 'accountNumber', 'bankName', 'ifscCode'].includes(
              key,
            )
          ) {
            formData.append(key, cleanString(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      formData.append('userId', user?.userId);

      const response = await ApiService.patch(`/systemuser/user-update`, formData);

      onUpdate(response.data);
      Alert.alert('Success', 'Bank details updated');
      onDismiss();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update bank details');
    } finally {
      setLoading(false); // 🔹 3. Stop loading
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onDismiss}
      onBackButtonPress={onDismiss}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}>
        <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onDismiss}>
          <Icon name="close" size={20} />
        </TouchableOpacity>

        {[
          {label: 'Holder Name :', icon: 'account', field: 'accountHolder'},
          {label: 'Bank Name :', icon: 'bank', field: 'bankName'},
          {label: 'A/c Number :', icon: 'numeric', field: 'accountNumber'},
          {label: 'IFSC Number :', icon: 'map-marker', field: 'ifscCode'},
        ].map(({label, icon, field}) => (
          <View key={field} style={{marginBottom: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Icon name={icon} size={20} color="#1D9BFB" />
              <Text style={{color: '#1D9BFB'}}>{label}</Text>
            </View>
            <TextInput
              value={cleanString(editedBank[field])}
              onChangeText={text =>
                setEditedBank(prev => ({...prev, [field]: text}))
              }
              editable={!loading} // 🔹 disable input while loading
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                paddingVertical: 4,
                marginTop: 4,
              }}
            />
          </View>
        ))}

        {loading ? ( 
          <ActivityIndicator
            size="small"
            color="#1D9BFB"
            style={{marginTop: 10}}
          />
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#1D9BFB',
              paddingVertical: 10,
              borderRadius: 6,
              marginTop: 10,
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default EditBankDetailsModal;
