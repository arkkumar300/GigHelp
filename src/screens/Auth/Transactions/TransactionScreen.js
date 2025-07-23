import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomTabs from '../../../navigation/BottomsTabs/BottomsTabs';

const transactions = [
  { id: '1', amount: '$56.45', name: 'Tiffany Aguilar', date: '20 12 2024', status: 'Completed' },
  { id: '2', amount: '$56.45', name: 'Tiffany Aguilar', date: '20 12 2024', status: 'Filled' },
  { id: '3', amount: '$56.45', name: 'Tiffany Aguilar', date: '20 12 2024', status: 'Pending' },
  { id: '4', amount: '$56.45', name: 'Tiffany Aguilar', date: '20 12 2024', status: 'Completed' },
  { id: '5', amount: '$56.45', name: 'Tiffany Aguilar', date: '20 12 2024', status: 'Pending' },
];

const getStatusStyle = status => {
  switch (status) {
    case 'Completed':
      return { backgroundColor: '#8BC34A', color: '#fff' };
    case 'Filled':
      return { backgroundColor: '#FF3D00', color: '#fff' };
    case 'Pending':
      return { backgroundColor: '#FFA500', color: '#fff' };
    default:
      return { backgroundColor: '#ccc', color: '#000' };
  }
};

const TransactionScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Image
        //   source={require('../../../assets/images/gig-logo1.png')} // Update your logo path
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerIcons}>
          <Icon name="magnify" size={26} color="#1D9BFB" style={styles.icon} />
          <Icon name="account-circle-outline" size={26} color="#1D9BFB" style={styles.icon} />
          <Icon name="bell-ring-outline" size={26} color="#F00" />
        </View>
      </View> */}

      {/* Greeting */}
      <Text style={styles.greeting}>Hello,</Text>
      <Text style={styles.name}>kevin Smith</Text>

      {/* Transactions */}
      <View style={styles.transactionBox}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.showAll}>Show All</Text>
          </TouchableOpacity>
        </View>

        {transactions.map(item => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <View key={item.id} style={[styles.transactionCard]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.amount}>{item.amount}</Text>
                <Text style={styles.nameSmall}>{item.name}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                <Text style={[styles.statusText, { color: statusStyle.color }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomTabs />
        {/* <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="clipboard-text" size={24} color="#000" />
          <Text style={styles.navText}>My Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter}>
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="account-cash" size={24} color="#000" />
          <Text style={styles.navText}>My Bids</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="filter" size={24} color="#000" />
          <Text style={styles.navText}>Filter</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
  },
  logo: {
    width: 130,
    height: 60,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
  },
  greeting: {
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 10,
    color: '#555',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  transactionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0dfdc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  transactionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  showAll: {
    color: '#1D9BFB',
    fontWeight: '600',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameSmall: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
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
