import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
    color: '#2196f3',
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginTop: 8,
    marginBottom: 8,
  },
  editButton: {
    marginTop: 8,
  },
  documentItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  documentName: {
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  previewImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
});
