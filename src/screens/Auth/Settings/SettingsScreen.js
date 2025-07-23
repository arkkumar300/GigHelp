import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = () => {
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 24 }} /> {/* Spacer for balance */}
        </View>

        {/* Main Settings Card */}
        <View style={styles.card}>
          <SettingItem icon="account" label="Name" value="Ch. Praveen" />
          <SettingItem icon="email" label="E mail" value="leadxpol123@gmail.com" />
          <SettingItem icon="phone" label="Phone Number" value="+91 99999 99999" />
          <SettingItem icon="lock" label="Password" value="**********" />
          <SettingItem icon="clipboard-list" label="Skills" />
          
          {/* Notifications toggle */}
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={styles.iconBox}>
                <Icon name="bell" size={20} color="#fff" />
              </View>
              <Text style={styles.label}>Notifications</Text>
            </View>
            <Switch
              value={isNotificationEnabled}
              onValueChange={() => setNotificationEnabled(!isNotificationEnabled)}
            />
          </View>
        </View>

        {/* Support + Policy */}
        <View style={styles.card}>
          <SettingItem icon="headset" label="Support" />
          <SettingItem icon="file-document-outline" label="Privacy policy" />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingItem = ({ icon, label, value }) => (
  <TouchableOpacity style={styles.itemRow}>
    <View style={styles.itemLeft}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={20} color="#fff" />
      </View>
      <View>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
      </View>
    </View>
    <Icon name="chevron-right" size={20} color="#999" />
  </TouchableOpacity>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#1D9BFB',
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#777',
  },
  logoutButton: {
    backgroundColor: '#1D9BFB',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
