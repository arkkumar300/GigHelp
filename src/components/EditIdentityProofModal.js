import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

  // Inside your component, before mapping over safeIdentityProof:
  const normalizedProofs = (
    Array.isArray(safeIdentityProof) ? safeIdentityProof : []
  ).map(item => {
    // If already has uri (picked file), leave it
    if (item.uri) return item;

    // Otherwise, build uri and name from file field
    const fileName = item.file;
    const uri = `${IMAGE_URL}/${fileName}`;
    // Infer MIME type if possible
    const ext = fileName.split('.').pop().toLowerCase();
    const type = ext.match(/(png|jpe?g|gif)$/)
      ? `image/${ext === 'jpg' ? 'jpeg' : ext}`
      : `application/${ext}`;

    console.log(uri, fileName, type, 'image link generation');

    return {
      uri,
      name: fileName,
      type,
      // preserve other metadata if needed
      ...item,
    };
  });

  const removeFile = index => {
    const updated = [...safeIdentityProof];
    updated.splice(index, 1);
    setIdentityProof(updated);
  };

  // const addFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //       allowMultiSelection: true,
  //     });

  //     setIdentityProof(prev => {
  //       const current =
  //         typeof prev === 'string'
  //           ? JSON.parse(prev)
  //           : Array.isArray(prev)
  //           ? prev
  //           : [];
  //       return [...current, ...res];
  //     });
  //   } catch (err) {
  //     if (!DocumentPicker.isCancel(err)) {
  //       Alert.alert('Error', 'Failed to pick file');
  //     }
  //   }
  // };

  const addFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const oversizedFiles = res.filter(file => file.size > MAX_FILE_SIZE);
      const validFiles = res.filter(file => file.size <= MAX_FILE_SIZE);

      if (oversizedFiles.length > 0) {
        const names = oversizedFiles.map(f => f.name || 'Unnamed').join(', ');
        Alert.alert('File too large', `These files exceed 10MB: ${names}`);
      }

      if (validFiles.length > 0) {
        setIdentityProof(prev => {
          const current =
            typeof prev === 'string'
              ? JSON.parse(prev)
              : Array.isArray(prev)
              ? prev
              : [];
          return [...current, ...validFiles];
        });
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('userId', user?.userId);
      formData.append('status', 'Pending');
      formData.append('remarks', 'Verification under process');

      safeIdentityProof.forEach(item => {
        if (typeof item === 'object') {
          if (item.uri && item.uri.startsWith('content://')) {
            formData.append('identityProof', {
              uri: item.uri,
              name: item.name,
              type: item.type,
            });
          } else if (item.file) {
            formData.append('existingIdentityProofs[]', JSON.stringify(item));
          }
        }
      });

      const response = await ApiService.patch(
        `/systemuser/user-update`,
        formData,
      );

      onUpdate(response.data);
      Alert.alert('Success', 'Identity proof updated');
      onDismiss();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to update identity proof');
    } finally {
      setLoading(false);
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
    console.log('check 1');
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

      if (err.message.includes('No app associated')) {
        Alert.alert(
          'Unsupported File',
          'No app found on your device to open this file type.',
        );
      } else {
        Alert.alert('Error', 'Failed to preview file');
      }
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
            {normalizedProofs.map((proof, index) => {
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
            })}
          </ScrollView>

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
            disabled={loading}
            onPress={addFile}>
            <Icon name="plus" size={18} color="#1D9BFB" />
            <Text style={{color: '#1D9BFB', marginLeft: 8}}>Add File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#A9A9A9' : '#1D9BFB',
              paddingVertical: 10,
              borderRadius: 6,
              marginTop: 16,
              opacity: loading ? 0.6 : 1, 
            }}>
            {loading ? (
              <ActivityIndicator size="large" color="#1D9BFB" />
            ) : (
              <Text style={{color: '#fff', textAlign: 'center'}}>Update</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* {loading && (
          <View
            style={{
              // ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
            }}>
            <ActivityIndicator size="large" color="#1D9BFB" />
          </View>
        )} */}
      </Modal>

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
