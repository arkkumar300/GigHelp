import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal'; // Replace react-native-paper
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../services/ApiService'; // Adjust path if needed

const EditSkillsModal = ({ visible, onDismiss, user, onUpdate }) => {
  const [skillsList, setSkillsList] = useState([]);

  useEffect(() => {
    if (visible) {
      if (Array.isArray(user?.skills) && user.skills.length > 0) {
        setSkillsList(user.skills);
      } else {
        setSkillsList([{ name: '', experience: '' }]);
      }
    }
  }, [visible, user]);

  const handleAddSkill = () => {
    setSkillsList(prev => [...prev, { name: '', experience: '' }]);
  };

  const handleDeleteSkill = index => {
    const updated = [...skillsList];
    updated.splice(index, 1);
    setSkillsList(updated.length ? updated : [{ name: '', experience: '' }]);
  };

  const handleChange = (index, key, value) => {
    const updated = [...skillsList];
    updated[index][key] = value;
    setSkillsList(updated);
  };

  const handleUpdateSkills = async () => {
    try {
      const updatedUser = {
        ...user,
        skills: skillsList,
      };

      const formData = new FormData();
      Object.entries(updatedUser).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          formData.append(key, value);
        }
      });

      formData.append('skills', JSON.stringify(skillsList));

      const response = await ApiService.patch(
        `/systemuser/user-update`,
        formData,
        // { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      onUpdate(response.data);
      Alert.alert('Success', 'Skills updated');
      onDismiss();
    } catch (err) {
      console.error('Failed to update skills:', err);
      Alert.alert('Error', 'Failed to update skills');
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onDismiss}
      onBackButtonPress={onDismiss}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          maxHeight: '90%',
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            Fill the Skills
          </Text>
          <TouchableOpacity onPress={handleAddSkill}>
            <Icon
              name="plus"
              size={22}
              color="#1D9BFB"
              style={{
                backgroundColor: '#E6F0FF',
                padding: 6,
                borderRadius: 6,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Skills List */}
        <ScrollView style={{ maxHeight: 400 }}>
          {skillsList.map((skill, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#f8f8f8',
                padding: 12,
                borderRadius: 12,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              {/* Skill Name */}
              <TextInput
                placeholder="Works"
                value={skill.name}
                onChangeText={(text) => handleChange(index, 'name', text)}
                style={{
                  backgroundColor: '#ddd',
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              />

              {/* Experience */}
              <TextInput
                placeholder="Experience"
                value={skill.experience}
                onChangeText={(text) =>
                  handleChange(index, 'experience', text)
                }
                style={{
                  backgroundColor: '#ddd',
                  padding: 10,
                  borderRadius: 6,
                }}
              />

              {/* Remove Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  alignSelf: 'flex-end',
                  padding: 6,
                  borderRadius: 6,
                  marginTop: 10,
                }}
                onPress={() => handleDeleteSkill(index)}
              >
                <Icon name="minus" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleUpdateSkills}
          style={{
            backgroundColor: '#1D9BFB',
            paddingVertical: 10,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EditSkillsModal;
