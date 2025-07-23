// components/CustomHeader.js
import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomHeader = ({navigation}) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={45} color="#000" />
        </TouchableOpacity>

        <Image
          source={require('../assets/images/gig-logo1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.icons}>
        <Icon name="magnify" size={30} color="#1D9BFB" style={styles.icon} />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon
            name="account-circle-outline"
            size={30}
            color="#1D9BFB"
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* <Icon name="bell-ring-outline" size={30} color="" /> */}
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell-ring-outline" size={30} color="#1D9BFB" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    height: 80,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 70,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
  },
});
