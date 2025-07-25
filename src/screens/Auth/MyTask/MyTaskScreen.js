import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Modal,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import ApiService from '../../../services/ApiService';
import {loadData} from '../../../Utils/appData';
import TaskBidder from './TaskBidder';
import AssignTask from './AssignTask';
import styles from './MyTaskStyle';
import {useFocusEffect} from '@react-navigation/native';

const MyTaskScreen = () => {
  console.log("MyTaskScreen rendered");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskBidder, setShowTaskBidder] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const navigation = useNavigation();
  console.log("abcd")

  useFocusEffect(
    useCallback(() => {
      console.log("abcd")
      let isActive = true;

      const fetchTasks = async () => {
        try {
          const userData = await loadData('userInfo');

          if (!userData || !userData.userId) {
            Alert.alert('Error', 'Authorization token or user data missing!');
            return;
          }

          const userId = userData.userId;

          const response = await ApiService.post('/task/get-task-by-user', {
            userId,
          });

          console.log(response, 'response my tas');

          const tasksWithColors = response.data.map(task => ({
            ...task,
            color: getColorByStatus(task.status),
          }));

          if (isActive) setTasks(tasksWithColors);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          Alert.alert('Error', 'Failed to fetch tasks.');
        }
      };

      fetchTasks();

      // Cleanup to avoid state updates if screen is unfocused quickly
      return () => {
        isActive = false;
      };
    }, []),
  );

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       // const token = await AsyncStorage.getItem("token");
  //       const userData = await loadData('userInfo');

  //       if (!userData || !userData.userId) {
  //         Alert.alert('Error', 'Authorization token or user data missing!');
  //         return;
  //       }

  //       const userId = userData.userId;

  //       const response = await ApiService.post(
  //         '/task/get-task-by-user',
  //         {userId},
  //         // { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       console.log(response, 'response my tas');

  //       const tasksWithColors = response.data.map(task => ({
  //         ...task,
  //         color: getColorByStatus(task.status),
  //       }));

  //       setTasks(tasksWithColors);
  //     } catch (error) {
  //       console.error('Error fetching tasks:', error);
  //       Alert.alert('Error', 'Failed to fetch tasks.');
  //     }
  //   };

  //   fetchTasks();
  // }, []);

  const handleDelete = async taskId => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this Task?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`http://localhost:3001/task/delete/${taskId}`, {
              headers: {Authorization: `Bearer ${token}`},
            });
            setTasks(prev => prev.filter(task => task.taskId !== taskId));
          } catch (error) {
            console.error('Error deleting task:', error);
            Alert.alert('Error', 'Failed to delete task.');
          }
        },
      },
    ]);
  };

  const getColorByStatus = status => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'verified':
        return 'green';
      case 'rejected':
        return 'red';
      case 'completed':
        return '#2196f3';
      case 'running':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const renderTask = ({item: task}) => (
    // <TouchableOpacity
    //   onPress={() => {
    //     if (task.status === 'verified') setSelectedTask(task);
    //     else if (task.status === 'rejected') setShowKYCModal(true);
    //     else if (task.status === 'pending') {
    //       setShowTaskBidder(true);
    //       setCurrentTask(task);
    //     }
    //   }}>
    <TouchableOpacity
      onPress={() => {
        if (task.status === 'running') {
          navigation.navigate('AssignTask', {task});
        } else if (task.status === 'rejected') {
          setShowKYCModal(true);
        } else if (task.status === 'verified' || task.status === 'pending') {
          navigation.navigate('TaskBidder', {task});
        }
      }}>
      <Card style={[styles.card, {borderColor: task.color}]}>
        <Card.Content>
          <View style={styles.rowBetween}>
            <Text variant="titleMedium">Category: {task.Categories}</Text>
            <Text>{task.daysLeft}</Text>
          </View>

          {task.Categories === 'Transport' ? (
            <View style={styles.rowBetween}>
              <Text>From: {task.from || 'N/A'}</Text>
              <Text>To: {task.to || 'N/A'}</Text>
              <Icon
                name="delete"
                size={24}
                color="red"
                onPress={() => handleDelete(task.taskId)}
              />
            </View>
          ) : (
            <View style={styles.rowBetween}>
              <Text>Sub Category: {task.SubCategory || 'N/A'}</Text>
              <Icon
                name="delete"
                size={24}
                color="red"
                onPress={() => handleDelete(task.taskId)}
              />
            </View>
          )}

          <View style={styles.rowBetween}>
            <Text>Posted: {moment(task.createdAt).format('DD-MM-YYYY')}</Text>
            <Chip
              style={{backgroundColor: task.color}}
              textStyle={{color: '#fff'}}
              onPress={() => {
                if (task.status === 'pending') {
                  setShowTaskBidder(true);
                  setCurrentTask(task);
                } else if (task.status === 'rejected') {
                  setShowKYCModal(true);
                } else if (task.status === 'verified') {
                  setSelectedTask(task);
                }
              }}>
              ₹ {task.amount}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (selectedTask) {
    return <AssignTask task={selectedTask} />;
  }

  if (showTaskBidder) {
    return <TaskBidder task={currentTask} />;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.header}>
          My Tasks
        </Text>

        <FlatList
          data={tasks}
          keyExtractor={item => item.taskId.toString()}
          renderItem={renderTask}
          contentContainerStyle={{paddingBottom: 100}}
        />

        <Portal>
          <Modal
            visible={showKYCModal}
            onDismiss={() => setShowKYCModal(false)}
            contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>⚠️ Whoops</Text>
            <Text style={styles.modalContent}>
              KYC Under Process. You can't add a task.
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                setShowKYCModal(false);
                navigation.navigate('Profile');
              }}>
              For More
            </Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default MyTaskScreen;
