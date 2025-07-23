import React from 'react';
import { View, Button, Alert } from 'react-native';
import { pick } from '@react-native-documents/picker';

const TestPicker = () => {
  const handlePick = async () => {
    try {
      const [file] = await pick();
      Alert.alert('Picked File', JSON.stringify(file, null, 2));
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick Document" onPress={handlePick} />
    </View>
  );
};

export default TestPicker;
