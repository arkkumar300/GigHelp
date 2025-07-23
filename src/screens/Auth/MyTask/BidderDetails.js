import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Text,
  TextInput,
  Divider,
} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';
// import { launchImageLibrary } from 'react-native-image-picker';

import ImagePicker from 'react-native-image-picker';
import AssignTaskChatBoard from '../ChatBoard/AssignTaskChartBoard';
import ApiService from '../../../services/ApiService';
import getEnvVars from '../../../config/env';
import styles from './BidderDetailsStyle';

const CandidateCard = ({bidder, task}) => {
  const navigation = useNavigation();
  console.log(bidder, 'bidder detailsss');
  const [userId, setUserId] = useState(null);
  const [assignedName, setAssignedName] = useState('');
  const [messages, setMessages] = useState([
    {from: 'user', text: 'Hi, are you available for a project?'},
    {from: 'Alexandra', text: 'Yes, I am interested!'},
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const {API_BASE_URL} = getEnvVars();
  const IMAGE_URL = `${API_BASE_URL}/images/userdp`;

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(user);
      setUserId(parsed?.userId);
    })();
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {from: 'user', text: newMessage}]);
      setNewMessage('');
    }
  };

  const handleRedirection = () => {
    setOpenSuccessModal(false);
    navigation.navigate('AssignTask', {
      task, // ✅ passing the whole task object
    });
  };

  const handleTransferPayment = async () => {
    console.log('check1');
    if (!assignedName || !bidder || !bidder.bidDetails) {
      console.warn('Missing required fields');
      return;
    }

    try {
      const response = await ApiService.post('transections/create', {
        name: assignedName,
        amount: bidder.bidDetails.bidOfAmount,
        taskOwner: userId,
        userId: userId,
        taskUser: bidder.bidDetails.userId,
        categoryName: bidder.bidDetails.Categories,
      });

      console.log(response, 'payment');

      if (response.success === true || response.status === 201) {
        await ApiService.patch('task/update-task', {
          taskId: Number(bidder.bidDetails.taskId),
          status: 'running',
          assignedBidderId: bidder.bidderId
        });

        setOpenTransferModal(false);
        setOpenSuccessModal(true);
      }
    } catch (err) {
      console.error('Transfer Error:', err.response?.data || err.message);
    }
  };

  return (
    <ScrollView>
      <Card style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              {bidder?.profilePic ? (
                <Avatar.Image
                  size={64}
                  source={{
                    uri: `${IMAGE_URL}/${bidder.profilePic}`,
                  }}
                />
              ) : (
                <Avatar.Text
                  size={64}
                  label={bidder?.userName?.charAt(0)?.toUpperCase() || '?'}
                />
              )}
              <View style={{marginLeft: 12}}>
                <Text style={styles.userName}>{bidder?.userName}</Text>
                <Text style={styles.userExp}>
                  Experience : {bidder?.experiance} Yrs
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={() => setOpenAssignModal(true)}
              style={styles.approveButton}
              labelStyle={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>
              Approve Bid
            </Button>
          </View>

          <View style={styles.skillsContainer}>
            {bidder?.skills?.map((item, index) => (
              <View style={styles.skillRow} key={index}>
                <View style={styles.skillCol}>
                  <Text style={styles.skillText}>Skill : {item.work}</Text>
                  <View style={styles.skillUnderline} />
                </View>
                <View style={styles.skillCol}>
                  <Text style={styles.skillText}>
                    Experience : {item.experience} years
                  </Text>
                  <View style={styles.skillUnderline} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <Divider style={{marginVertical: 10}} />

        <Text style={styles.chatTitle}>Chat Board Bidder</Text>
        {/* <Card style={styles.card}>
          <Card.Title title="Chat" />
          <Card.Content>
            <AssignTaskChatBoard task={bidder} />
          </Card.Content>
        </Card> */}
        <View style={{height: '60%'}}>
          <AssignTaskChatBoard task={bidder} />
        </View>

        {/* Assign Modal */}
        <Modal visible={openAssignModal} transparent animationType="fade">
          <View style={styles.modalCenter}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Do You</Text>
                <Text style={styles.modalTitle}>Confirmation Assign to</Text>
              </View>

              <TextInput
                placeholder="Enter Name"
                placeholderTextColor="#000"
                value={assignedName}
                onChangeText={setAssignedName}
                style={styles.modalInput}
              />

              <TouchableOpacity
                onPress={() => {
                  setOpenAssignModal(false);
                  setOpenTransferModal(true);
                }}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Transfer Modal */}
        <Modal visible={openTransferModal} transparent animationType="fade">
          <View style={styles.modalCenter}>
            <View style={styles.transferModal}>
              <View style={styles.amountBox}>
                <Text style={styles.amountText}>
                  <Text style={{fontWeight: 'bold'}}>Amount :</Text> ₹
                  {bidder?.bidDetails?.bidOfAmount}
                </Text>
              </View>

              <Text style={styles.noteLabel}>Note :</Text>

              <View style={styles.transferRow}>
                <View style={styles.transferBox}>
                  <Text style={styles.transferLabel}>From :</Text>
                  <Text>{bidder?.userName}</Text>
                </View>

                <Text style={styles.arrow}>→</Text>

                <View style={styles.transferBox}>
                  <Text style={styles.transferLabel}>To :</Text>
                  <Text>Super Admin</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.transferButton}
                onPress={handleTransferPayment}>
                <Text style={styles.transferButtonText}>Transfer payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal visible={openSuccessModal} transparent animationType="fade">
          <View style={styles.modalCenter}>
            <View style={styles.successModal}>
              <Text style={styles.successTitle}>Payment Success</Text>

              <Image
                source={require('../../../assets/images/success.png')} // replace with your check icon
                style={styles.successIcon}
                resizeMode="contain"
              />

              <Text style={styles.successMessage}>
                oh yeah you were success
              </Text>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleRedirection}
                // onPress={() => setOpenSuccessModal(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Card>
    </ScrollView>
  );
};

export default CandidateCard;
