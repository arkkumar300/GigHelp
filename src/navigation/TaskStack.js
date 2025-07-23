// navigation/TaskStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTaskScreen from '../screens/Auth/MyTask/MyTaskScreen';
import AssignTask from '../screens/Auth/MyTask/AssignTask';
import TaskBidder from '../screens/Auth/MyTask/TaskBidder';

const Stack = createNativeStackNavigator();

const TaskStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MyTasksScreen"
      component={MyTaskScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AssignTask"
      component={AssignTask}
      options={{ title: 'Assign Task' }} // Back arrow will be shown
    />
    <Stack.Screen
      name="TaskBidder"
      component={TaskBidder}
      options={{ title: 'Task Bidder' }}
    />
  </Stack.Navigator>
);


export default TaskStack;
