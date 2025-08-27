import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator, // ⬅️ Import spinner
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
  const [loading, setLoading] = useState(false); // ⬅️ Track loading state

  const handleSubmit = async () => {
    try {
      setLoading(true); // ⬅️ Start loading
      const payload = { ...editedContact };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          formData.append(key, value);
        }
      });
      formData.append('userId', user?.userId);

      const response = await ApiService.patch(`/systemuser/user-update`, formData);
      onUpdate(response.data);
      Alert.alert('Success', 'Contact info updated');
      onDismiss();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to update contact info');
    } finally {
      setLoading(false); // ⬅️ Stop loading
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
          { label: 'Name', icon: 'account', field: 'userName' },
          { label: 'Phone Number', icon: 'phone', field: 'phoneNumber' },
          { label: 'Email', icon: 'email', field: 'email' },
          { label: 'Location', icon: 'map-marker', field: 'address' },
        ].map(({ label, icon, field }) => (
          <View key={field} style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Icon name={icon} size={20} color="#3797FF" />
              <Text style={styles.label}>{label}</Text>
            </View>
            <TextInput
              value={editedContact[field]}
              onChangeText={text =>
                setEditedContact(prev => ({ ...prev, [field]: text }))
              }
              style={styles.input}
              placeholder={`Enter ${label}`}
              placeholderTextColor="#999"
            />
          </View>
        ))}
        
        <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#A9A9A9' : '#1D9BFB',
                      paddingVertical: 10,
                      borderRadius: 6,
                      marginTop: 16,
                      opacity: loading ? 0.6 : 1, 
                    }}>
                    {loading ? (
                      <ActivityIndicator size="large" color="#1D9BFB" />
                    ) : (
                      <Text style={{color: '#fff', textAlign: 'center'}}>Update</Text>
                    )}
                  </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity> */}
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
