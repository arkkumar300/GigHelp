// DrawerNavigator.js
import React from 'react';
import {View, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import CustomHeader from '../components/CustomHeader';
import BottomTabs from '../navigation/BottomsTabs/BottomsTabs';
import AddTaskScreen from '../screens/Auth/AddTask/AddTaskScreen';
import AssignTask from '../screens/Auth/MyTask/AssignTask';
import TaskBidder from '../screens/Auth/MyTask/TaskBidder';
import TaskStack from '../navigation/TaskStack';
import TestPicker from '../screens/Auth/TestScreen';
import TaskDetailsScreen from '../screens/Auth/AddTask/TaskDdetails';
import HomeScreen from '../screens/Auth/Home/Homescreen';
import NotificationScreen from '../screens/Auth/Nodifications/NotificationScreen';
import TransactionScreen from '../screens/Auth/Transactions/TransactionScreen';
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen';
import SettingsScreen from '../screens/Auth/Settings/SettingsScreen';
import MainTabNavigator from '../navigation/MainTabNavigator';
import BidderDisputeCard from '../screens/Auth/MyTask/AssignTask';
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
    <Drawer.Screen name="TaskDetails" component={TaskDetailsScreen} />
    {/* <Drawer.Screen name="My Task" component={TaskStack} /> */}
    <Drawer.Screen name="AssignTask" component={AssignTask} />
    <Drawer.Screen name="TaskBidder" component={TaskBidder} />
    <Drawer.Screen name="Notifications" component={NotificationScreen} />
    <Drawer.Screen name="Transactions" component={TransactionScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    {/* <Drawer.Screen name="AssignTask" component={BidderDisputeCard} /> */}
  </Drawer.Navigator>
);

export default DrawerNavigator;
