
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RegisterScreen() {
    const [identityType, setIdentityType] = useState('Aadhar Number');
    const [identityModalVisible, setIdentityModalVisible] = useState(false);
    const [identityNumber, setIdentityNumber] = useState('');

    const identityOptions = ['Aadhar Number', 'PAN Number', 'Voter ID'];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Register</Text>

                <Text style={styles.label}>Name:</Text>
                <TextInput style={styles.input} placeholder="Username" />

                <Text style={styles.label}>Phone Number:</Text>
                <TextInput style={styles.input} placeholder="+91 99995 55564" keyboardType="phone-pad" />

                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.input} placeholder="example@gmail.com" keyboardType="email-address" />

                <Text style={styles.label}>Password:</Text>
                <TextInput style={styles.input} placeholder="6 - 20 characters" secureTextEntry />

                <Text style={styles.label}>Identity Proof:</Text>
                <TouchableOpacity
                    style={styles.dropdownTouchable}
                    onPress={() => setIdentityModalVisible(true)}
                >
                    <Text style={styles.dropdownText}>{identityType}</Text>
                    <Icon name="keyboard-arrow-down" size={24} color="#333" />
                </TouchableOpacity>

                <Modal visible={identityModalVisible} transparent animationType="fade">
                    <TouchableOpacity
                        style={styles.modalBackground}
                        activeOpacity={1}
                        onPressOut={() => setIdentityModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            {identityOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => {
                                        setIdentityType(option);
                                        setIdentityModalVisible(false);
                                    }}
                                    style={styles.modalItem}
                                >
                                    <Text style={styles.modalText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>

                <TextInput
                    style={styles.input}
                    placeholder={
                        identityType === 'Aadhar Number'
                            ? '8677 8875 9876'
                            : identityType === 'PAN Number'
                                ? 'ABCDE1234F'
                                : 'XYZ1234567'
                    }
                    value={identityNumber}
                    onChangeText={setIdentityNumber}
                />

                <Text style={styles.label}>Fill the Skills:</Text>
                <View style={styles.skillBox}>
                    <TextInput style={styles.input} placeholder="Works" />
                    <TextInput style={styles.input} placeholder="Experience" />
                </View>

                <TouchableOpacity style={styles.addBtn}>
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.agreeText}>
                    I agree to the <Text style={styles.linkText}>Terms of Service</Text>
                </Text>

                <TouchableOpacity style={styles.createAccountBtn}>
                    <Text style={styles.createAccountText}>Create an Account</Text>
                </TouchableOpacity>

                <Text style={styles.signInText}>
                    Have an Account? <Text style={styles.linkText}>Sign in</Text>
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        marginBottom: 15,
        fontSize: 14,
    },
    dropdownTouchable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    dropdownText: {
        fontSize: 14,
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    modalItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    modalText: {
        fontSize: 16,
    },
    skillBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
        marginTop: 5,
        marginBottom: 15,
    },
    addBtn: {
        backgroundColor: '#2196F3',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    agreeText: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 20,
    },
    linkText: {
        color: '#007BFF',
    },
    createAccountBtn: {
        backgroundColor: '#000',
        padding: 14,
        borderRadius: 8,
        marginBottom: 20,
    },
    createAccountText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    signInText: {
        textAlign: 'center',
        fontSize: 13,
    },
});