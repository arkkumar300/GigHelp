// import React, { useState, useEffect } from 'react';
// import { View, ScrollView, FlatList, Image, TouchableOpacity, Modal, Alert, StyleSheet,} from 'react-native';
// import { Button, Card, Text, TextInput, Title, Paragraph, IconButton, Portal, Dialog, Provider as PaperProvider, ActivityIndicator,} from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// // import DocumentPicker from 'react-native-document-picker';
// // import { launchImageLibrary } from 'react-native-image-picker';

// import DropDownPicker from 'react-native-dropdown-picker';

// const TaskDetails = ({ task, onBack }) => {
//   const [totalTasks, setTotalTasks] = useState(0);
//   const [disputeTasks, setDisputeTasks] = useState(0);
//   const [completedTasks, setCompletedTasks] = useState(0);
//   const [taskDocuments, setTaskDocuments] = useState([]);
//   const [bidDocuments, setBidDocuments] = useState([]);
//   const [editing, setEditing] = useState(false);
//   const [biddingAmount, setBiddingAmount] = useState(task.bidOfAmount || '');
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [fileType, setFileType] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (Array.isArray(task?.biderDocument)) {
//       setBidDocuments(task.biderDocument);
//     }
//   }, [task?.biderDocument]);

//   useEffect(() => {
//     if (Array.isArray(task?.taskDocument)) {
//       setTaskDocuments(task.taskDocument);
//     }
//   }, [task?.taskDocument]);

//   useEffect(() => {
//     const fetchTaskStats = async () => {
//       try {
//         const userId = task?.userId;
//         const token = await AsyncStorage.getItem('token');
//         if (!userId || !token) return;

//         const res = await axios.get(
//           `http://localhost:3001/task/task-summary-by-user?userId=${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const { totalTasks, disputeTasks, completedTasks } = res.data?.data || {};
//         setTotalTasks(totalTasks || 0);
//         setDisputeTasks(disputeTasks || 0);
//         setCompletedTasks(completedTasks || 0);
//       } catch (error) {
//         console.error('Error fetching task stats:', error);
//       }
//     };

//     fetchTaskStats();
//   }, [task?.userId]);

//   const handleUpdateBid = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.put(
//         `http://localhost:3001/Bids/update/${task.BidId}`,
//         {
//           bidOfAmount: biddingAmount,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         Alert.alert('Success', 'Bidding amount updated successfully!');
//         setEditing(false);
//       } else {
//         Alert.alert('Error', 'Update failed.');
//       }
//     } catch (error) {
//       console.error('Error updating bid:', error);
//       Alert.alert('Error', 'An error occurred while updating the bid.');
//     }
//   };

//   const renderDocumentItem = ({ item }) => {
//     const docUrl = `http://localhost:3001/storege/userdp/${item}`;
//     const name = item;
//     const ext = name.split('.').pop().toLowerCase();

//     let iconName = 'file';
//     if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
//       iconName = 'image';
//     } else if (ext === 'pdf') {
//       iconName = 'file-pdf';
//     }

//     return (
//       <TouchableOpacity
//         style={styles.documentItem}
//         onPress={() => {
//           setSelectedDoc(docUrl);
//           setFileName(name);
//           setFileType(ext === 'pdf' ? 'pdf' : 'image');
//           setPreviewVisible(true);
//         }}
//       >
//         <MaterialCommunityIcons name={iconName} size={30} />
//         <Text style={styles.documentName}>{name}</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <PaperProvider>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Button
//           mode="outlined"
//           icon="arrow-left"
//           onPress={onBack}
//           style={styles.backButton}
//         >
//           Back
//         </Button>

//         <Card style={styles.card}>
//           <Card.Content>
//             <Title>Category: {task.Categories}</Title>
//             <Paragraph>Status: {task.status}</Paragraph>
//             <Paragraph>
//               Posted in: {new Date(task.targetedPostIn).toLocaleDateString()}
//             </Paragraph>
//             {task.Categories === 'Transport' ? (
//               <>
//                 <Paragraph>From: {task.from || 'N/A'}</Paragraph>
//                 <Paragraph>To: {task.to || 'N/A'}</Paragraph>
//               </>
//             ) : (
//               <Paragraph>Sub Category: {task.SubCategory || 'N/A'}</Paragraph>
//             )}
//             <Paragraph>Task Amount: ₹{task.amount || 'N/A'}</Paragraph>
//             {!editing ? (
//               <Paragraph>Bidding Amount: ₹{task.bidOfAmount || 'N/A'}</Paragraph>
//             ) : (
//               <TextInput
//                 label="Bidding Amount"
//                 value={biddingAmount}
//                 onChangeText={(text) => setBiddingAmount(text)}
//                 keyboardType="numeric"
//                 style={styles.input}
//               />
//             )}
//             <Button
//               mode="contained"
//               onPress={editing ? handleUpdateBid : () => setEditing(true)}
//               style={styles.editButton}
//             >
//               {editing ? 'Submit' : 'Edit'}
//             </Button>
//           </Card.Content>
//         </Card>

//         <Card style={styles.card}>
//           <Card.Title title="Description" />
//           <Card.Content>
//             <Paragraph>{task.description}</Paragraph>
//           </Card.Content>
//         </Card>

//         <Card style={styles.card}>
//           <Card.Title title="Task Owner Details" />
//           <Card.Content>
//             <Paragraph>Total Tasks: {totalTasks}</Paragraph>
//             <Paragraph>Dispute Tasks: {disputeTasks}</Paragraph>
//             <Paragraph>Completed Tasks: {completedTasks}</Paragraph>
//             <Paragraph>Points: 350</Paragraph>
//           </Card.Content>
//         </Card>

//         <Card style={styles.card}>
//           <Card.Title title="Task Documents" />
//           <Card.Content>
//             {taskDocuments.length > 0 ? (
//               <FlatList
//                 data={taskDocuments}
//                 renderItem={renderDocumentItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 horizontal
//               />
//             ) : (
//               <Paragraph>No documents found.</Paragraph>
//             )}
//           </Card.Content>
//         </Card>

//         <Card style={styles.card}>
//           <Card.Title title="Bidder Documents" />
//           <Card.Content>
//             {bidDocuments.length > 0 ? (
//               <FlatList
//                 data={bidDocuments}
//                 renderItem={renderDocumentItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 horizontal
//               />
//             ) : (
//               <Paragraph>No documents found.</Paragraph>
//             )}
//           </Card.Content>
//         </Card>

//         <Modal
//           visible={previewVisible}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setPreviewVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <IconButton
//                 icon="close"
//                 size={24}
//                 onPress={() => setPreviewVisible(false)}
//                 style={styles.closeButton}
//               />
//               {fileType === 'pdf' ? (
//                 <Text>PDF Preview not supported in this example.</Text>
//               ) : (
//                 <Image
//                   source={{ uri: selectedDoc }}
//                   style={styles.previewImage}
//                   resizeMode="contain"
//                 />
//               )}
//               <Button
//                 mode="contained"
//                 onPress={() => {
//                   // Implement download functionality here
//                   Alert.alert('Download', 'Download functionality not implemented.');
//                 }}
//               >
//                 Download
//               </Button>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </PaperProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   backButton: {
//     marginBottom: 16,
//   },
//   card: {
//     marginBottom: 16,
//   },
//   input: {
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   editButton: {
//     marginTop: 8,
//   },
//   documentItem: {
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   documentName: {
//     marginTop: 4,
//     textAlign: 'center',
//     maxWidth: 100,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//   },
//   previewImage: {
//     width: '100%',
//     height: 300,
//     marginBottom: 16,
//   },
// });

// export default TaskDetails;
