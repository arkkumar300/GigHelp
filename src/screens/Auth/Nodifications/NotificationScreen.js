import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomTabs from '../../../navigation/BottomsTabs/BottomsTabs';

const notifications = [
  {
    id: '1',
    name: 'Best Offer For You',
    description: 'Its a long Escalated Fact',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'Best Offer For You',
    description: 'Its a long Escalated Fact',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    name: 'Best Offer For You',
    description: 'Its a long Escalated Fact',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: '4',
    name: 'Best Offer For You',
    description: 'Its a long Escalated Fact',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: '5',
    name: 'Best Offer For You',
    description: 'Its a long Escalated Fact',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  // Add more as needed
];

const NotificationItem = ({ item }) => (
  <View style={styles.notificationCard}>
    <Image source={{ uri: item.image }} style={styles.avatar} />
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>
        {item.description}
        <Text style={styles.viewMore}> View More ......</Text>
      </Text>
    </View>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>5</Text>
    </View>
  </View>
);

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={styles.listContent}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    color: '#555',
  },
  viewMore: {
    color: '#3366FF',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#3366FF',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
  },
  navItemCenter: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 50,
    marginTop: -30,
  },
});

export default NotificationScreen;
