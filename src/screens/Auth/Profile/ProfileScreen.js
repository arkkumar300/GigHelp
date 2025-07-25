import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';

import {Provider as PaperProvider} from 'react-native-paper';

import EditContactModal from '../../../components/EditContactModal';
import EditBankDetailsModal from '../../../components/EditBankDetailsModal';
import EditIdentityProofModal from '../../../components/EditIdentityProofModal';
import EditSkillsModal from '../../../components/EditSkillsModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomTabs from '../../../navigation/BottomsTabs/BottomsTabs';
import styles from './ProfileScreenStyles';
import {loadData} from '../../../Utils/appData';
import ApiService from '../../../services/ApiService';
import getEnvVars from '../../../config/env';
import DocumentPicker from 'react-native-document-picker';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [editable, setEditable] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [identityProof, setIdentityProof] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previousImage, setPreviousImage] = useState(null);

  const [contactEditVisible, setContactEditVisible] = useState(false);
  const [editedContact, setEditedContact] = useState({
    phoneNumber: '',
    email: '',
    address: '',
  });

  const [bankEditVisible, setBankEditVisible] = useState(false);
  const [editedBank, setEditedBank] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [identityEditVisible, setIdentityEditVisible] = useState(false);
  const [skillsEditVisible, setSkillsEditVisible] = useState(false);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    disputeTasks: 0,
    totalBids: 0,
    completedBids: 0,
  });

  console.log(user, 'infffff');

  const {API_BASE_URL} = getEnvVars();
  const IMAGE_URL = `${API_BASE_URL}/images/userdp`;

  const handlePreview = async uri => {
    try {
      const fileName = uri.split('/').pop();
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: uri,
        toFile: destPath,
      }).promise;

      if (result.statusCode !== 200) throw new Error('File download failed');

      await FileViewer.open(destPath, {showOpenWithDialog: true});
    } catch (err) {
      Alert.alert('Error', 'Failed to preview file');
      console.log('File preview error:', err);
    }
  };

  const handleDownload = async uri => {
    try {
      const fileName = uri.split('/').pop();
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: uri,
        toFile: path,
      }).promise;

      if (result.statusCode === 200) {
        Alert.alert('Downloaded!', `File saved to ${path}`);
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to download file');
      console.log(err);
    }
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
      let isActive = true;

      const getUserInfoAndData = async () => {
        try {
          // Step 1: Load user info from storage
          const storedUser = await loadData('userInfo');
          if (!storedUser || !storedUser.userId) return;

          const userId = storedUser.userId;

          // Step 2: Fetch user profile
          const response = await ApiService.get('systemuser/get-user', {
            userId,
          });

          if (!isActive) return;

          setUserId(userId);
          setUser(response.data);
          setIdentityProof(response.data.identityProof || []);
          console.log(
            'identityProof after update:',
            response.data.identityProof,
          );

          // Step 3: Fetch tasks and bids in parallel
          const [taskRes, bidRes] = await Promise.all([
            ApiService.get(`/task/task-summary-by-user?userId=${userId}`),
            ApiService.get(`/Bids/count/${userId}`),
          ]);

          if (!isActive) return;

          const {totalTasks, disputeTasks, completedTasks} =
            taskRes?.data || {};
          const {totalBids, completedBids} = bidRes?.data || {};

          setStats({
            totalTasks: totalTasks || 0,
            completedTasks: completedTasks || 0,
            disputeTasks: disputeTasks || 0,
            totalBids: totalBids || 0,
            completedBids: completedBids || 0,
          });
        } catch (error) {
          console.log('Error fetching profile:', error);
        }
      };

      getUserInfoAndData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleSelectImage = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });

      setLoading(true);
      setSelectedImage(res); // Temporarily show

      const formData = new FormData();
      formData.append('userId', user.userId);
      formData.append('profilePic', {
        uri: res.uri,
        name: res.name,
        type: res.type,
      });

      handleUpdate();

      // const response = await ApiService.patch(
      //   `/systemuser/user-update`,
      //   formData,
      // );

      // console.log(response, 'update profile');
      // const updatedUser = {
      //   ...response.data,
      //   identityProof: Array.isArray(response.data.identityProof)
      //     ? response.data.identityProof
      //     : JSON.parse(response.data.identityProof || '[]'),
      // };

      // setUser(updatedUser);
      // setIdentityProof(updatedUser.identityProof);

      // setUser(response.data);
      // setIdentityProof(response.data.identityProof || []);
      // Toast.show('✅ Profile picture updated!', Toast.SHORT);
    } catch (err) {
      console.log('Upload failed', err);
      setSelectedImage(null); // rollback
      // Toast.show('❌ Failed to update profile picture', Toast.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.entries(user).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          formData.append(key, value);
        }
      });

      if (selectedImage) {
        formData.append('profilePic', {
          uri: selectedImage.uri,
          name: selectedImage.name,
          type: selectedImage.type,
        });
      }

      const response = await ApiService.patch(
        `/systemuser/user-update`,
        formData,
      );

      setUser(response.data);
      Alert.alert('Success', 'Profile updated successfully');
      setEditable(false);
    } catch (error) {
      console.log('Update failed:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: 50}}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Icon name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => setEditable(prev => !prev)}>
              <Icon name="pencil" size={24} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setImageModalVisible(true)}
            disabled={loading}>
            {loading ? (
              <View
                style={[
                  styles.profileImage,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <Text>Uploading...</Text> {/* or use an ActivityIndicator */}
              </View>
            ) : selectedImage?.uri || user?.profilePic ? (
              <Image
                source={{
                  uri: selectedImage?.uri || `${IMAGE_URL}/${user.profilePic}`,
                }}
                style={styles.profileImage}
              />
            ) : (
              <View
                style={[
                  styles.profileImage,
                  {
                    backgroundColor: '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={{fontSize: 32, color: '#fff'}}>
                  {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {editable && (
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
              <Text style={styles.updateText}>Update Profile</Text>
            </TouchableOpacity>
          )}
          <Modal
            isVisible={imageModalVisible}
            onBackdropPress={() => setImageModalVisible(false)}
            style={{justifyContent: 'flex-end', margin: 0}}>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 16,
              }}>
              <Text
                style={{fontWeight: 'bold', fontSize: 16, marginBottom: 12}}>
                Profile Options
              </Text>

              <TouchableOpacity
                style={{paddingVertical: 12}}
                onPress={() => {
                  setImageModalVisible(false);
                }}>
                <Text>View Profile Picture</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{paddingVertical: 12}}
                onPress={() => {
                  setImageModalVisible(false);
                  handleSelectImage(); // Trigger image picker and upload
                }}>
                <Text>Update Profile Picture</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{paddingVertical: 12}}
                onPress={() => setImageModalVisible(false)}>
                <Text style={{color: 'red'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Text style={styles.profileName}>{user?.userName}</Text>
          {/* KYC Status */}
          <View style={styles.kycRow}>
            <Text style={styles.kycText}>KYC</Text>
            <Text style={styles.kycText}>Status</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor:
                  user?.status === 'Pending'
                    ? 'orange'
                    : user?.status === 'Approved'
                    ? 'green'
                    : user?.status === 'Rejected'
                    ? 'red'
                    : 'gray',
              }}>
              <Icon
                name={
                  user?.status === 'Pending'
                    ? 'progress-clock' // Pending icon
                    : user?.status === 'Approved'
                    ? 'check-decagram' // Approved icon
                    : user?.status === 'Rejected'
                    ? 'close-octagon' // Rejected icon
                    : 'help-circle-outline' // Default fallback
                }
                size={20}
                color={
                  user?.status === 'Pending'
                    ? 'orange'
                    : user?.status === 'Approved'
                    ? 'green'
                    : user?.status === 'Rejected'
                    ? 'red'
                    : 'gray'
                }
                style={{marginRight: 6}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color:
                    user?.status === 'Pending'
                      ? 'orange'
                      : user?.status === 'Approved'
                      ? 'green'
                      : user?.status === 'Rejected'
                      ? 'red'
                      : 'gray',
                }}>
                {user?.status === 'Pending' ? 'Verifying' : user?.status}
              </Text>
            </View>
          </View>
          {/* Contact Info */}

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Contact Info</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditedContact({
                    userName: user.userName,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    address: user.address,
                  });

                  setContactEditVisible(true);
                }}>
                <Icon name="pencil" size={18} color="#1D9BFB" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Icon name="account" size={20} color="#3797FF" />
              <Text style={styles.infoText}>{user?.userName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#3797FF" />
              <Text style={styles.infoText}>{user?.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#3797FF" />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="map-marker" size={20} color="#3797FF" />
              <Text style={styles.infoText}>{user?.address}</Text>
            </View>
          </View>

          {/* Bank Details */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Bank Details</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditedBank({
                    accountHolder: user.accountHolder || '',
                    bankName: user.bankName || '',
                    accountNumber: user.accountNumber || '',
                    ifscCode: user.ifscCode || '',
                  });
                  setBankEditVisible(true);
                }}>
                <Icon name="pencil" size={18} color="#1D9BFB" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Icon name="account" size={20} style={{color: '#3797FF'}} />
              <Text>Holder Name: {user?.accountHolder}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="bank" size={20} style={{color: '#3797FF'}} />
              <Text>Bank Name: {user?.bankName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="numeric" size={20} style={{color: '#3797FF'}} />
              <Text>A/C Number: {user?.accountNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="barcode" size={20} style={{color: '#3797FF'}} />
              <Text>IFSC Number: {user?.ifscCode}</Text>
            </View>
          </View>
          {/* Identity Proof */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Identity Proof</Text>

              <TouchableOpacity onPress={() => setIdentityEditVisible(true)}>
                <Icon name="pencil" size={18} color="#1D9BFB" />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 8}}>
              <ScrollView horizontal>
                {(() => {
                  let parsedProofs = [];
                  try {
                    parsedProofs = Array.isArray(identityProof)
                      ? identityProof
                      : typeof identityProof === 'string'
                      ? JSON.parse(identityProof)
                      : [];
                  } catch (e) {
                    console.warn('Invalid identityProof:', identityProof);
                    parsedProofs = [];
                  }

                  return parsedProofs.length > 0 ? (
                    parsedProofs.map((proof, idx) => {
                      const fileName =
                        typeof proof === 'string'
                          ? proof
                          : proof?.name || proof?.uri || '';

                      const ext = fileName.includes('.')
                        ? fileName.split('.').pop().toLowerCase()
                        : '';

                      const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(
                        ext,
                      );

                      const uri =
                        typeof proof === 'string'
                          ? proof.startsWith('http')
                            ? proof
                            : `${IMAGE_URL}/${proof}`
                          : proof?.uri || '';

                      return (
                        <View
                          key={idx}
                          style={{marginRight: 12, alignItems: 'center'}}>
                          {isImage ? (
                            <Image
                              source={{uri}}
                              style={styles.proofImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <TouchableOpacity
                              style={{
                                width: 100,
                                height: 140,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                backgroundColor: '#f4f4f4',
                                padding: 10,
                              }}
                              // onPress={() => handlePreview(uri)}
                            >
                              <Icon
                                name={
                                  ext === 'pdf'
                                    ? 'file-pdf-box'
                                    : ext === 'doc' || ext === 'docx'
                                    ? 'file-word'
                                    : 'file-document-outline'
                                }
                                size={40}
                                color={
                                  ext === 'pdf'
                                    ? 'red'
                                    : ext === 'docx'
                                    ? '#2A5DB0'
                                    : '#1D9BFB'
                                }
                              />
                              <Text
                                numberOfLines={2}
                                style={{
                                  fontSize: 12,
                                  textAlign: 'center',
                                  marginTop: 6,
                                }}>
                                {fileName}
                              </Text>
                            </TouchableOpacity>
                          )}

                          {!isImage && (
                            <TouchableOpacity
                              onPress={() => handleDownload(uri)}
                              style={{marginTop: 6}}>
                              <Icon name="download" size={18} color="#1D9BFB" />
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={{color: '#888', marginTop: 4}}>
                      No identity proof uploaded yet.
                    </Text>
                  );
                })()}
              </ScrollView>
            </View>
          </View>
          {/* Skills */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Skills</Text>
              <TouchableOpacity onPress={() => setSkillsEditVisible(true)}>
                <Icon name="pencil" size={18} color="#1D9BFB" />
              </TouchableOpacity>
            </View>

            {Array.isArray(user.skills) && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text>
                    {skill.name} ({skill.experience})
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{marginTop: 6, color: '#888'}}>
                No skills added yet
              </Text>
            )}
          </View>
          {/* Stats Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Task</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('HomeTabs', {screen: 'My Task'})
                }>
                <Text style={styles.seeMore}>See more →</Text>
              </TouchableOpacity>
            </View>
            <Text>Number of Task: {stats.totalTasks}</Text>
            <Text>Number of Completed: {stats.completedTasks}</Text>
            <Text>Dispute Task: {stats.disputeTasks}</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Bids</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('HomeTabs', {screen: 'My Bids'})
                }>
                <Text style={styles.seeMore}>See more →</Text>
              </TouchableOpacity>
            </View>
            <Text>Number of My Bids: {stats.totalBids}</Text>
            <Text>Number of Completed: {stats.completedBids}</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Achievement</Text>
            </View>
            <Text>Number of My Bids: {stats.totalBids}</Text>
            <Text>Number of Task: {stats.totalTasks}</Text>
          </View>
        </ScrollView>

        <EditContactModal
          visible={contactEditVisible}
          onDismiss={() => setContactEditVisible(false)}
          user={user}
          editedContact={editedContact}
          setEditedContact={setEditedContact}
          onUpdate={updatedUser => setUser(updatedUser)}
        />

        <EditBankDetailsModal
          visible={bankEditVisible}
          onDismiss={() => setBankEditVisible(false)}
          user={user}
          editedBank={editedBank}
          setEditedBank={setEditedBank}
          onUpdate={updatedUser => setUser(updatedUser)}
        />

        <EditIdentityProofModal
          visible={identityEditVisible}
          onDismiss={() => setIdentityEditVisible(false)}
          user={user}
          identityProof={identityProof || '[]'}
          setIdentityProof={setIdentityProof}
          onUpdate={updatedUser => setUser(updatedUser)}
          IMAGE_URL={IMAGE_URL}
        />

        <EditSkillsModal
          visible={skillsEditVisible}
          onDismiss={() => setSkillsEditVisible(false)}
          user={user}
          onUpdate={updated => setUser(updated)}
        />

        {/* Bottom Navigation */}
        {/* <View style={styles.bottomNav}>
          <BottomTabs />
        </View> */}
      </SafeAreaView>
    </PaperProvider>
  );
};

export default ProfileScreen;
