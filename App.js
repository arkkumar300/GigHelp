import React from 'react';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
// import store from './store/store';

const App = () => (
  // <Provider store={store}>
  <PaperProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </PaperProvider>
);

export default App;
