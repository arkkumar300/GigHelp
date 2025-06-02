import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Modal, TouchableOpacity} from 'react-native';
import { Avatar, Button, Card, Text, TextInput, Divider,} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import ChatBoard from './ChatBoard'; // You’ll need to convert this too
import styles from './BidderDetailsStyle';
const CandidateCard = ({ bidder }) => {
  const [userId, setUserId] = useState(null);
  const [assignedName, setAssignedName] = useState('');
  const [messages, setMessages] = useState([
    { from: 'user', text: 'Hi, are you available for a project?' },
    { from: 'Alexandra', text: 'Yes, I am interested!' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(user);
      setUserId(parsed?.userId);
    })();
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { from: 'user', text: newMessage }]);
      setNewMessage('');
    }
  };

  const handleTransferPayment = async () => {
    if (!assignedName || !bidder || !bidder.bidDetails) {
      console.warn('Missing required fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/transections/create', {
        name: assignedName,
        amount: bidder.bidDetails.bidOfAmount,
        taskOwner: userId,
        userId: userId,
        taskUser: bidder.bidDetails.userId,
        categoryName: bidder.bidDetails.Categories,
      });

      if (response.status === 200 || response.status === 201) {
        setOpenTransferModal(false);
        setOpenSuccessModal(true);
      }
    } catch (err) {
      console.error('Transfer Error:', err.response?.data || err.message);
    }
  };

  const renderSkill = ({ item }) => (
    <Card style={styles.skillCard}>
      <Card.Content>
        <Text style={styles.skillText}>Skill: {item.title}</Text>
        <Text>Experience: {item.experience}</Text>
        <Divider style={{ marginVertical: 5 }} />
        <Text>Work: {item.work}</Text>
        <Text>Description: {item.content}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <Card style={styles.container}>
      <Card.Title
        title={bidder?.userName}
        subtitle={`Experience: ${bidder?.experiance}`}
        left={() =>
          <Avatar.Image
            size={64}
            source={{
              uri: bidder?.profilePic
                ? `http://localhost:3001/storege/userdp/${bidder?.profilePic}`
                : '',
            }}
          />
        }
        right={() =>
          <Button
            mode="contained"
            onPress={() => setOpenAssignModal(true)}
          >
            Approve Bid
          </Button>
        }
      />

      <FlatList
        data={bidder?.skills || []}
        renderItem={renderSkill}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginVertical: 10 }}
      />

      <Divider style={{ marginVertical: 10 }} />

      <Text style={styles.chatTitle}>Chat Board Bidder</Text>
      <ChatBoard task={bidder} />

      {/* Assign Modal */}
      <Modal visible={openAssignModal} transparent animationType="fade">
        <View style={styles.modalCenter}>
          <Card style={styles.modalCard}>
            <Card.Title title="Confirm Assignment To:" />
            <Card.Content>
              <TextInput
                label="Enter Name"
                value={assignedName}
                onChangeText={setAssignedName}
                mode="outlined"
              />
              <Button mode="contained" onPress={() => {
                setOpenAssignModal(false);
                setOpenTransferModal(true);
              }} style={styles.mt10}>
                OK
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>

      {/* Transfer Modal */}
      <Modal visible={openTransferModal} transparent animationType="fade">
        <View style={styles.modalCenter}>
          <Card style={styles.modalCard}>
            <Card.Title title="Transfer Payment" />
            <Card.Content>
              <Text>Bider Amount: ₹{bidder?.bidDetails?.bidOfAmount}</Text>
              <View style={styles.transferRow}>
                <View style={styles.transferBox}>
                  <Text>From:</Text>
                  <Text>{bidder?.userName}</Text>
                </View>
                <Icon name="arrow-right" size={30} style={{ marginHorizontal: 10 }} />
                <View style={styles.transferBox}>
                  <Text>To:</Text>
                  <Text>Super Admin</Text>
                </View>
              </View>
              <Button mode="contained" onPress={handleTransferPayment}>
                Transfer Now
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={openSuccessModal} transparent animationType="fade">
        <View style={styles.modalCenter}>
          <Card style={styles.modalCard}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Icon name="check-circle" size={60} color="green" />
              <Text style={{ fontSize: 18, marginVertical: 10 }}>Payment Transferred!</Text>
              <Button onPress={() => setOpenSuccessModal(false)} mode="contained" color="green">
                Close
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </Card>
  );
};


export default CandidateCard;
