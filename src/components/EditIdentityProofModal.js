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
import DropDownPicker from 'react-native-dropdown-picker';

const isImage = (type = '') => type.startsWith('image/');

const proofTypeOptions = [
  {label: 'Aadhaar Card', value: 'Aadhaar'},
  {label: 'PAN Card', value: 'PAN'},
  {label: 'Ration Card', value: 'Ration'},
  {label: 'Driving License', value: 'Driving License'},
  {label: 'Passport', value: 'Passport'},
];

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
  const [newFiles, setNewFiles] = useState([]);
  const [openPickerIndex, setOpenPickerIndex] = useState(null);

  const [selectingProofType, setSelectingProofType] = useState(false);
  const [selectedProofType, setSelectedProofType] = useState(null);
  const [tempProofDropdownOpen, setTempProofDropdownOpen] = useState(false);

  const safeIdentityProof = (() => {
    try {
      if (typeof identityProof === 'string') return JSON.parse(identityProof);
      if (Array.isArray(identityProof)) return identityProof;
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
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const filesWithTypes = results.map(file => ({
        ...file,
        proofType: '',
        status: 'Pending',
        description: '',
      }));

      setNewFiles(prev => [...prev, ...filesWithTypes]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleStartAddFile = () => {
    setSelectingProofType(true);
  };

  const handlePickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });

      const filesWithTypes = results.map(file => ({
        ...file,
        proofType: selectedProofType,
        status: 'Pending',
        description: '',
      }));

      setNewFiles(prev => [...prev, ...filesWithTypes]);
      setSelectingProofType(false);
      setSelectedProofType(null);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
      setSelectingProofType(false);
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

      newFiles.forEach(file => {
        if (!file.proofType)
          throw new Error('Please select proof type for all files');

        formData.append('identityProof', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        });

        formData.append('proofTypes[]', file.proofType);

        // Default description for 'Pending' status
        const defaultDescription = 'Verification under process';
        formData.append(
          'proofDescriptions[]',
          file.description?.trim() || defaultDescription,
        );
      });

      const response = await ApiService.patch(
        `/systemuser/user-update`,
        formData,
      );
      onUpdate(response.data);
      Alert.alert('Success', 'Identity proof updated');
      setNewFiles([]);
      onDismiss();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.message || 'Failed to update identity proof');
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
            {[...safeIdentityProof, ...newFiles].map((proof, index) => {
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
                  <Text style={{fontWeight: 'bold', marginBottom: 4}}>
                    {proof.proofType || 'Select Proof Type'}
                  </Text>

                  {proof.status && (
                    <Text
                      style={{
                        color:
                          proof.status === 'Approved'
                            ? 'green'
                            : proof.status === 'Rejected'
                            ? 'red'
                            : 'orange',
                      }}>
                      {proof.status}
                    </Text>
                  )}
                  {proof.description && (
                    <Text style={{fontSize: 12, color: '#666'}}>
                      {proof.description}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={() => handlePreview(uri)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 10,
                      backgroundColor: '#f9f9f9',
                      marginTop: 4,
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

                  {proof.uri && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 8,
                        justifyContent: 'space-between',
                      }}>
                      {proof.uri.startsWith('http') && (
                        <TouchableOpacity onPress={() => downloadFile(uri)}>
                          <Icon name="download" size={20} color="#1D9BFB" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => removeFile(index)}>
                        <Icon name="close-circle" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  )}

                  {newFiles.includes(proof) && (
                    <View
                      style={{
                        marginTop: 8,
                        zIndex: openPickerIndex === index ? 1000 : 1,
                      }}>
                      <DropDownPicker
                        open={openPickerIndex === index}
                        value={proof.proofType}
                        items={proofTypeOptions}
                        setOpen={open =>
                          setOpenPickerIndex(open ? index : null)
                        }
                        setValue={callback => {
                          const value = callback(proof.proofType);
                          proof.proofType = value;
                          setNewFiles([...newFiles]);
                        }}
                        setItems={() => {}}
                        placeholder="Select Proof Type"
                        style={{
                          marginBottom: openPickerIndex === index ? 200 : 0,
                        }}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}

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
              marginTop: 10,
            }}
            onPress={handleStartAddFile}>
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

      <RNModal visible={selectingProofType} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPressOut={() => {
            setSelectingProofType(false);
            setSelectedProofType(null);
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              zIndex: 9999,
            }}>
            <Text style={{fontWeight: 'bold', marginBottom: 10}}>
              Select Identity Proof Type
            </Text>

            <DropDownPicker
              open={tempProofDropdownOpen}
              value={selectedProofType}
              items={proofTypeOptions}
              setOpen={setTempProofDropdownOpen}
              setValue={setSelectedProofType}
              setItems={() => {}}
              placeholder="Choose proof type"
              containerStyle={{marginBottom: 20, zIndex: 9999}}
            />

            <TouchableOpacity
              disabled={!selectedProofType}
              onPress={handlePickDocument}
              style={{
                backgroundColor: selectedProofType ? '#1D9BFB' : '#ccc',
                paddingVertical: 10,
                borderRadius: 6,
                marginTop: 10,
              }}>
              <Text style={{color: '#fff', textAlign: 'center'}}>
                Select Document
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </RNModal>

      {/* <RNModal visible={previewVisible} transparent animationType="fade">
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
      </RNModal> */}
    </>
  );
};

export default EditIdentityProofModal;

// import React, {useState} from 'react';
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   Image,
//   ScrollView,
//   Modal as RNModal,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import Modal from 'react-native-modal';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import DropDownPicker from 'react-native-dropdown-picker';
// import ApiService from '../services/ApiService';

// const isImage = (type = '') => type.startsWith('image/');

// const EditIdentityProofModal = ({
//   visible,
//   onDismiss,
//   user,
//   identityProof,
//   setIdentityProof,
//   onUpdate,
//   IMAGE_URL,
// }) => {
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewUri, setPreviewUri] = useState('');
//   const [proofType, setProofType] = useState(null);
//   const [dropOpen, setDropOpen] = useState(false);
//   const [items, setItems] = useState([
//     {label: 'Aadhaar Card', value: 'Aadhaar Card'},
//     {label: 'PAN Card', value: 'PAN Card'},
//     {label: 'Voter ID', value: 'Voter ID'},
//     {label: 'Driving License', value: 'Driving License'},
//   ]);

//   const safeIdentityProof = (() => {
//     try {
//       if (typeof identityProof === 'string') {
//         return JSON.parse(identityProof);
//       }
//       if (Array.isArray(identityProof)) {
//         return identityProof;
//       }
//       return [];
//     } catch (e) {
//       console.warn('Invalid identityProof format:', identityProof);
//       return [];
//     }
//   })();

//   const removeFile = index => {
//     const updated = [...safeIdentityProof];
//     updated.splice(index, 1);
//     setIdentityProof(updated);
//   };

//   const addFile = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//         allowMultiSelection: true,
//       });

//       setIdentityProof(prev => {
//         const current =
//           typeof prev === 'string'
//             ? JSON.parse(prev)
//             : Array.isArray(prev)
//             ? prev
//             : [];
//         return [...current, ...res];
//       });
//     } catch (err) {
//       if (!DocumentPicker.isCancel(err)) {
//         Alert.alert('Error', 'Failed to pick file');
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     if (!proofType) {
//       Alert.alert('Validation', 'Please select proof type.');
//       return;
//     }

//     try {
//       const formData = new FormData();

//       Object.entries(user).forEach(([key, value]) => {
//         if (typeof value !== 'object' && value !== null) {
//           formData.append(key, value);
//         }
//       });

//       formData.append('proofType', proofType);

//       safeIdentityProof.forEach(item => {
//         if (typeof item === 'object' && item.uri) {
//           formData.append('identityProof', {
//             uri: item.uri,
//             name: item.name,
//             type: item.type,
//           });
//         }
//       });

//       const response = await ApiService.patch(`/systemuser/user-update`, formData);

//       onUpdate(response.data);
//       Alert.alert('Success', 'Identity proof updated');
//       onDismiss();
//     } catch (err) {
//       console.log(err);
//       Alert.alert('Error', 'Failed to update identity proof');
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to storage to download files',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const downloadFile = async uri => {
//     try {
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Cannot access storage');
//         return;
//       }

//       const fileName = uri.split('/').pop();
//       const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

//       const result = await RNFS.downloadFile({
//         fromUrl: uri,
//         toFile: path,
//       }).promise;

//       if (result.statusCode === 200) {
//         Alert.alert('Success', `Downloaded to: ${path}`);
//       } else {
//         throw new Error('Failed with status ' + result.statusCode);
//       }
//     } catch (err) {
//       console.error('Download failed:', err);
//       Alert.alert('Download Failed', err.message);
//     }
//   };

//   const handlePreview = async uri => {
//     try {
//       let localPath = uri;

//       if (/^https?:\/\//.test(uri)) {
//         const fileName = uri.split('/').pop();
//         const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

//         const result = await RNFS.downloadFile({
//           fromUrl: uri,
//           toFile: destPath,
//         }).promise;

//         if (result.statusCode !== 200) throw new Error('File download failed');

//         localPath = destPath;
//       }

//       await FileViewer.open(localPath, {showOpenWithDialog: true});
//     } catch (err) {
//       console.log('Preview failed:', err);
//       Alert.alert('Error', 'Failed to preview file');
//     }
//   };

//   return (
//     <>
//       <Modal
//         isVisible={visible}
//         onBackdropPress={onDismiss}
//         style={{justifyContent: 'flex-end', margin: 0}}>
//         <View
//           style={{
//             backgroundColor: '#fff',
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//             padding: 20,
//             maxHeight: '90%',
//           }}>
//           <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onDismiss}>
//             <Icon name="close" size={20} />
//           </TouchableOpacity>

//           <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 16}}>
//             Identity Proofs
//           </Text>

//           <DropDownPicker
//             open={dropOpen}
//             value={proofType}
//             items={items}
//             setOpen={setDropOpen}
//             setValue={setProofType}
//             setItems={setItems}
//             placeholder="Select Proof Type"
//             style={{marginBottom: 16, borderColor: '#ccc'}}
//             dropDownContainerStyle={{borderColor: '#ccc'}}
//           />

//           <ScrollView style={{marginBottom: 16}}>
//             {(Array.isArray(safeIdentityProof) ? safeIdentityProof : []).map(
//               (proof, index) => {
//                 const uri =
//                   typeof proof === 'string'
//                     ? proof.startsWith('http')
//                       ? proof
//                       : `${IMAGE_URL}/${proof}`
//                     : proof?.uri;

//                 if (!uri) return null;

//                 const mimeType =
//                   typeof proof === 'object' && proof?.type
//                     ? proof.type
//                     : uri.includes('.')
//                     ? `application/${uri.split('.').pop()}`
//                     : 'application/octet-stream';

//                 const isImageFile = isImage(mimeType);

//                 return (
//                   <View
//                     key={index}
//                     style={{marginBottom: 16, position: 'relative'}}>
//                     <TouchableOpacity
//                       onPress={() => handlePreview(uri)}
//                       style={{
//                         borderWidth: 1,
//                         borderColor: '#ccc',
//                         borderRadius: 8,
//                         overflow: 'hidden',
//                         padding: 10,
//                         backgroundColor: '#f9f9f9',
//                       }}>
//                       {isImageFile ? (
//                         <Image
//                           source={{uri}}
//                           style={{width: '100%', height: 180, borderRadius: 8}}
//                           resizeMode="cover"
//                         />
//                       ) : (
//                         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                           <Icon
//                             name="file-document-outline"
//                             size={24}
//                             color="#1D9BFB"
//                           />
//                           <Text style={{marginLeft: 10}}>
//                             {proof?.name || uri.split('/').pop()}
//                           </Text>
//                         </View>
//                       )}
//                     </TouchableOpacity>

//                     <View
//                       style={{
//                         position: 'absolute',
//                         bottom: 6,
//                         right: 6,
//                         flexDirection: 'row',
//                         columnGap: 8,
//                         backgroundColor: '#fff',
//                         borderRadius: 20,
//                         padding: 4,
//                         alignItems: 'center',
//                       }}>
//                       {typeof proof === 'string' && (
//                         <TouchableOpacity onPress={() => downloadFile(uri)}>
//                           <Icon name="download" size={20} color="#1D9BFB" />
//                         </TouchableOpacity>
//                       )}
//                       <TouchableOpacity onPress={() => removeFile(index)}>
//                         <Icon name="close-circle" size={20} color="red" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 );
//               },
//             )}
//           </ScrollView>

//           <TouchableOpacity
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               borderColor: '#1D9BFB',
//               borderWidth: 1,
//               paddingVertical: 8,
//               paddingHorizontal: 12,
//               borderRadius: 6,
//               alignSelf: 'flex-start',
//             }}
//             onPress={addFile}>
//             <Icon name="plus" size={18} color="#1D9BFB" />
//             <Text style={{color: '#1D9BFB', marginLeft: 8}}>Add File</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleSubmit}
//             style={{
//               backgroundColor: '#1D9BFB',
//               paddingVertical: 10,
//               borderRadius: 6,
//               marginTop: 16,
//             }}>
//             <Text style={{color: '#fff', textAlign: 'center'}}>Update</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <RNModal visible={previewVisible} transparent animationType="fade">
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0,0,0,0.9)',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//           onPress={() => setPreviewVisible(false)}>
//           <Image
//             source={{uri: previewUri}}
//             style={{width: '90%', height: '80%', borderRadius: 12}}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </RNModal>
//     </>
//   );
// };

// export default EditIdentityProofModal;

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   Image,
//   ScrollView,
//   Modal as RNModal,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import Modal from 'react-native-modal';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import ApiService from '../services/ApiService';

// const isImage = (type = '') => type.startsWith('image/');

// const EditIdentityProofModal = ({
//   visible,
//   onDismiss,
//   user,
//   identityProof,
//   setIdentityProof,
//   onUpdate,
//   IMAGE_URL,
// }) => {
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewUri, setPreviewUri] = useState('');

//   console.log(identityProof, 'profffff');

//   const safeIdentityProof = (() => {
//     try {
//       if (typeof identityProof === 'string') {
//         return JSON.parse(identityProof);
//       }
//       if (Array.isArray(identityProof)) {
//         return identityProof;
//       }
//       return [];
//     } catch (e) {
//       console.warn('Invalid identityProof format:', identityProof);
//       return [];
//     }
//   })();

//   const removeFile = index => {
//     const updated = [...safeIdentityProof];
//     updated.splice(index, 1);
//     setIdentityProof(updated);
//   };

//   const addFile = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//         allowMultiSelection: true,
//       });

//       setIdentityProof(prev => {
//         const current =
//           typeof prev === 'string'
//             ? JSON.parse(prev)
//             : Array.isArray(prev)
//             ? prev
//             : [];
//         return [...current, ...res];
//       });
//     } catch (err) {
//       if (!DocumentPicker.isCancel(err)) {
//         Alert.alert('Error', 'Failed to pick file');
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();

//       Object.entries(user).forEach(([key, value]) => {
//         if (typeof value !== 'object' && value !== null) {
//           formData.append(key, value);
//         }
//       });

//       safeIdentityProof.forEach(item => {
//         if (typeof item === 'object' && item.uri) {
//           formData.append('identityProof', {
//             uri: item.uri,
//             name: item.name,
//             type: item.type,
//           });
//         }
//       });

//       // 👇 Print all FormData key-value pairs
//       for (let pair of formData._parts) {
//         console.log(`${pair[0]}:`, pair[1]);
//       }

//       console.log('completed');

//       const response = await ApiService.patch(
//         `/systemuser/user-update`,
//         formData,
//         // {headers: {'Content-Type': 'multipart/form-data'}},
//       );

//       onUpdate(response.data);
//       Alert.alert('Success', 'Identity proof updated');
//       onDismiss();
//     } catch (err) {
//       console.log(err);
//       Alert.alert('Error', 'Failed to update identity proof');
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to storage to download files',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const downloadFile = async uri => {
//     try {
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Cannot access storage');
//         return;
//       }

//       const fileName = uri.split('/').pop();
//       const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

//       const result = await RNFS.downloadFile({
//         fromUrl: uri,
//         toFile: path,
//       }).promise;

//       if (result.statusCode === 200) {
//         Alert.alert('Success', `Downloaded to: ${path}`);
//       } else {
//         throw new Error('Failed with status ' + result.statusCode);
//       }
//     } catch (err) {
//       console.error('Download failed:', err);
//       Alert.alert('Download Failed', err.message);
//     }
//   };

//   const handlePreview = async uri => {
//     try {
//       let localPath = uri;

//       if (/^https?:\/\//.test(uri)) {
//         const fileName = uri.split('/').pop();
//         const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

//         const result = await RNFS.downloadFile({
//           fromUrl: uri,
//           toFile: destPath,
//         }).promise;

//         if (result.statusCode !== 200) throw new Error('File download failed');

//         localPath = destPath;
//       }

//       await FileViewer.open(localPath, {showOpenWithDialog: true});
//     } catch (err) {
//       console.log('Preview failed:', err);
//       Alert.alert('Error', 'Failed to preview file');
//     }
//   };

//   return (
//     <>
//       <Modal
//         isVisible={visible}
//         onBackdropPress={onDismiss}
//         style={{justifyContent: 'flex-end', margin: 0}}>
//         <View
//           style={{
//             backgroundColor: '#fff',
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//             padding: 20,
//             maxHeight: '90%',
//           }}>
//           <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onDismiss}>
//             <Icon name="close" size={20} />
//           </TouchableOpacity>

//           <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 16}}>
//             Identity Proofs
//           </Text>

//           <ScrollView style={{marginBottom: 16}}>
//             {(Array.isArray(safeIdentityProof) ? safeIdentityProof : []).map(
//               (proof, index) => {
//                 const uri =
//                   typeof proof === 'string'
//                     ? proof.startsWith('http')
//                       ? proof
//                       : `${IMAGE_URL}/${proof}`
//                     : proof?.uri;

//                 if (!uri) return null;

//                 const mimeType =
//                   typeof proof === 'object' && proof?.type
//                     ? proof.type
//                     : uri.includes('.')
//                     ? `application/${uri.split('.').pop()}`
//                     : 'application/octet-stream';

//                 const isImageFile = isImage(mimeType);

//                 return (
//                   <View
//                     key={index}
//                     style={{marginBottom: 16, position: 'relative'}}>
//                     <TouchableOpacity
//                       onPress={() => handlePreview(uri)}
//                       style={{
//                         borderWidth: 1,
//                         borderColor: '#ccc',
//                         borderRadius: 8,
//                         overflow: 'hidden',
//                         padding: 10,
//                         backgroundColor: '#f9f9f9',
//                       }}>
//                       {isImageFile ? (
//                         <Image
//                           source={{uri}}
//                           style={{width: '100%', height: 180, borderRadius: 8}}
//                           resizeMode="cover"
//                         />
//                       ) : (
//                         <View
//                           style={{flexDirection: 'row', alignItems: 'center'}}>
//                           <Icon
//                             name="file-document-outline"
//                             size={24}
//                             color="#1D9BFB"
//                           />
//                           <Text style={{marginLeft: 10}}>
//                             {proof?.name || uri.split('/').pop()}
//                           </Text>
//                         </View>
//                       )}
//                     </TouchableOpacity>

//                     <View
//                       style={{
//                         position: 'absolute',
//                         bottom: 6,
//                         right: 6,
//                         flexDirection: 'row',
//                         columnGap: 8,
//                         backgroundColor: '#fff',
//                         borderRadius: 20,
//                         padding: 4,
//                         alignItems: 'center',
//                       }}>
//                       {typeof proof === 'string' && (
//                         <TouchableOpacity onPress={() => downloadFile(uri)}>
//                           <Icon name="download" size={20} color="#1D9BFB" />
//                         </TouchableOpacity>
//                       )}
//                       <TouchableOpacity onPress={() => removeFile(index)}>
//                         <Icon name="close-circle" size={20} color="red" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 );
//               },
//             )}
//           </ScrollView>

//           {/* Add + Submit */}
//           <TouchableOpacity
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               borderColor: '#1D9BFB',
//               borderWidth: 1,
//               paddingVertical: 8,
//               paddingHorizontal: 12,
//               borderRadius: 6,
//               alignSelf: 'flex-start',
//             }}
//             onPress={addFile}>
//             <Icon name="plus" size={18} color="#1D9BFB" />
//             <Text style={{color: '#1D9BFB', marginLeft: 8}}>Add File</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleSubmit}
//             style={{
//               backgroundColor: '#1D9BFB',
//               paddingVertical: 10,
//               borderRadius: 6,
//               marginTop: 16,
//             }}>
//             <Text style={{color: '#fff', textAlign: 'center'}}>Update</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       {/* Fullscreen preview only for images (if still desired) */}
//       <RNModal visible={previewVisible} transparent animationType="fade">
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0,0,0,0.9)',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//           onPress={() => setPreviewVisible(false)}>
//           <Image
//             source={{uri: previewUri}}
//             style={{width: '90%', height: '80%', borderRadius: 12}}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </RNModal>
//     </>
//   );
// };

// export default EditIdentityProofModal;
