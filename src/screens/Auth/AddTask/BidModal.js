import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import styles from "./BidModalStyles"

const BidModal = ({visible, onClose, onSubmit}) => {
  const [bidOfAmount, setBidOfAmount] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [visible]);

  const handleFilePick = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const formatted = results.map(file => ({
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        name: file.name || `file-${Date.now()}`,
        type: file.type || 'application/octet-stream',
      }));

      setFiles(prev => [...prev, ...formatted]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('File pick error:', err);
        Alert.alert('Error', 'File selection failed.');
      }
    }
  };

  const openFile = async file => {
    try {
      const destPath = `${RNFS.DocumentDirectoryPath}/${file.name}`;
      await RNFS.copyFile(file.uri, destPath);
      await FileViewer.open(destPath);
    } catch (error) {
      console.error('File open error', error);
      Alert.alert('Error', 'Unable to open file');
    }
  };

  const handleSubmit = () => {
    onSubmit({bidOfAmount, description, files});
    setBidOfAmount('');
    setDescription('');
    setFiles([]);
    onClose();
  };

  const getFileIcon = fileName => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'file-pdf-box';
    if (['doc', 'docx'].includes(ext)) return 'file-word-box';
    if (['xls', 'xlsx'].includes(ext)) return 'file-excel-box';
    if (['ppt', 'pptx'].includes(ext)) return 'file-powerpoint-box';
    if (['mp4', 'mov'].includes(ext)) return 'file-video';
    if (['mp3'].includes(ext)) return 'file-music';
    return 'file';
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, {transform: [{translateY: slideAnim}]}]}>
          <ScrollView>
            {/* Amount */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Bid Amount:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={bidOfAmount}
                onChangeText={setBidOfAmount}
              />
            </View>

            {/* Description */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Description:</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter your bid description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* File Upload */}
            <View style={styles.fileRow}>
              <Icon name="file-upload" size={24} color="#444" />
              <Text style={styles.fileText}>
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : 'Upload Bid Files'}
              </Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={handleFilePick}>
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            </View>

            {/* File List */}
            {files.map((file, index) => {
              const isImage =
                file.type?.includes('image') ||
                ['jpg', 'jpeg', 'png', 'gif'].includes(file.name.split('.').pop().toLowerCase());

              return (
                <View key={index} style={styles.fileItem}>
                  <Icon name={getFileIcon(file.name)} size={22} color="#1D9BFB" style={{marginRight: 8}} />

                  <TouchableOpacity style={{flex: 1}} onPress={() => openFile(file)}>
                    {isImage ? (
                      <Image
                        source={{uri: file.uri}}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 4,
                          resizeMode: 'cover',
                        }}
                      />
                    ) : (
                      <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                        {file.name}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      const updated = [...files];
                      updated.splice(index, 1);
                      setFiles(updated);
                    }}>
                    <Icon name="close-circle" size={22} color="red" />
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Add Bid</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BidModal;
