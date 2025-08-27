import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal'; // Replace react-native-paper
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../services/ApiService'; // Adjust path if needed

const EditSkillsModal = ({visible, onDismiss, user, onUpdate}) => {
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(user, ' list');

  console.log(skillsList, 'skills list');

  useEffect(() => {
    if (visible) {
      try {
        let parsedSkills = [];
        if (typeof user?.skills === 'string') {
          parsedSkills = JSON.parse(user.skills);
        } else if (Array.isArray(user?.skills)) {
          parsedSkills = user.skills;
        }

        if (Array.isArray(parsedSkills) && parsedSkills.length > 0) {
          setSkillsList(parsedSkills);
        } else {
          setSkillsList([{work: '', experience: ''}]);
        }
      } catch (error) {
        console.error('Failed to parse skills:', error);
        setSkillsList([{work: '', experience: ''}]);
      }
    }
  }, [visible, user]);

  const handleAddSkill = () => {
    setSkillsList(prev => [...prev, {work: '', experience: ''}]);
  };

  const handleDeleteSkill = index => {
    const updated = [...skillsList];
    updated.splice(index, 1);
    setSkillsList(updated.length ? updated : [{work: '', experience: ''}]);
  };

  const handleChange = (index, key, value) => {
    const updated = [...skillsList];
    updated[index][key] = value;
    setSkillsList(updated);
  };

  const handleUpdateSkills = async () => {
    try {
      setLoading(true);
      const updatedUser = {
        skills: skillsList,
      };

      const formData = new FormData();
      Object.entries(updatedUser).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          formData.append(key, value);
        }
      });

      formData.append('userId', user?.userId);
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
    } finally {
      setLoading(false);
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
          maxHeight: '90%',
        }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
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
        <ScrollView style={{maxHeight: 400}}>
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
              }}>
              {/* Skill Name */}
              <TextInput
                placeholder="Works"
                value={skill.work}
                onChangeText={text => handleChange(index, 'work', text)}
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
                onChangeText={text => handleChange(index, 'experience', text)}
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
                onPress={() => handleDeleteSkill(index)}>
                <Icon name="minus" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleUpdateSkills}
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
          onPress={handleUpdateSkills}
          style={{
            backgroundColor: '#1D9BFB',
            paddingVertical: 10,
            borderRadius: 6,
            marginTop: 10,
          }}>
          <Text style={{color: '#fff', textAlign: 'center'}}>Submit</Text>
        </TouchableOpacity> */}
        {/* {loading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
            }}>
            <ActivityIndicator size="large" color="#1D9BFB" />
          </View>
        )} */}
      </View>
    </Modal>
  );
};

export default EditSkillsModal;
