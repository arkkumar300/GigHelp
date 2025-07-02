import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RadioButton, Slider, Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import styles from './FiltersScreenStyles'; 

const FiltersScreen = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: false,
    budget: false,
    location: false,
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [budgetValue, setBudgetValue] = useState(75);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <View style={styles.container}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search" />
          <Icon name="search" size={24} color="#333" style={styles.searchIcon} />
        </View>

        <ScrollView>
          {/* Category */}
          <View style={styles.filterBlock}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleFilter('category')}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedFilters.category && styles.checkedBox,
                ]}
              />
              <Text style={styles.label}>Category</Text>
            </TouchableOpacity>

            {selectedFilters.category && (
              <View style={styles.dropdownBox}>
                {[
                  'Graphic Design',
                  'Digital marketing',
                  'Writing & Translation',
                  'Video & Animation',
                  'music & Audio',
                  'Programming & Tech',
                ].map((item) => (
                  <View key={item} style={styles.radioRow}>
                    <RadioButton
                      value={item}
                      status={selectedCategory === item ? 'checked' : 'unchecked'}
                      onPress={() => setSelectedCategory(item)}
                    />
                    <Text>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Budget */}
          <View style={styles.filterBlock}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleFilter('budget')}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedFilters.budget && styles.checkedBox,
                ]}
              />
              <Text style={styles.label}>Budget</Text>
            </TouchableOpacity>

            {selectedFilters.budget && (
              <View style={styles.sliderBox}>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>Daily Progress</Text>
                <Slider
                  value={budgetValue}
                  onValueChange={setBudgetValue}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  style={{ width: '100%' }}
                />
                <Text style={styles.sliderValue}>${Math.round(budgetValue * 1022)} /-</Text>
              </View>
            )}
          </View>

          {/* Location */}
          <View style={styles.filterBlock}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleFilter('location')}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedFilters.location && styles.checkedBox,
                ]}
              />
              <Text style={styles.label}>Location</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default FiltersScreen;
