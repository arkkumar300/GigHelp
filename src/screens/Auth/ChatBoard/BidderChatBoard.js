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
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import ApiService from '../../../services/ApiService';
import { loadData } from '../../../Utils/appData';

const BidderChatBoard = ({task}) => {
  //   const { task } = route.params;
  console.log(task, 'Task');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const chatEndRef = useRef();
  //   const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const senderId = userId;
  const receiverId = Number(task?.taskUserId);
  console.log(messages, 'msssss');

  useEffect(() => {
    console.log('test 1');
    const loadUser = async () => {
      console.log('test 2');
      try {
        const user = await loadData('userInfo'); // this likely fails
        console.log('test 3');
        console.log(user, 'user Info');
        if (user && user.userId) {
          setUserId(user.userId);
          fetchMessages(user.userId);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    loadUser();
  }, []);

  // useEffect(() => {
  //   if (userId) {
  //     console.log("adhsdjasasasdsrv")
  //     fetchMessages(userId);
  //   }
  // }, [userId]);

  const fetchMessages = async uid => {
    try {
      console.log('selectsb1');
      const res = await ApiService.get(
        `/chatbox/conversation/${receiverId}?userId=${uid}`,
        {
          userId,
          receiverId: Number(task?.taskUserId),
        },
      );
      console.log(res, 'ssasasasasas');
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err.message);
    }
  };

  const sendMessage = async () => {
    // if (!user) return;
    if (!input && !file) return;

    if (file) {
      await sendMessageFile(file, input);
    } else {
      try {
        console.log(
          {
            senderId: userId,
            receiverId,
            taskId: task?.taskId,
            message: input,
            //   file: fileToSend,
          },
          'Testststststs',
        );

        await ApiService.post('/chatbox/send', {
          senderId: userId,
          receiverId,
          taskId: task?.taskId,
          message: input,
        });
        setInput('');
        setFile(null);
        fetchMessages();
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const sendMessageFile = async (fileToSend, messageText) => {
    // if (!user) return;
    try {
      const formData = new FormData();
      formData.append('senderId', userId);
      formData.append('receiverId', receiverId);
      formData.append('taskId', task?.taskId);
      formData.append('message', messageText || fileToSend.name);
      formData.append('file', {
        uri: fileToSend.uri,
        name: fileToSend.name,
        type: fileToSend.type,
      });

      await ApiService.post('/chatbox/send', formData, {});

      setInput('');
      setFile(null);
      fetchMessages();
    } catch (err) {
      console.error('Error sending file:', err.message);
    }
  };

  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('DocumentPicker error:', err);
      }
    }
  };

  const renderItem = ({item}) => {
    const isSender = item.senderId === senderId;
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.right : styles.left,
        ]}>
        <Text style={styles.messageText}>{item.message}</Text>

        {item.fileUrl && item.fileType?.startsWith('image') && (
          <Image source={{uri: item.fileUrl}} style={styles.image} />
        )}

        {item.fileUrl && item.fileType?.startsWith('video') && (
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(item.fileUrl)}>
            View Video
          </Text>
        )}

        {item.fileUrl && item.fileType?.startsWith('application') && (
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(item.fileUrl)}>
            Download File
          </Text>
        )}

        <Text style={styles.time}>{time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.header}>Chat with {receiverId}</Text>

      <View style={styles.chatContainer}>
        <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        ref={chatEndRef}
        onContentSizeChange={() =>
          chatEndRef.current?.scrollToEnd({animated: true})
        }
      />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={handlePickFile} style={styles.iconButton}>
          <Icon name="paperclip" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.iconButton}>
          <Icon name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BidderChatBoard;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#2196f3',
    color: '#fff',
    padding: 12,
    textAlign: 'center',
  },
  messageList: {padding: 12},
  messageContainer: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
    maxWidth: '75%',
    backgroundColor: '#f0f0f0',
  },
  right: {alignSelf: 'flex-end', backgroundColor: '#DCF8C6'},
  left: {alignSelf: 'flex-start', backgroundColor: '#fff'},
  messageText: {fontSize: 16},
  time: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  iconButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
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
});
