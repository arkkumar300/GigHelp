const renderDocumentOption = (icon, label) => (
  <TouchableOpacity style={styles.docItem}>
    <MaterialCommunityIcons name={icon} size={28} color="#333" />
    <Text style={styles.docText}>{label}</Text>
  </TouchableOpacity>
);

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Modal as RNModal,
  Platform,
} from 'react-native';
import {
  Card,
  Button,
  Title,
  Paragraph,
  Dialog,
  Portal,
  TextInput,
  Divider,
  Paragraph as PaperParagraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './TaskDetailsStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BidModal from './BidModal';
import {loadData} from '../../../Utils/appData';
import ApiService from '../../../services/ApiService';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import mime from 'react-native-mime-types';

const TaskDetailsScreen = () => {
  const route = useRoute();
  const {task} = route.params;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [bidOfAmount, setBidOfAmount] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [files, setFiles] = useState([]);
  const [bidData, setBidData] = useState(null);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [fileType, setFileType] = useState('');

  const [documents, setDocuments] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [disputeTasks, setDisputeTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const IMAGE_URL = 'http://localhost:3001/images/task';

  // When props.task.document is available
  useEffect(() => {
    if (Array.isArray(task?.document)) {
      setDocuments(task.document);
    }
  }, [task?.document]);

  const openPreview = async url => {
    try {
      const fileName = url.split('/').pop();
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const mimeType = mime.lookup(fileExtension) || 'application/octet-stream';
      const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const downloadRes = await RNFS.downloadFile({
        fromUrl: url,
        toFile: localFile,
      }).promise;

      if (downloadRes.statusCode === 200) {
        await FileViewer.open(localFile, {
          showOpenWithDialog: true,
          displayName: fileName,
          mimeType,
        });
      } else {
        Alert.alert('Download Failed', 'Could not download the file.');
      }
    } catch (error) {
      console.error('📁 File preview error:', error);
      Alert.alert('Error', 'This file could not be opened.');
    }
  };

  // Close preview modal
  const handlePreviewClose = () => {
    setSelectedDoc(null);
    setPreviewVisible(false);
  };

  // Open dialog
  const handleClickOpen = () => setDialogOpen(true);

  // Close dialog and reset form
  const handleDialogClose = () => {
    setDialogOpen(false);
    setBidOfAmount('');
    setDescription('');
    setFiles([]);
  };

  // Close success modal
  const handleModalClose = () => {
    setModalOpen(false);
    setBidData(null);
  };

  // Submit Bid
  const handleAddBid = async ({bidOfAmount, description, files}) => {
    if (!bidOfAmount || !description) {
      Alert.alert('Error', 'Amount and description are required.');
      return;
    }

    const formData = new FormData();
    formData.append('bidOfAmount', bidOfAmount);
    formData.append('description', description);
    formData.append('Categories', task?.Categories || '');
    formData.append('SubCategory', task?.SubCategory || '');
    formData.append('amount', task?.amount || '');
    formData.append('targetedPostIn', task?.targetedPostIn || '');
    formData.append('daysLeft', task?.daysLeft || '');
    formData.append('bidUserId', userId || '');
    formData.append('taskUserId', task?.taskUserId || '');
    formData.append('userId', userId || '');
    formData.append('taskId', task?.taskId || '');
    formData.append('taskDescription', task?.description || '');

    console.log(task,"add bid task")
    console.log(task.taskUserId,"add bid task user id")

    if (Array.isArray(task?.document)) {
      task.document.forEach(doc => {
        formData.append('taskDocument[]', doc);
      });
    }

    if (files.length > 0) {
      files.forEach(f => {
        formData.append('biderDocument', {
          uri: f.uri,
          type: f.type,
          // name: f.name,
          name: f.fileName,
        });
      });
    }

    try {
      const response = await ApiService.post('/Bids/create', formData);
      console.log('✅ response details of creating bid:', response);

      const bidId = response.data?.BidId;

      if (!bidId) {
        console.error('❌ bidId is undefined in response:', response.data);
        Alert.alert('Error', 'Failed to retrieve bid ID.');
        return;
      }

      const getResponse = await ApiService.get(
        `/Bids/get-by-bidid?bidId=${bidId}`,
      );
      console.log(getResponse,"bid response")

      setBidData(getResponse.data?.data || getResponse.data);
      setDialogOpen(false);
      setModalOpen(true);
    } catch (error) {
      console.error('❌ Error submitting bid:', error);
      Alert.alert('Error', 'Failed to submit bid. Please try again.');
    }
  };

  useEffect(() => {
    const fetchTaskStats = async () => {
      const user = await loadData('userInfo');
      console.log(user, 'userrrrrrrr');
      setUserId(user?.userId);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!task?.userId ) return;

        const res = await ApiService.get(
          `/task/task-summary-by-user?userId=${user.userId}`,
        );
        console.log(user, 'userrrrrrrr1111');

        console.log(res,"task summary")

        const {totalTasks, disputeTasks, completedTasks} = res?.data || {};
        setTotalTasks(totalTasks || 0);
        setDisputeTasks(disputeTasks || 0);
        setCompletedTasks(completedTasks || 0);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      }
    };

    fetchTaskStats();
  }, [task?.userId]);

  return (
    <ScrollView style={styles.container}>
      {/* Category Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.rowBetween}>
            <Title variant="titleMedium">Category : {task.Categories}</Title>
            <Text style={styles.lightText}>{task.daysLeft}</Text>
          </View>
          <View style={styles.rowBetween}>
            {task.Categories === 'Transport' ? (
              <View style={styles.row}>
                <Text style={styles.label}>From: {task.from || 'N/A'}</Text>
                <Text style={styles.label}>To: {task.to || 'N/A'}</Text>
              </View>
            ) : (
              <Text style={styles.label}>
                Sub Category: {task.SubCategory || 'N/A'}
              </Text>
            )}
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.status}>Status: {task.status}</Text>
            <Button style={styles.amountButton} mode="contained">
              ₹ {task.amount}
            </Button>
          </View>
          <Text>
            Posted in: {new Date(task.createdAt).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>

      {/* Description */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.descLabel}>Description :</Text>
          <Text style={styles.description}>{task.description}</Text>
        </Card.Content>
      </Card>

      {/* Task Owner Details */}
      <Title style={styles.sectionTitle}>Task Owner Details</Title>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.descLabel}>Total Task : {totalTasks}</Text>
          <Text style={styles.descLabel}>
            Dispute Task : {disputeTasks}
          </Text>
          <Text style={styles.descLabel}>
            Completed Task : {completedTasks}
          </Text>
          <Text style={styles.descLabel}>Points : 350</Text>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
            <Text style={styles.descLabel}>4.0 </Text>
            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            <Icon name="star" size={20} color="#f5c518" />
            <MaterialCommunityIcons
              name="star-outline"
              size={18}
              color="#FFD700"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Documents */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Documents</Title>
        <Card style={styles.card}>
          {documents.length > 0 ? (
            documents.map((doc, index) => {
              const ext = doc.split('.').pop().toLowerCase();
              const iconName =
                ext === 'pdf'
                  ? 'file-pdf-box'
                  : ['jpg', 'jpeg', 'png'].includes(ext)
                  ? 'image'
                  : 'attachment';
              const docUrl = `${IMAGE_URL}/${doc}`;
              console.log(docUrl, 'doc url');

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.docRow}
                  onPress={() => openPreview(docUrl)}>
                  <MaterialCommunityIcons name={iconName} size={24} color="#333" />
                  <Text style={{marginLeft: 8}}>{doc}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.docRow}>No documents found.</Text>
          )}
          {/* <Card.Content>
            <Text style={{fontWeight: '600'}}>Document Option :</Text>
            <Divider style={{marginVertical: 10}} />
            {renderDocumentOption('file-plus', 'Leadxpo Document File')}
            {renderDocumentOption('image', 'Leadxpo Images File')}
            {renderDocumentOption('file-pdf', 'Leadxpo PDF File')}
          </Card.Content> */}
        </Card>
      </View>

      {/* Add Bid Button */}
      <Button
        mode="contained"
        style={styles.addBidBtn}
        onPress={() => setDialogOpen(true)}>
        <Text style={styles.addBidBtnText}>Add Bid</Text>
      </Button>

      {/* Document Preview Modal */}
      <RNModal
        visible={previewVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPreviewVisible(false)}>
              <Icon name="close" size={28} />
            </TouchableOpacity>
            {/* {fileType === 'pdf' ? (
              <Pdf source={{uri: selectedDoc}} style={styles.previewPdf} />
            ) : (
              <Image
                source={{uri: selectedDoc}}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )} */}
            <Button
              mode="contained"
              onPress={() => Linking.openURL(selectedDoc)}
              style={{marginTop: 16}}>
              Download
            </Button>
          </View>
        </View>
      </RNModal>

      {/* Add Bid Dialog */}
      <BidModal
        visible={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleAddBid}
      />

      {/* Success Modal */}
      <Portal>
        <Dialog
          visible={modalOpen}
          onDismiss={handleModalClose}
          style={{backgroundColor: '#FFFFFF'}}>
          <Dialog.Content>
            <View
              style={{
                alignItems: 'center',
                marginBottom: 20,
                backgroundColor: '#FCFCFC',
                padding: 2,
              }}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/9456/9456124.png',
                }}
                style={{width: 80, height: 80, marginBottom: 10}}
              />
              <Title style={{color: '#0C80FF'}}>Bidding Success</Title>
            </View>

            <Card
              style={{
                padding: 10,
                backgroundColor: '#FCFCFC',
                marginBottom: 10,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Bid ID :</Text>{' '}
                  {bidData?.BidId}
                </Text>
                <Text style={{color: '#3797FF'}}>
                  <Text style={{fontWeight: 'bold'}}>Posted on :</Text>{' '}
                  {bidData
                    ? new Date(bidData.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                </Text>
              </View>
              <Text style={{marginTop: 8}}>
                <Text style={{fontWeight: 'bold'}}>Task ID :</Text>{' '}
                {bidData?.taskId}
              </Text>
              <Text style={{marginTop: 8}}>
                <Text style={{fontWeight: 'bold'}}>Bid Description :</Text>{' '}
                {bidData?.description}
              </Text>
            </Card>

            <Card
              style={{
                padding: 10,
                backgroundColor: '#FCFCFC',
                marginBottom: 10,
              }}>
              <Text>
                <Text style={{fontWeight: 'bold'}}>Description :</Text>{' '}
                {bidData?.taskDescription}
              </Text>
            </Card>

            <Card
              style={{
                padding: 10,
                backgroundColor: '#FCFCFC',
                marginBottom: 20,
              }}>
              <Text>
                <Text style={{fontWeight: 'bold'}}>Budget :</Text> {bidData?.bidOfAmount}
              </Text>
            </Card>

            <Button
              mode="contained"
              onPress={handleModalClose}
              style={{
                borderRadius: 15,
                paddingVertical: 8,
                backgroundColor: '#1D9BFB',
              }}>
              Done
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default TaskDetailsScreen;
