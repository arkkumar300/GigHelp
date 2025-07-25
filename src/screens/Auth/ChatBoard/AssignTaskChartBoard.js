import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import ApiService from '../../../services/ApiService';
import {loadData} from '../../../Utils/appData';
import RNFS from 'react-native-fs';
import getEnvVars from '../../../config/env';

// import RNFetchBlob from 'rn-fetch-blob';

const AssignTaskChatBoard = ({task}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [file, setFile] = useState(null);
  const chatEndRef = useRef();
  const [userId, setUserId] = useState(null);
  console.log(task, 'task chat');
  console.log(selectedFiles, 'file picked');

  useEffect(() => {
    const loadUserAndMessages = async () => {
      const user = await loadData('userInfo');
      setUserId(user.userId);
      console.log(user, 'user Info');

      if (user && user.userId && task?.userId) {
        fetchMessages(user.userId);
      }
    };

    if (task?.userId) {
      loadUserAndMessages();
    }
  }, [task?.userId]);

  const fetchMessages = async uid => {
    console.log(task.userId, uid, 'idsssss');
    try {
      const res = await ApiService.get(
        `/chatbox/conversation/${task?.userId}?userId=${uid}`,
      );
      console.log(res, 'messages');
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // const fetchMessages = async () => {
  //   try {
  //     const res = await ApiService.get(
  //       `/chatbox/conversation/${task?.taskId}?userId=${userId}`,
  //       // {
  //       //   userId: userId,
  //       //   receiverId: Number(task?.taskUserId),
  //       // },
  //     );
  //     setMessages(res.data || []);
  //   } catch (err) {
  //     console.error('Error fetching messages:', err);
  //   }
  //   r;
  // };

  const sendMessage = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const receiverId = Number(task?.userId);
      const taskId = Number(task?.bidDetails?.taskId);
      console.log(userId, taskId, receiverId, 'idssssss');

      if (!userId || !taskId || !receiverId) {
        console.error('Missing required fields');
        return;
      }

      const formData = new FormData();
      formData.append('senderId', userId);
      formData.append('receiverId', receiverId);
      formData.append('taskId', taskId);

      if (input) {
        formData.append('message', input);
      } else if (selectedFiles.length > 0) {
        formData.append('message', selectedFiles[0].name);
      }

      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          const path = file.uri.startsWith('file://')
            ? file.uri
            : `file://${file.uri}`;
          formData.append('file', {
            uri: file.uri,
            type: file.type,
            name: file.name,
          });
        });
      }

      console.log('--- FormData ---');
      for (let [key, value] of formData._parts) {
        console.log(`${key}:`, value);
      }

      await ApiService.post('/chatbox/send', formData);

      setInput('');
      setSelectedFiles([]);
      fetchMessages(userId);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      setSelectedFiles(prevFiles => [...prevFiles, ...res]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.warn('File Picker Error:', err);
      }
    }
  };

  const renderItem = ({item}) => {
    const isSender = Number(item.senderId) === Number(userId);
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const {API_BASE_URL} = getEnvVars();
    const IMAGE_URL = `${API_BASE_URL}/images/chat`;
    console.log(`${IMAGE_URL}/${item.fileUrl}`, 'sdsdbhhbkj');

    const getFileExtension = url => {
      return url?.split('.').pop().toLowerCase();
    };

    const getFileName = url => {
      return url?.split('/').pop();
    };

    const fileType = item.fileType || '';
    const fileUrl = item.fileUrl;

    return (
      <View
        style={[styles.messageRow, isSender ? styles.rowReverse : styles.row]}>
        <Image
          source={{
            uri: item?.senderProfilePic
              ? `http://localhost:3001/storage/userdp/${item.senderProfilePic}`
              : 'https://ui-avatars.com/api/?name=User',
          }}
          style={styles.avatar}
        />
        <View
          style={[
            styles.messageContainer,
            isSender ? styles.right : styles.left,
          ]}>
          {item.message ? (
            <Text style={styles.messageText}>{item.message}</Text>
          ) : null}

          {fileUrl && fileType.startsWith('image') && (
            <Image
              source={{uri: `${IMAGE_URL}/${item.fileUrl}`}}
              style={styles.image}
            />
          )}

          {fileUrl && fileType.startsWith('video') && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`${IMAGE_URL}/${item.fileUrl}`)}>
              <Text style={styles.link}>▶ Watch Video</Text>
            </TouchableOpacity>
          )}

          {fileUrl &&
            !fileType.startsWith('image') &&
            !fileType.startsWith('video') && (
              <View style={styles.pdfContainer}>
                <Text style={styles.pdfName}>
                  {getFileName(`${IMAGE_URL}/${item.fileUrl}`)}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`${IMAGE_URL}/${item.fileUrl}`)
                  }>
                  <Text style={styles.link}>📄 Download File</Text>
                </TouchableOpacity>
              </View>
            )}

          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    );
  };

  const removeFile = index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <Text style={styles.header}>Chat with {task?.userName}</Text>

      <View style={{flexGrow: 1, maxHeight: 400}}>
        <FlatList
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          ref={chatEndRef}
          onContentSizeChange={() =>
            chatEndRef.current?.scrollToEnd({animated: true})
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {selectedFiles.length > 0 && (
        <View style={styles.previewContainer}>
          {selectedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              {file.type?.startsWith('image') ? (
                <Image source={{uri: file.uri}} style={styles.imagePreview} />
              ) : (
                <Text style={styles.pdfPreviewText}>📄 {file.name}</Text>
              )}
              <TouchableOpacity onPress={() => removeFile(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={handlePickFile} style={styles.iconButton}>
          <Icon name="paperclip" size={20} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.iconButton}>
          <Icon name="send" size={20} color="blue" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AssignTaskChatBoard;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingBottom: 30},
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#2196f3',
    color: '#fff',
    padding: 12,
    textAlign: 'center',
  },
  messageList: {padding: 0},

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  right: {
    backgroundColor: '#2196f3',
    alignSelf: 'flex-end',
  },
  left: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  pdfContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  pdfName: {
    color: '#000',
    marginBottom: 4,
    fontWeight: 'bold',
  },

  messageText: {fontSize: 16},
  time: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 8,
    maxHeight: 120,
    fontSize: 16,
    color: '#000000',
  },

  iconButton: {
    padding: 6,
    marginHorizontal: 2,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  link: {
    color: 'blue',
    marginTop: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  fileItem: {
    marginRight: 10,
    alignItems: 'center',
    maxWidth: 100,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  pdfPreviewText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  removeText: {
    color: 'red',
    fontSize: 12,
  },
});
