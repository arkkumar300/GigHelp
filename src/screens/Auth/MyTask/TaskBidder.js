// Converted React Native CLI code with requested libraries

import React, {useState, useEffect} from 'react';
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
import {Button, TextInput, Card, Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';
// import { launchImageLibrary } from 'react-native-image-picker';

// import ImagePicker from 'react-native-image-picker';
// import DocumentView from 'react-native-document-viewer';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import ApiService from '../../../services/ApiService';
import BidderDetails from './BidderDetails';
import styles from './TaskBiddeerStyle';

const CategoryCard = ({task, onBack}) => {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(task.Amount || '');

  return (
    <Card style={styles.taskCard}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.actionIcons}>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <MaterialCommunityIcons name="pencil" size={24} color="#FF9800" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="delete" size={24} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryDetailsCard}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Category: {task.Categories}</Text>
          <Text style={styles.metaText}>2d ago</Text>
        </View>

        <Text style={styles.subText}>Subcategory: {task.SubCategory}</Text>
        <Text style={styles.subText}>Status: {task.status}</Text>
        <Text style={styles.subText}>
          Posted in: {new Date(task.createdAt).toLocaleDateString()}
        </Text>

        <View style={styles.amountBox}>
          <Text style={styles.amountText}>{task.amount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{task.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>Documents</Text>
      <View style={styles.documentContainer}>
        <TouchableOpacity style={styles.docButton}>
          <MaterialCommunityIcons name="file-document" size={28} color="#555" />
          <Text style={styles.docText}>Leadxpo Document File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.docButton}>
          <MaterialCommunityIcons name="image" size={28} color="#555" />
          <Text style={styles.docText}>Leadxpo Images File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.docButton}>
          <MaterialCommunityIcons name="file-pdf" size={28} color="#555" />
          <Text style={styles.docText}>Leadxpo PDF File</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const BidderCard = ({name, date, amount, image, onPress}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <TouchableOpacity onPress={onPress} style={styles.bidderCard}>
      {image ? (
        <Avatar.Image size={60} source={{uri: image}} />
      ) : (
        <Avatar.Text size={60} label={initials} />
      )}
      <View style={{marginLeft: 12}}>
        <Text style={styles.bidderName}>Name: {name}</Text>
        <Text style={styles.bidderDetail}>Posted info: {date}</Text>
        <Text style={styles.bidderDetail}>Amount: {amount}/-</Text>
      </View>
    </TouchableOpacity>
  );
};

const SinglePage = () => {
  const route = useRoute();
  const {task} = route.params;

  const [selectedBidder, setSelectedBidder] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const [bidderRes, bidsRes] = await Promise.all([
          ApiService.get(`/Bids/users-by-task/${task.taskId}`),
          ApiService.get('/Bids/get-all-bids'),
        ]);

        console.log(bidderRes, 'ddddddd');
        console.log(bidsRes, 'sssss');

        const filtered = (bidsRes.data || []).filter(
          b => b.taskId == task.taskId,
        );

        const allBidders = (bidderRes.data || []).map(bidder => {
          const bid = filtered.find(b => b.userId == bidder.userId);
          return {...bidder, bidDetails: bid};
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

  if (selectedBidder) {
    return (
      <View style={styles.container}>
        <Button mode="outlined" onPress={() => setSelectedBidder(null)}>
          Back to Bidders
        </Button>
        <BidderDetails bidder={selectedBidder} task={task} />
        {/* <Text>Bidder Details: {selectedBidder.userName}</Text> */}
        {/* Add more bidder details here */}
      </View>
    );
  }

  return (
    <FlatList
      data={bidders}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <>
          <CategoryCard task={task} onBack={() => {}} />
          <Text style={styles.sectionTitle}>Bidders</Text>
          {loading && <Text>Loading bidders...</Text>}
        </>
      }
      ListEmptyComponent={
        !loading && <Text>No bidders found for this task.</Text>
      }
      renderItem={({item}) => (
        <BidderCard
          name={item.userName}
          date={new Date(item.bidDetails.dateOfBids).toLocaleDateString()}
          amount={item.bidDetails.bidOfAmount}
          image={item.image}
          onPress={() => setSelectedBidder(item)}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

export default SinglePage;
