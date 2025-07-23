import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomsTabs/BottomsTabs';
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();

const MainTabNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainTabNavigator;
