import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, StyleSheet} from 'react-native';

import HomeScreen from '../../screens/Auth/Home/Homescreen';
import MyTaskScreen from '../../screens/Auth/MyTask/MyTaskScreen';
import AddTaskScreen from '../../screens/Auth/AddTask/AddTaskScreen';
import MyBidsScreen from '../../screens/Auth/MyBids/MyBidsScreen';
import FiltersScreen from '../../screens/Auth/Filters/FiltersScreen';
// import FiltersScreen from '../screens/Filters/FiltersScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D9BFB',
        tabBarInactiveTintColor: '#333',
        tabBarStyle: {
          height: 65,
          backgroundColor: '#fff',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="My Task"
        component={MyTaskScreen}
        options={{
          tabBarLabel: 'My Task',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="clipboard-text"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTaskScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <View
              style={[
                styles.plusButton,
                {backgroundColor: focused ? '#1D9BFB' : '#000'}, // blue if focused, else black
              ]}>
              <MaterialCommunityIcons name="plus" color="#fff" size={28} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="My Bids"
        component={MyBidsScreen}
        options={{
          tabBarLabel: 'My Bids',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-cash"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Filter"
        component={FiltersScreen}
        options={{
          tabBarLabel: 'Filter',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="filter" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 28,
    // backgroundColor: '#1D9BFB',
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: "-40px"
    // marginBottom: 30, // lift above bar
    elevation: 5,
    marginTop: 15,
  },
});
