import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { loadData, removeData } from '../Utils/appData';
import ApiService from '../services/ApiService';

// Updated drawerItems with nested tab screen info (Add, Profile)
const drawerItems = [
  { label: 'Home', icon: 'home-outline', screen: 'HomeTabs' },
  { label: 'Add Task', icon: 'plus-box-outline', screen: 'Add', parent: 'HomeTabs' },
  { label: 'All Task', icon: 'view-list-outline', screen: 'AllTasks' },
  { label: 'My Bids', icon: 'gavel', screen: 'MyBids' },
  { label: 'Profile', icon: 'account-outline', screen: 'Profile', parent: 'HomeTabs' },
  { label: 'App Settings', icon: 'cog-outline', screen: 'AppSettings' },
  { label: 'Transactions', icon: 'credit-card-outline', screen: 'Transactions' },
  { label: 'Help/Support', icon: 'lifebuoy', screen: 'HelpSupport' },
];

const CustomDrawer = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const storedUser = await loadData('userInfo');
      if (storedUser) {
        setUserId(storedUser.userId);
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getUser = async () => {
      try {
        const response = await ApiService.get('systemuser/get-user', { userId });
        if (response) {
          setUser(response.data);
        } else {
          Alert.alert('User not found');
        }
      } catch (error) {
        console.log('Failed to fetch user', error);
      }
    };
    getUser();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await removeData('userInfo');
      Alert.alert('Logout', 'You have been logged out.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top User Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/gig-logo1.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.accountHolder || ''}</Text>
      </View>

      {/* Drawer items */}
      <DrawerContentScrollView contentContainerStyle={styles.scrollContainer}>
        {drawerItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => {
              if (item.parent) {
                navigation.navigate(item.parent, { screen: item.screen });
              } else {
                navigation.navigate(item.screen);
              }
            }}>
            <MaterialCommunityIcons name={item.icon} size={24} color="#333" />
            <Text style={styles.label}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>

      {/* Logout button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D9BFB',
  },
  scrollContainer: {
    paddingTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  label: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  logoutContainer: {
    padding: 20,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  logoutButton: {
    backgroundColor: '#1D9BFB',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});




// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import {DrawerContentScrollView} from '@react-navigation/drawer';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {loadData, removeData} from '../Utils/appData';
// import ApiService from '../services/ApiService';

// const drawerItems = [
//   {label: 'Home', icon: 'home-outline', screen: 'HomeTabs'},
//   {label: 'Add Task', icon: 'plus-box-outline', screen: 'Add'},
//   {label: 'All Task', icon: 'view-list-outline', screen: 'AllTasks'},
//   {label: 'My Bids', icon: 'gavel', screen: 'MyBids'},
//   {label: 'Profile', icon: 'account-outline', screen: 'Profile'},
//   {label: 'App Settings', icon: 'cog-outline', screen: 'AppSettings'},
//   {label: 'Transactions', icon: 'credit-card-outline', screen: 'Transactions'},
//   {label: 'Help/Support', icon: 'lifebuoy', screen: 'HelpSupport'},
// ];

// const CustomDrawer = ({navigation}) => {
//   const [userId, setUserId] = useState(null);
//   const [user, setUser] = useState(null);
//   console.log(userId, 'userId');

//   useEffect(() => {
//     const getUserInfo = async () => {
//       const storedUser = await loadData('userInfo');
//       if (storedUser) {
//         setUserId(storedUser.userId);
//       }
//     };
//     getUserInfo();
//   }, []);

//   useEffect(() => {
//     if (!userId) return;
    
//     const getUser = async () => {
//       try {
//         const user = await ApiService.get('systemuser/get-user', {userId}); // ✅ wrap in object
//         if (user) {
//           setUser(user.data)
//           // Alert.alert('User data', JSON.stringify(user));
//         } else {
//           // console.log('user not found');
//           Alert.alert('User not found');
//         }
//       } catch (error) {
//         console.log('Failed to fetch user', error);
//       }
//     };
//     getUser();
//   }, [userId]);

//   const handleLogout = async () => {
//     try {
//       await removeData('userInfo');
//       Alert.alert('Logout', 'You have been logged out.');
//       navigation.reset({
//         index: 0,
//         routes: [{name: 'Login'}],
//       });
//     } catch (error) {
//       console.log('Logout error:', error);
//       Alert.alert('Error', 'Failed to log out.');
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       {/* Top User Section */}
//       <View style={styles.header}>
//         <Image
//           source={require('../assets/images/gig-logo1.png')}
//           style={styles.avatar}
//         />
//         <Text style={styles.userName}>{user?.accountHolder || ""} </Text>
//       </View>

//       {/* Drawer items */}
//       <DrawerContentScrollView contentContainerStyle={styles.scrollContainer}>
//         {drawerItems.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.item}
//             onPress={() => navigation.navigate(item.screen)}>
//             <MaterialCommunityIcons name={item.icon} size={24} color="#333" />
//             <Text style={styles.label}>{item.label}</Text>
//             <Ionicons name="chevron-forward" size={20} color="#999" />
//           </TouchableOpacity>
//         ))}
//       </DrawerContentScrollView>

//       {/* Logout button */}
//       <View style={styles.logoutContainer}>
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CustomDrawer;

// const styles = StyleSheet.create({
//   header: {
//     padding: 20,
//     alignItems: 'center',
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#ddd',
//     marginBottom: 8,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1D9BFB',
//   },
//   scrollContainer: {
//     paddingTop: 10,
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
//   label: {
//     flex: 1,
//     marginLeft: 16,
//     fontSize: 16,
//     color: '#333',
//   },
//   logoutContainer: {
//     padding: 20,
//     borderTopColor: '#eee',
//     borderTopWidth: 1,
//   },
//   logoutButton: {
//     backgroundColor: '#1D9BFB',
//     paddingVertical: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
