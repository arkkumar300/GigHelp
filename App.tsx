import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
// import store from './store/store';

const App = () => (
  // <Provider store={store}>
  // <Provider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  // </Provider>
);

export default App;
