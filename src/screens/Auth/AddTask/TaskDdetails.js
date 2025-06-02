import React, { useState, useEffect, } from 'react';
import {
    View,
    Text,
    StyleSheet, Alert,
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
    Paragraph as PaperParagraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pdf from 'react-native-pdf';
import DocumentPicker from 'react-native-document-picker';
import styles from './TaskDetailsStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'react-native-axios';

const TaskDetailsScreen = ({ task, documents }) => {

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


    // When props.task.document is available
    useEffect(() => {
        if (Array.isArray(task?.document)) {
            setDocuments(task.document);
        }
    }, [task?.document]);

    // Open file preview
    const openPreview = (url, ext) => {
        setSelectedDoc(url);
        setFileType(ext === 'pdf' ? 'pdf' : 'image');
        setPreviewVisible(true);
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

    // File Picker
    const pickFiles = async () => {
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            });
            setFiles(res);
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.warn('File picker error:', err);
            }
        }
    };

    // Submit Bid
    const handleAddBid = async () => {
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

        if (Array.isArray(task?.document)) {
            task.document.forEach((doc) => {
                formData.append('taskDocument[]', doc);
            });
        }

        if (files.length > 0) {
            files.forEach((f) => {
                formData.append('biderDocument', {
                    uri: f.uri,
                    type: f.type,
                    name: f.name,
                });
            });
        }

        try {
            const response = await axios.post('http://localhost:3001/Bids/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const bidId = response.data?.data?.BidId;
            const getResponse = await axios.get(`http://localhost:3001/Bids/get-by-bidid?bidId=${bidId}`);

            setBidData(getResponse.data?.data || getResponse.data);
            setDialogOpen(false);
            setModalOpen(true);
        } catch (error) {
            console.error('Error submitting bid:', error);
            Alert.alert('Error', 'Failed to submit bid. Please try again.');
        }
    };

    // Fetch task stats for user
    useEffect(() => {
        const fetchTaskStats = async () => {
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            setUserId(user?.userId)
            try {
                const token = await AsyncStorage.getItem('token');
                if (!task?.userId || !token) return;

                const res = await axios.get(
                    `http://localhost:3001/task/task-summary-by-user?userId=${user.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const { totalTasks, disputeTasks, completedTasks } = res.data?.data || {};
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
        <ScrollView contentContainerStyle={styles.container}>
            {/* --- Existing UI --- */}
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.rowBetween}>
                        <Title>Category: {task.Categories}</Title>
                        <Text>{task.daysLeft}</Text>
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
                        <Text style={styles.status}>Status: {task.status}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Posted: {new Date(task.createdAt).toLocaleDateString()}</Text>
                        <Button mode="contained">₹ {task.amount}</Button>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Title>Description</Title>
                    <Paragraph>{task.description}</Paragraph>
                </Card.Content>
            </Card>

            <Title style={styles.sectionTitle}>Task Owner Details</Title>
            <Card style={styles.card}>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Total Tasks</Text>
                        <Text>{task.totalTasks}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Dispute Tasks</Text>
                        <Text>{task.disputeTasks}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Completed Tasks</Text>
                        <Text>{task.completedTasks}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Points</Text>
                        <Text>350</Text>
                        <Icon name="star" size={20} color="#f5c518" />
                    </View>
                </View>
            </Card>

            <Title style={styles.sectionTitle}>Documents</Title>
            <Card style={styles.card}>
                {documents.length > 0 ? (
                    documents.map((doc, index) => {
                        const ext = doc.split('.').pop().toLowerCase();
                        const iconName =
                            ext === 'pdf'
                                ? 'file-pdf'
                                : ['jpg', 'jpeg', 'png'].includes(ext)
                                    ? 'image'
                                    : 'attachment';
                        const docUrl = `http://localhost:3001/storege/userdp/${doc}`;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.docRow}
                                onPress={() => openPreview(docUrl, ext)}
                            >
                                <Icon name={iconName} size={24} color="#333" />
                                <Text style={{ marginLeft: 8 }}>{doc}</Text>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text>No documents found.</Text>
                )}
            </Card>

            {/* Add Bid Button */}
            <Button
                mode="contained"
                style={styles.bidButton}
                onPress={() => setDialogOpen(true)}
            >
                Add Bid
            </Button>

            {/* Document Preview Modal */}
            <RNModal visible={previewVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setPreviewVisible(false)}
                        >
                            <Icon name="close" size={28} />
                        </TouchableOpacity>
                        {fileType === 'pdf' ? (
                            <Pdf
                                source={{ uri: selectedDoc }}
                                style={styles.previewPdf}
                            />
                        ) : (
                            <Image
                                source={{ uri: selectedDoc }}
                                style={styles.previewImage}
                                resizeMode="contain"
                            />
                        )}
                        <Button
                            mode="contained"
                            onPress={() => Linking.openURL(selectedDoc)}
                            style={{ marginTop: 16 }}
                        >
                            Download
                        </Button>
                    </View>
                </View>
            </RNModal>

            {/* Add Bid Dialog */}
            <Portal>
                <Dialog visible={dialogOpen} onDismiss={handleDialogClose}>
                    <Dialog.Title>Add Your Bid</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Bid Amount"
                            value={bidOfAmount}
                            onChangeText={setBidOfAmount}
                            keyboardType="numeric"
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />

                        <Button
                            mode="outlined"
                            icon="upload"
                            onPress={pickFiles}
                            style={{ marginBottom: 10 }}
                        >
                            {files.length > 0
                                ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                                : 'Select Files'}
                        </Button>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleDialogClose}>Cancel</Button>
                        <Button mode="contained" onPress={handleAddBid}>
                            Submit
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Success Modal */}
            <Portal>
                <Dialog visible={modalOpen} onDismiss={handleModalClose}>
                    <Dialog.Content>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <Image
                                source={{
                                    uri: 'https://cdn-icons-png.flaticon.com/512/9456/9456124.png',
                                }}
                                style={{ width: 80, height: 80, marginBottom: 10 }}
                            />
                            <Title style={{ color: '#6200ee' }}>Bidding Success</Title>
                        </View>

                        <Card style={{ padding: 10, backgroundColor: '#f7f7f7', marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>
                                    <Text style={{ fontWeight: 'bold' }}>Bid ID :</Text> {bidData?.BidId}
                                </Text>
                                <Text style={{ color: '#6200ee' }}>
                                    <Text style={{ fontWeight: 'bold' }}>Posted on :</Text>{' '}
                                    {bidData
                                        ? new Date(bidData.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })
                                        : ''}
                                </Text>
                            </View>
                            <Text style={{ marginTop: 8 }}>
                                <Text style={{ fontWeight: 'bold' }}>Task ID :</Text> {bidData?.taskId}
                            </Text>
                            <Text style={{ marginTop: 8 }}>
                                <Text style={{ fontWeight: 'bold' }}>Bid Description :</Text>{' '}
                                {bidData?.description}
                            </Text>
                        </Card>

                        <Card style={{ padding: 10, backgroundColor: '#f7f7f7', marginBottom: 10 }}>
                            <Text>
                                <Text style={{ fontWeight: 'bold' }}>Description :</Text>{' '}
                                {bidData?.taskDescription}
                            </Text>
                        </Card>

                        <Card style={{ padding: 10, backgroundColor: '#f7f7f7', marginBottom: 20 }}>
                            <Text>
                                <Text style={{ fontWeight: 'bold' }}>Budget :</Text> {bidOfAmount}
                            </Text>
                        </Card>

                        <Button
                            mode="contained"
                            onPress={handleModalClose}
                            style={{ borderRadius: 5, paddingVertical: 8 }}
                        >
                            Close
                        </Button>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </ScrollView>
    );
};

export default TaskDetailsScreen;
