import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  modal: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f44336', // Red for warning
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default styles;
