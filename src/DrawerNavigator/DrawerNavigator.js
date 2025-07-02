// DrawerNavigator.js
import React from 'react';
import {View, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer'; // your drawer content
import CustomHeader from '../components/CustomHeader';
import BottomTabs from '../navigation/BottomsTabs/BottomsTabs';
import AddTaskScreen from '../screens/Auth/AddTask/AddTaskScreen';

import HomeScreen from '../screens/Auth/Home/Homescreen';
// import AddTaskScreen from '../screens/Auth/AddTask/AddTaskScreen';
// import MyBidsScreen from '../screens/Auth/Bids/MyBidsScreen';
// import ProfileScreen from '../screens/Auth/Profile/ProfileScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      header: props => <CustomHeader {...props} />,
      drawerStyle: {
        width: 240,
      },
    }}>
    <Drawer.Screen name="HomeTabs" component={BottomTabs} />
    <Drawer.Screen name="AddTasks" component={AddTaskScreen} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
