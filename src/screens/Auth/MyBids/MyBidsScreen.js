import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton, Text,} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BidderView from './BidView'; // create this screen

const colors = [
  "#2196f3", "#4caf50", "#ff9800", "#e91e63", "#9c27b0",
  "#00bcd4", "#f44336", "#3f51b5", "#8bc34a", "#ffc107",
  "#795548", "#607d8b", "#673ab7", "#009688", "#cddc39",
];

const MyBids = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const userDetail = JSON.parse(userData);
        const res = await axios.get(`http://localhost:3001/Bids/user/${userDetail.userId}`);
        setTasks(res.data?.data || []);
      } catch (error) {
        console.error('Fetch Error:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (BidId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this bid?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`http://localhost:3001/Bids/delete/${BidId}`);
              setTasks(prev => prev.filter(task => task.BidId !== BidId));
            } catch (error) {
              console.error('Delete Error:', error.message);
              Alert.alert("Error", "Failed to delete bid.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }) => {
    const color = colors[index % colors.length];

    return (
      <Card style={{ margin: 10, borderColor: color, borderWidth: 1 }} mode="outlined">
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Title>Category: {item.Categories || 'N/A'}</Title>
            <Chip
              style={{ backgroundColor: color }}
              textStyle={{ color: 'white' }}
              onPress={() => setSelectedTask(item)}
            >
              View
            </Chip>
          </View>

          {item.Categories === 'Transport' ? (
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text>From: {item.from || 'N/A'}</Text>
              <Text style={{ marginLeft: 10 }}>To: {item.to || 'N/A'}</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' }}>
              <Text>Sub Category: {item.SubCategory || 'N/A'}</Text>
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons name="delete" size={20} color="red" />
                )}
                onPress={() => handleDelete(item.BidId)}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Text>Posted: {item.createdAt?.substring(0, 10) || 'N/A'}</Text>
            <Text style={{ fontWeight: 'bold' }}>Bid Amount: ₹{item.bidOfAmount || '0'}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (selectedTask) {
    return <BidderView task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Title style={{ textAlign: 'center', marginVertical: 20 }}>My Bids</Title>

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50 }}>No bids found.</Text>}
      />
    </View>
  );
};

export default MyBids;
