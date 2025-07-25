import React from 'react';
import {Image, View, StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

// Logo Component
export const Logo = () => (
  <View style={styles.logoWrapper}>
    <Image
      source={require('../assets/images/gig-logo1.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

// Bottom Image Component
export const BottomImage = () => (
  <View style={styles.imageWrapper}>
    <Image
      source={require('../assets/images/gig-login-bottom-img.jpg')}
      style={styles.bottomImage}
      resizeMode="cover"
    />
  </View>
);

const styles = StyleSheet.create({
  logoWrapper: {
    alignItems: 'center',
    marginTop: 50, // Adjust if needed
    marginBottom: 30,
  },
  logo: {
    width: 250,      // Increased width
    height: 80,      // Increased height
  },
  imageWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomImage: {
    width: width,
    height: height * 0.2,
  },
});
