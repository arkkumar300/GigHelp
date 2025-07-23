import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Modal as RNModal,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import ApiService from '../services/ApiService';

const isImage = (type = '') => type.startsWith('image/');

const EditIdentityProofModal = ({
  visible,
  onDismiss,
  user,
  identityProof,
  setIdentityProof,
  onUpdate,
  IMAGE_URL,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState('');

  console.log(identityProof, 'profffff');

  const safeIdentityProof = (() => {
    try {
      if (typeof identityProof === 'string') {
        return JSON.parse(identityProof);
      }
      if (Array.isArray(identityProof)) {
        return identityProof;
      }
      return [];
    } catch (e) {
      console.warn('Invalid identityProof format:', identityProof);
      return [];
    }
  })();

  const removeFile = index => {
    const updated = [...safeIdentityProof];
    updated.splice(index, 1);
    setIdentityProof(updated);
  };

  const addFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      setIdentityProof(prev => {
        const current =
          typeof prev === 'string'
            ? JSON.parse(prev)
            : Array.isArray(prev)
            ? prev
            : [];
        return [...current, ...res];
      });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.entries(user).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          formData.append(key, value);
        }
      });

      safeIdentityProof.forEach(item => {
        if (typeof item === 'object' && item.uri) {
          formData.append('identityProof', {
            uri: item.uri,
            name: item.name,
            type: item.type,
          });
        }
      });

      // 👇 Print all FormData key-value pairs
      for (let pair of formData._parts) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      console.log('completed');

      const response = await ApiService.patch(
        `/systemuser/user-update`,
        formData,
        // {headers: {'Content-Type': 'multipart/form-data'}},
      );

      onUpdate(response.data);
      Alert.alert('Success', 'Identity proof updated');
      onDismiss();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to update identity proof');
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to download files',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const downloadFile = async uri => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot access storage');
        return;
      }

      const fileName = uri.split('/').pop();
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: uri,
        toFile: path,
      }).promise;

      if (result.statusCode === 200) {
        Alert.alert('Success', `Downloaded to: ${path}`);
      } else {
        throw new Error('Failed with status ' + result.statusCode);
      }
    } catch (err) {
      console.error('Download failed:', err);
      Alert.alert('Download Failed', err.message);
    }
  };

  const handlePreview = async uri => {
    try {
      let localPath = uri;

      if (/^https?:\/\//.test(uri)) {
        const fileName = uri.split('/').pop();
        const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        const result = await RNFS.downloadFile({
          fromUrl: uri,
          toFile: destPath,
        }).promise;

        if (result.statusCode !== 200) throw new Error('File download failed');

        localPath = destPath;
      }

      await FileViewer.open(localPath, {showOpenWithDialog: true});
    } catch (err) {
      console.log('Preview failed:', err);
      Alert.alert('Error', 'Failed to preview file');
    }
  };

  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onDismiss}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '90%',
          }}>
          <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onDismiss}>
            <Icon name="close" size={20} />
          </TouchableOpacity>

          <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 16}}>
            Identity Proofs
          </Text>

          <ScrollView style={{marginBottom: 16}}>
            {(Array.isArray(safeIdentityProof) ? safeIdentityProof : []).map(
              (proof, index) => {
                const uri =
                  typeof proof === 'string'
                    ? proof.startsWith('http')
                      ? proof
                      : `${IMAGE_URL}/${proof}`
                    : proof?.uri;

                if (!uri) return null;

                const mimeType =
                  typeof proof === 'object' && proof?.type
                    ? proof.type
                    : uri.includes('.')
                    ? `application/${uri.split('.').pop()}`
                    : 'application/octet-stream';

                const isImageFile = isImage(mimeType);

                return (
                  <View
                    key={index}
                    style={{marginBottom: 16, position: 'relative'}}>
                    <TouchableOpacity
                      onPress={() => handlePreview(uri)}
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        overflow: 'hidden',
                        padding: 10,
                        backgroundColor: '#f9f9f9',
                      }}>
                      {isImageFile ? (
                        <Image
                          source={{uri}}
                          style={{width: '100%', height: 180, borderRadius: 8}}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Icon
                            name="file-document-outline"
                            size={24}
                            color="#1D9BFB"
                          />
                          <Text style={{marginLeft: 10}}>
                            {proof?.name || uri.split('/').pop()}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    <View
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        flexDirection: 'row',
                        columnGap: 8,
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        padding: 4,
                        alignItems: 'center',
                      }}>
                      {typeof proof === 'string' && (
                        <TouchableOpacity onPress={() => downloadFile(uri)}>
                          <Icon name="download" size={20} color="#1D9BFB" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => removeFile(index)}>
                        <Icon name="close-circle" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              },
            )}
          </ScrollView>

          {/* Add + Submit */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#1D9BFB',
              borderWidth: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
              alignSelf: 'flex-start',
            }}
            onPress={addFile}>
            <Icon name="plus" size={18} color="#1D9BFB" />
            <Text style={{color: '#1D9BFB', marginLeft: 8}}>Add File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#1D9BFB',
              paddingVertical: 10,
              borderRadius: 6,
              marginTop: 16,
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>Update</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Fullscreen preview only for images (if still desired) */}
      <RNModal visible={previewVisible} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setPreviewVisible(false)}>
          <Image
            source={{uri: previewUri}}
            style={{width: '90%', height: '80%', borderRadius: 12}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </RNModal>
    </>
  );
};

export default EditIdentityProofModal;
