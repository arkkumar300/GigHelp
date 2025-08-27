import React, {useState, useEffect, useCallback} from 'react';
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
import {Button, TextInput, Chip, Card, Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getEnvVars from '../../../config/env';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import ApiService from '../../../services/ApiService';
import BidderDetails from './BidderDetails';
import DocumentPicker from 'react-native-document-picker';
import styles from './TaskBiddeerStyle';
import DatePicker from 'react-native-date-picker';
import {ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {API_BASE_URL} = getEnvVars();
const IMAGE_URL = `${API_BASE_URL}/images/task`;

const CategoryCard = ({task, onBack, onTaskUpdated}) => {
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    amount: task.amount || '',
    description: task.description || '',
    remarks: task.remarks || '',
    status: task.status || '',
    endData: task.endData || '',
  });

  console.log(task, 'takkkkk');
  // const [documents, setDocuments] = useState(task.document || []);
  const parseDocuments = doc => {
    if (!doc) return [];

    if (typeof doc === 'string') {
      try {
        const parsed = JSON.parse(doc);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        // If it's just a plain filename string, return it inside an array
        return [doc];
      }
    }

    // If already an array/object
    if (Array.isArray(doc)) return doc;

    return [];
  };

  const [documents, setDocuments] = useState(parseDocuments(task.document));

  console.log('task.document value:', task.document);
  console.log('task.document type:', typeof task.document);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const STATUS_COLORS = {
    pending: {backgroundColor: '#FF9800', textColor: '#FFF'},
    verified: {backgroundColor: 'green', textColor: '#FFF'},
    inprogress: {backgroundColor: '#2196F3', textColor: '#FFF'},
    rejected: {backgroundColor: '#F44336', textColor: '#FFF'},
  };

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        endData: selectedDate.toISOString(),
      }));
    }
  };

  const resetFormData = () => {
    setFormData({
      amount: task.amount || '',
      description: task.description || '',
      remarks: task.remarks || '',
      status: task.status || '',
      endData: task.endData || '',
    });
    // setDocuments(task.document ? JSON.parse(task.document) : []);
  };

  useEffect(() => {
    setEditing(false);
    resetFormData();
  }, [task]);

  const handleUploadDocument = async () => {
    try {
      setDocLoading(true);
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      // Store locally as preview
      setDocuments(prev => [
        ...prev,
        {
          uri: res[0].uri,
          type: res[0].type,
          name: res[0].name,
          isLocal: true, // mark new ones as not yet uploaded
        },
      ]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error(err);
        Alert.alert('Error', 'Failed to pick document');
      }
    } finally {
      setDocLoading(false);
    }
  };

  const handleDelete = async taskId => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);

              const response = await ApiService.delete('/task/delete-task', {
                params: {taskId},
              });

              if (response.success) {
                Alert.alert('Success', 'Task deleted successfully');
                navigation.navigate('HomeTabs', {screen: 'My Task'});
              } else {
                Alert.alert('Error', 'Something went wrong');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to delete task');
            } finally {
              setUpdating(false);
            }
          },
        },
      ],
    );
  };

  const handleUpdateTask = async () => {
    try {
      setUpdating(true);
      const formDataUpdate = new FormData();

      // Append task fields
      formDataUpdate.append('taskId', task.taskId);
      for (const key in formData) {
        if (key !== 'remarks' && key !== 'status') {
          formDataUpdate.append(key, formData[key]);
        }
      }

      // Append new remarks & status

      formDataUpdate.append('remarks', 'Verification Under Process');
      formDataUpdate.append('status', 'pending');

      // Append all documents (both local and already uploaded)
      documents.forEach(doc => {
        if (typeof doc === 'object' && doc.isLocal) {
          // Newly added document
          formDataUpdate.append('documents', {
            uri: doc.uri,
            type: doc.type,
            name: doc.name,
          });
        } else {
          // Existing document from backend
          const fileName = typeof doc === 'string' ? doc : doc.name;
          formDataUpdate.append('existingDocuments', fileName);
        }
      });

      console.log('Print start');

      Object.entries(formDataUpdate).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      // Single API call to update task
      const response = await ApiService.patch(
        'task/update-task',
        formDataUpdate,
      );

      if (response.success) {
        onTaskUpdated();
        console.log(response, 'update-task response');
        Alert.alert('Success', 'Task updated successfully');
      } else {
        Alert.alert('Error: Someting went wrong ');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteDocument = async fileName => {
    try {
      await ApiService.delete(
        `/tasks/${task.taskId}/delete-document/${fileName}`,
      );
      setDocuments(prev => prev.filter(doc => doc !== fileName));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete document');
    }
  };

  {
    updating && (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <Card style={styles.taskCard}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#333" />
        </TouchableOpacity>
        <View style={styles.actionIcons}>
          <TouchableOpacity
            onPress={async () => {
              if (editing) {
                await handleUpdateTask();
              } else {
                resetFormData();
              }
              setEditing(!editing);
            }}>
            <MaterialCommunityIcons
              name={editing ? 'check' : 'pencil'}
              size={24}
              color="#FF9800"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(task.taskId)}>
            <MaterialCommunityIcons name="delete" size={24} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Task Info */}
      <View style={styles.categoryDetailsCard}>
        <Text style={styles.taskIdText}>Task ID: {task.taskId}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Category: {task.Categories}</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  STATUS_COLORS[task.status?.toLowerCase()]?.backgroundColor,
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: STATUS_COLORS[task.status?.toLowerCase()]?.textColor},
              ]}>
              {task.status}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.subText}>Sub Category: {task.SubCategory}</Text>
          <Text style={styles.subText}>{task.daysLeft}</Text>
        </View>
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.subText}>
              Posted on: {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {editing ? (
            <TextInput
              mode="outlined"
              label="Amount"
              value={formData.amount.toString()}
              onChangeText={val => handleChange('amount', val)}
              style={styles.input}
            />
          ) : (
            <View style={styles.amountBox}>
              <Text style={styles.amountText}>
                ₹ {task.amount.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            // marginVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={[styles.label, {marginRight: 8}]}>Target Date:</Text>

          {editing ? (
            <TouchableOpacity
              style={[styles.inputField, {flex: 1}]}
              onPress={() => setOpenEndDate(true)}>
              <Text
                style={
                  formData.endData ? styles.inputText : styles.placeholderText
                }>
                {formData.endData || 'Select Date'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.subText}>
              {formData.endData || 'No date selected'}
            </Text>
          )}

          <DatePicker
            modal
            open={openEndDate}
            date={formData.endData ? new Date(formData.endData) : new Date()}
            mode="date"
            onConfirm={date => {
              setOpenEndDate(false);
              const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
              setFormData(prev => ({
                ...prev,
                endData: formattedDate,
              }));
            }}
            onCancel={() => setOpenEndDate(false)}
          />
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Description</Text>
        {editing ? (
          <TextInput
            mode="outlined"
            multiline
            value={formData.description}
            onChangeText={val => handleChange('description', val)}
            style={styles.descInput}
          />
        ) : (
          <Text style={styles.descriptionText}>
            {task.description || 'N/A'}
          </Text>
        )}
      </View>

      {/* Remarks */}
      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Remarks</Text>
        {/* {editing ? (
          <TextInput
            mode="outlined"
            multiline
            value={formData.remarks}
            onChangeText={val => handleChange('remarks', val)}
            style={styles.input}
          />
        ) : ( */}
        <Text style={styles.descriptionText}>{task.remarks || 'N/A'}</Text>
        {/* )} */}
      </View>

      {/* Documents */}
      <Text style={styles.sectionTitle}>Documents</Text>
      {editing && (
        <TouchableOpacity
          style={[styles.docButton, {backgroundColor: '#E8F0FE'}]}
          onPress={handleUploadDocument}>
          <MaterialCommunityIcons name="upload" size={24} color="#3F51B5" />
          <Text style={styles.docText}>Upload Document</Text>
        </TouchableOpacity>
      )}

      <View style={styles.documentContainer}>
        {docLoading && (
          <ActivityIndicator
            size="small"
            color="#3F51B5"
            style={{marginBottom: 8}}
          />
        )}
        {documents.length > 0 ? (
          documents.map((doc, index) => {
            // Support both { name: 'file.pdf' } and 'file.pdf'
            const fileName = typeof doc === 'string' ? doc : doc.name;
            const fileUri =
              typeof doc === 'string' ? `${IMAGE_URL}/${doc}` : doc.uri;

            let iconName = fileName?.match(/\.(png|jpg|jpeg)$/i)
              ? 'image'
              : fileName?.match(/\.pdf$/i)
              ? 'file-pdf-box'
              : 'file-document';

            return (
              <View key={index} style={styles.docRow}>
                <TouchableOpacity
                  style={styles.docButton}
                  onPress={() => Linking.openURL(fileUri)}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={28}
                    color="#3F51B5"
                  />
                  <Text style={styles.docText}>
                    {typeof doc === 'object' && doc.isLocal
                      ? `${fileName}`
                      : fileName}
                  </Text>
                </TouchableOpacity>

                {editing && (
                  <TouchableOpacity
                    onPress={() =>
                      setDocuments(prev =>
                        prev.filter((_, idx) => idx !== index),
                      )
                    }>
                    <MaterialCommunityIcons
                      name="delete"
                      size={22}
                      color="#f44336"
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.subText}>No documents available</Text>
        )}
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
  const [taskData, setTaskData] = useState(task);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, bidderRes, bidsRes] = await Promise.all([
        ApiService.get(`/task/get-task`, {taskId: task.taskId}), // Fetch updated task
        ApiService.get(`/Bids/users-by-task/${task.taskId}`),
        ApiService.get('/Bids/get-all-bids'),
      ]);

      setTaskData(taskRes.data);

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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [task.taskId]),
  );

  {
    loading && (
      <ActivityIndicator
        size="large"
        color="#3F51B5"
        style={{marginVertical: 10}}
      />
    );
  }

  if (selectedBidder) {
    return (
      <View style={styles.container}>
        <Button mode="outlined" onPress={() => setSelectedBidder(null)}>
          Back to Bidders
        </Button>
        <BidderDetails bidder={selectedBidder} task={taskData} />
      </View>
    );
  }

  return (
    <FlatList
      data={bidders}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <>
          <CategoryCard
            task={taskData}
            onBack={() => {}}
            onTaskUpdated={fetchData}
          />
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
