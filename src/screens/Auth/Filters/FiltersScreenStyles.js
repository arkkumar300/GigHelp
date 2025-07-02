// FilterScreenStyles.js
import { StyleSheet } from 'react-native';

const FiltersScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  searchIcon: {
    padding: 10,
  },
  filterBlock: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderColor: '#999',
    borderWidth: 1.5,
    marginRight: 10,
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#3D8BFF',
    borderColor: '#3D8BFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#3D8BFF',
    padding: 10,
    borderRadius: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderBox: {
    borderWidth: 1,
    borderColor: '#3D8BFF',
    padding: 10,
    borderRadius: 10,
  },
  sliderValue: {
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default FiltersScreenStyles;
