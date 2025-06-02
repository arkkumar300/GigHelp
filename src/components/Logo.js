import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

const Logo = () => (
  <View style={styles.logoWrapper}>
    <Image
      source={require('../assets/images/gig-logo1.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 168,
    height: 53,
  },
});

export default Logo;
