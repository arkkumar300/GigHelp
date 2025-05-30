import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to AsyncStorage
export const saveData = async (key, value) => {
  try {
    // Convert value to a string before saving
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (e) {
    console.error("Error saving data", e);
  }};

// Retrieve data from AsyncStorage
export const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null;    
  } catch (e) {
    console.error("Error loading data", e);
  }
};

// Remove data from AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing data", e);
  }
};
