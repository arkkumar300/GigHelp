// Converted React Native CLI code with requested libraries

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button, TextInput, Card, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';
// import { launchImageLibrary } from 'react-native-image-picker';

// import ImagePicker from 'react-native-image-picker';
import DocumentView from 'react-native-document-viewer';
import DropDownPicker from 'react-native-dropdown-picker';

const CategoryCard = ({ task, onBack }) => {
  const [documents, setDocuments] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(task.Amount || '');

  useEffect(() => {
    if (Array.isArray(task?.document)) {
      setDocuments(task.document);
    }
  }, [task?.document]);

  const handleUpdateTask = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:3001/task/update/${task.taskId}`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Bidding amount updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating bid:', error);
      Alert.alert('Error', 'An error occurred while updating the bid.');
    }
  };

  const openPreview = (docUrl, name, type) => {
    setPreviewUri(docUrl);
    setFileName(name);
    setFileType(type);
    setPreviewVisible(true);
  };

  const renderDocIcon = (ext) => {
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return 'image';
    if (ext === 'pdf') return 'file-pdf';
    return 'file';
  };

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Button mode="outlined" onPress={onBack}>Back</Button>
        <Button mode="contained" onPress={editing ? handleUpdateTask : () => setEditing(true)}>
          {editing ? 'Submit' : 'Edit'}
        </Button>
      </View>

      <Text style={styles.title}>Category: {task.Categories}</Text>
      <Text>Status: {task.status}</Text>
      <Text>Posted: {new Date(task.createdAt).toLocaleDateString()}</Text>

      {task.Categories === 'Transport' ? (
        <Text>From: {task.from} | To: {task.to}</Text>
      ) : (
        <Text>Sub Category: {task.SubCategory}</Text>
      )}

      <View style={styles.amountRow}>
        {editing ? (
          <TextInput
            label="Enter New Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
        ) : (
          <Text style={styles.amountText}>{task.amount}</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text>{task.description}</Text>

      <Text style={styles.sectionTitle}>Documents</Text>
      <FlatList
        data={documents}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => {
          const ext = item.split('.').pop().toLowerCase();
          const uri = `http://localhost:3001/storege/userdp/${item}`;
          return (
            <TouchableOpacity style={styles.docItem} onPress={() => openPreview(uri, item, ext)}>
              <MaterialCommunityIcons name={renderDocIcon(ext)} size={28} color="black" />
              <Text>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={previewVisible} onRequestClose={() => setPreviewVisible(false)}>
        <View style={styles.modalView}>
          <Text>{fileName}</Text>
          <Button mode="outlined" onPress={() => setPreviewVisible(false)}>Close</Button>
          <DocumentView
            document={{ uri: previewUri, fileName }}
            style={{ flex: 1, width: '100%' }}
          />
        </View>
      </Modal>
    </Card>
  );
};

const BidderCard = ({ name, date, amount, image, onPress }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <TouchableOpacity onPress={onPress} style={styles.bidderCard}>
      <Avatar.Image size={60} source={image ? { uri: image } : null} label={initials} />
      <View>
        <Text>Name: {name}</Text>
        <Text>Date: {date}</Text>
        <Text>Amount: {amount}/-</Text>
      </View>
    </TouchableOpacity>
  );
};

const SinglePage = ({ task }) => {
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const [bidderRes, bidsRes] = await Promise.all([
          axios.get(`http://localhost:3001/Bids/users-by-task/${task.taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3001/Bids/get-all-bids', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const filtered = (bidsRes.data.data || []).filter(b => b.taskId == task.taskId);
        const allBidders = (bidderRes.data.data || []).map(bidder => {
          const bid = filtered.find(b => b.userId == bidder.userId);
          return { ...bidder, bidDetails: bid };
        });

        setBidders(allBidders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [task.taskId]);

  return (
    <ScrollView style={styles.container}>
      {selectedBidder ? (
        <>
          <Button mode="outlined" onPress={() => setSelectedBidder(null)}>Back to Bidders</Button>
          {/* Replace below with actual bidder detail view */}
          <Text>Bidder Details: {selectedBidder.userName}</Text>
        </>
      ) : (
        <>
          <CategoryCard task={task} onBack={() => setSelectedBidder(null)} />
          <Text style={styles.sectionTitle}>Bidders</Text>
          {loading ? (
            <Text>Loading bidders...</Text>
          ) : bidders.length === 0 ? (
            <Text>No bidders found for this task.</Text>
          ) : (
            <FlatList
              data={bidders}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <BidderCard
                  name={item.userName}
                  date={new Date(item.bidDetails.dateOfBids).toLocaleDateString()}
                  amount={item.bidDetails.bidOfAmount}
                  image={item.image}
                  onPress={() => setSelectedBidder(item)}
                />
              )}
            />
          )}
        </>
      )}
    </ScrollView>
  );
};


export default SinglePage;
