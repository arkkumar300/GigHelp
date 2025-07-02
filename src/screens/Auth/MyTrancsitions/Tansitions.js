// // Converted to React Native CLI with specified libraries

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, SafeAreaView,} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { Card, Button, Title } from 'react-native-paper';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from './TransitionsStyle';

// const statusColor = {
//   completed: '#4CAF50',
//   failed: '#F44336',
//   pending: '#FF9800',
// };

// const Transactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('user');
//         const user = JSON.parse(userData);
//         setUserName(user?.userName);

//         const res = await axios.get(
//           `http://localhost:3001/transections/get-by-user/${user?.userId}`
//         );
//         setTransactions(res.data.data || []);
//       } catch (error) {
//         console.error('Failed to fetch transactions', error);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   const renderItem = ({ item }) => (
//     <Card style={[styles.card, { borderColor: statusColor[item.status] }]}> 
//       <Card.Content style={styles.cardContent}>
//         <View style={styles.leftContent}>
//           <Title>{item.amount}</Title>
//           <Text style={styles.category}>{item.categoryName}</Text>
//           <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
//         </View>
//         <Button
//           mode="contained"
//           style={[styles.statusButton, { backgroundColor: statusColor[item.status] }]}
//           labelStyle={styles.buttonLabel}
//         >
//           {item.status}
//         </Button>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.greeting}>Hello</Text>
//       <Text style={styles.userName}>{userName}</Text>

//       <Text style={styles.heading}>Transactions</Text>

//       <FlatList
//         data={transactions}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={styles.list}
//       />
//     </SafeAreaView>
//   );
// };

// export default Transactions;
