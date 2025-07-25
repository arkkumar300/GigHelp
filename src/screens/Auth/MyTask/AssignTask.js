import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Avatar, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../../../services/ApiService';
import styles from './AssignTaskStyle';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import AssignTaskChatBoard from '../ChatBoard/AssignTaskChartBoard';

const DocumentCard = ({icon, label, fileUrl}) => (
  <TouchableOpacity
    style={styles.documentCard}
    onPress={() => Linking.openURL(fileUrl)}>
    <MaterialCommunityIcons name={icon} size={32} color="#1976d2" />
    <Text style={styles.documentLabel}>{label}</Text>
  </TouchableOpacity>
);

const DocumentSection = ({title, documents = []}) => {
  const getIconName = filename => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'file-pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
    return 'file-document';
  };

  const baseUrl = 'http://localhost:3001/storege/userdp/';

  return (
    <View style={{marginBottom: 20}}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={documents}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        horizontal
        renderItem={({item}) => (
          <DocumentCard
            icon={getIconName(item)}
            label={item}
            fileUrl={`${baseUrl}${item}`}
          />
        )}
      />
    </View>
  );
};

const SkillCard = ({skill, experience}) => (
  <Card style={styles.skillCard}>
    <Text style={styles.skillText}>
      <MaterialCommunityIcons name="star" size={16} color="#1976d2" /> Skill:{' '}
      {skill}
    </Text>
    <Text style={styles.expText}>
      <MaterialCommunityIcons name="briefcase" size={16} color="#43a047" />{' '}
      Experience: {experience}
    </Text>
  </Card>
);

const ExciteProfileCard = ({bidder}) => (
  <Card style={styles.profileCard}>
    <View style={styles.profileHeader}>
      <Avatar.Image
        source={{
          uri: bidder?.profilePic
            ? `http://localhost:3001/storege/userdp/${bidder.profilePic}`
            : undefined,
        }}
        size={70}
      />
      <View style={{marginLeft: 12}}>
        <Text style={styles.userName}>{bidder?.userName || 'N/A'}</Text>
        <Text style={styles.userExperience}>
          Experience: {bidder?.bidder?.experience || 'N/A'} Yrs
        </Text>
      </View>
    </View>
    <FlatList
      data={[1, 2, 3, 4]}
      keyExtractor={(item, index) => index.toString()}
      scrollEnabled={false}
      numColumns={2}
      renderItem={() => <SkillCard skill="Social Media" experience="3 years" />}
    />
  </Card>
);

const BidderDisputeCard = () => {
  const route = useRoute();
  const {task} = route.params;

  const [bidders, setBidders] = useState([]);
  const [bidder, setBidder] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(bidders, 'bidders');
  console.log(bidder, 'bidder');
  console.log(task, 'task');

  useFocusEffect(
    useCallback(() => {
      const fetchBidders = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
          // const response = await ApiService.get(
          //   `/Bids/users-by-task/${task.taskId}`,
          // );

          // setBidders(response.data || []);
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
          console.log(allBidders,"ddddd")

          const assignTaskBidder = allBidders.find(item => {
            console.log(
              item.userId,
              Number(task.assignedBidderId),
              'testttttt',
            );
            return item.userId === Number(task.assignedBidderId);
          });

          console.log(assignTaskBidder, 'assign bidder');
          setBidder(assignTaskBidder);
        } catch (error) {
          console.error('Error fetching bidders:', error);
        } finally {
          setLoading(false);
        }
      };

      if (task?.taskId) {
        fetchBidders();
      }

      // Optional cleanup
      return () => {
        setBidders([]);
        setBidder(null);
        setLoading(true);
      };
    }, [task?.taskId]),
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <ScrollView style={styles.container}>

        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Bidder Dispute</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
        </View>

        <View>
          <Card style={styles.halfCard}>
            <Text style={styles.cardTitle}>Category: {task.Categories}</Text>
            <Text style={styles.cardText}>Days Left: {task.daysLeft}</Text>
            {task.Categories === 'Transport' ? (
              <>
                <Text style={styles.cardText}>From: {task.from || 'N/A'}</Text>
                <Text style={styles.cardText}>To: {task.to || 'N/A'}</Text>
              </>
            ) : (
              <Text style={styles.cardText}>
                Sub Category: {task.SubCategory || 'N/A'}
              </Text>
            )}
            <Text style={styles.cardText}>Status: {task.status}</Text>
            <Text style={styles.cardText}>
              Posted in: {new Date(task.createdAt).toLocaleDateString()}
            </Text>
            <Button mode="contained" style={styles.amountButton}>
              {task.amount}
            </Button>
          </Card>
        </View>

        <View>
          <Card style={styles.halfCard}>
            <Text style={styles.cardTitle}>Description :</Text>
            <Text style={styles.cardText}>{task.description}</Text>
          </Card>
        </View>

        <DocumentSection
          title="Task Owner Document"
          documents={task.document || []}
        />
        <DocumentSection
          title="Bidder Document"
          documents={task.document || []}
        />

        {/* {bidders.length > 0 && <ExciteProfileCard bidder={bidder} />} */}
        {bidder ? <ExciteProfileCard bidder={bidder} /> : null}

        <View style={{flex: 1, height: '60%', marginBottom: 30}}>
          <AssignTaskChatBoard task={bidder} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BidderDisputeCard;
