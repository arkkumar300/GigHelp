import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../services/ApiService';

const EditContactModal = ({
  visible,
  onDismiss,
  user,
  editedContact,
  setEditedContact,
  onUpdate,
}) => {
  const handleSubmit = async () => {
    try {
      const payload = {
        ...user,
        ...editedContact,
      };

      console.log(payload,"contact payload")

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await ApiService.patch(
        `/systemuser/user-update`,
        formData,
        // {headers: {'Content-Type': 'multipart/form-data'}},
      );

      console.log(response,"update contact")

      onUpdate(response.data);
      Alert.alert('Success', 'Contact info updated');
      onDismiss();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to update contact info');
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onDismiss}
      onBackButtonPress={onDismiss}
      swipeDirection="down"
      onSwipeComplete={onDismiss}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
          <Icon name="close" size={20} />
        </TouchableOpacity>

        {[
          {label: 'Name', icon: 'account', field: 'userName'},
          {label: 'Phone Number', icon: 'phone', field: 'phoneNumber'},
          {label: 'Email', icon: 'email', field: 'email'},
          {label: 'Location', icon: 'map-marker', field: 'address'},
        ].map(({label, icon, field}) => (
          <View key={field} style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Icon name={icon} size={20} color="#3797FF" />
              <Text style={styles.label}>{label}</Text>
            </View>
            <TextInput
              value={editedContact[field]}
              onChangeText={text =>
                setEditedContact(prev => ({...prev, [field]: text}))
              }
              style={styles.input}
              placeholder={`Enter ${label}`}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    marginLeft: 8,
    color: '#3797FF',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
  },
  submitBtn: {
    backgroundColor: '#3797FF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default EditContactModal;
