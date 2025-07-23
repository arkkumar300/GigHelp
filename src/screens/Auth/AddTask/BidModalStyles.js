import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  inputBox: {
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  description: {
    color: '#444',
    lineHeight: 20,
    paddingTop: 6,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    gap: 10,
  },
  fileText: {
    flex: 1,
    marginLeft: 10,
    fontWeight: '600',
    color: '#333',
  },
  uploadBtn: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  uploadText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
