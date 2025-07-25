import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Text,
  Chip,
  Modal,
  Portal,
  Button,
  Provider as PaperProvider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import ApiService from '../../../services/ApiService';
import {loadData} from '../../../Utils/appData';
import BidderView from './BidView';
import styles from './MyBidsStyles';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const navigation = useNavigation();
  console.log('test 2');

  useFocusEffect(
    useCallback(() => {
      console.log('test 2');
      const fetchBids = async () => {
        try {
          const userData = await loadData('userInfo');
          const res = await ApiService.get(`/Bids/user/${userData.userId}`);
          console.log(res,"bids")
          const coloredBids = res.data.map(bid => ({
            ...bid,
            color: getColorByStatus(bid.status || 'pending'),
          }));
          setBids(coloredBids);
        } catch (error) {
          console.error('Error fetching bids:', error);
          Alert.alert('Error', 'Failed to load your bids.');
        }
      };

      fetchBids();
    }, []),
  );

  const handleDelete = async BidId => {
    Alert.alert('Delete Bid', 'Are you sure you want to delete this bid?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://localhost:3001/Bids/delete/${BidId}`);
            setBids(prev => prev.filter(bid => bid.BidId !== BidId));
          } catch (error) {
            console.error('Error deleting bid:', error);
            Alert.alert('Error', 'Failed to delete bid.');
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        if (item.status === 'rejected') {
          setShowKYCModal(true);
        } else {
          setSelectedBid(item);
        }
      }}>
      <Card style={[styles.card, {borderColor: item.color}]}>
        <Card.Content>
          <View style={styles.rowBetween}>
            <Text variant="titleMedium">Category: {item.Categories}</Text>
            <Icon
              name="delete"
              size={24}
              color="red"
              onPress={() => handleDelete(item.BidId)}
            />
            {/* <Text>{item.daysLeft || ''}</Text> */}
          </View>

          {item.Categories === 'Transport' ? (
            <View style={styles.rowBetween}>
              <Text>From: {item.from || 'N/A'}</Text>
              <Text>To: {item.to || 'N/A'}</Text>
              <Icon
                name="delete"
                size={24}
                color="red"
                onPress={() => handleDelete(item.BidId)}
              />
            </View>
          ) : (
            <View style={styles.rowBetween}>
              <Text>Sub Category: {item.SubCategory || 'N/A'}</Text>
              {/* <Icon
                name="delete"
                size={24}
                color="red"
                onPress={() => handleDelete(item.BidId)}
              /> */}
            </View>
          )}

          <View style={styles.rowBetween}>
            <Text>Posted: {moment(item.createdAt).format('DD-MM-YYYY')}</Text>
            <Chip
              style={{backgroundColor: item.color}}
              textStyle={{color: '#fff'}}
              onPress={() => setSelectedBid(item)}>
              ₹ {item.bidOfAmount}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (selectedBid) {
    return (
      <BidderView task={selectedBid} onBack={() => setSelectedBid(null)} />
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.header}>
          My Bids
        </Text>

        <FlatList
          data={bids}
          keyExtractor={item => item.BidId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 100}}
        />

        <Portal>
          <Modal
            visible={showKYCModal}
            onDismiss={() => setShowKYCModal(false)}
            contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>⚠️ Whoops</Text>
            <Text style={styles.modalContent}>
              KYC Under Process. You can't view this bid.
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

export default MyBids;

// import React, {useEffect, useState} from 'react';
// import {View, FlatList, Alert} from 'react-native';
// import {
//   Card,
//   Title,
//   Paragraph,
//   Chip,
//   IconButton,
//   Text,
// } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import BidderView from './BidView'; // create this screen
// import ApiService from '../../../services/ApiService';
// import {loadData} from '../../../Utils/appData';

// const colors = [
//   '#2196f3',
//   '#4caf50',
//   '#ff9800',
//   '#e91e63',
//   '#9c27b0',
//   '#00bcd4',
//   '#f44336',
//   '#3f51b5',
//   '#8bc34a',
//   '#ffc107',
//   '#795548',
//   '#607d8b',
//   '#673ab7',
//   '#009688',
//   '#cddc39',
// ];

// const MyBids = () => {
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userData = await loadData('userInfo');
//         const userDetail = userData;
//         const res = await ApiService.get(`/Bids/user/${userDetail.userId}`);
//         console.log(res, 'bids');
//         setTasks(res?.data || []);
//       } catch (error) {
//         console.error('Fetch Error:', error.message);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDelete = async BidId => {
//     Alert.alert('Confirm Delete', 'Are you sure you want to delete this bid?', [
//       {text: 'Cancel', style: 'cancel'},
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             await axios.delete(`http://localhost:3001/Bids/delete/${BidId}`);
//             setTasks(prev => prev.filter(task => task.BidId !== BidId));
//           } catch (error) {
//             console.error('Delete Error:', error.message);
//             Alert.alert('Error', 'Failed to delete bid.');
//           }
//         },
//       },
//     ]);
//   };

//   const renderItem = ({item, index}) => {
//     const color = colors[index % colors.length];

//     return (
//       <Card
//         onPress={() => setSelectedTask(item)}
//         style={{margin: 10, borderColor: color, borderWidth: 1}}
//         mode="outlined">
//         <Card.Content>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}>
//             <Title>Category: {item.Categories || 'N/A'}</Title>
//             <IconButton
//               icon={() => (
//                 <MaterialCommunityIcons name="delete" size={20} color="red" />
//               )}
//               onPress={() => handleDelete(item.BidId)}
//             />
//             {/* <Chip
//               style={{ backgroundColor: color }}
//               textStyle={{ color: 'white' }}
//               onPress={() => setSelectedTask(item)}
//             >
//               View
//             </Chip> */}
//           </View>

//           {item.Categories === 'Transport' ? (
//             <View style={{flexDirection: 'row', marginTop: 5}}>
//               <Text>From: {item.from || 'N/A'}</Text>
//               <Text style={{marginLeft: 10}}>To: {item.to || 'N/A'}</Text>
//             </View>
//           ) : (
//             <View
//               style={{
//                 flexDirection: 'row',
//                 marginTop: 5,
//                 justifyContent: 'space-between',
//               }}>
//               <Text>Sub Category: {item.SubCategory || 'N/A'}</Text>
//               {/* <IconButton
//                 icon={() => (
//                   <MaterialCommunityIcons name="delete" size={20} color="red" />
//                 )}
//                 onPress={() => handleDelete(item.BidId)}
//               /> */}
//             </View>
//           )}

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginTop: 10,
//             }}>
//             <Text>Posted: {item.createdAt?.substring(0, 10) || 'N/A'}</Text>
//             <Text style={{fontWeight: 'bold'}}>
//               Bid Amount: ₹{item.bidOfAmount || '0'}
//             </Text>
//           </View>
//         </Card.Content>
//       </Card>
//     );
//   };

//   if (selectedTask) {
//     return (
//       <BidderView task={selectedTask} onBack={() => setSelectedTask(null)} />
//     );
//   }

//   return (
//     <View style={{flex: 1}}>
//       <Title style={{textAlign: 'center', marginVertical: 20}}>My Bids</Title>

//       <FlatList
//         data={tasks}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={renderItem}
//         ListEmptyComponent={
//           <Text style={{textAlign: 'center', marginTop: 50}}>
//             No bids found.
//           </Text>
//         }
//       />
//     </View>
//   );
// };

// export default MyBids;
