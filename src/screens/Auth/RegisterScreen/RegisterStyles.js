import {StyleSheet, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 200, // Adjust height as per your image
    zIndex: -1,
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  backButton: {
    marginBottom: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 180,
    height: 50,
  },
  tagline: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    marginTop: 2,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  dropdownTouchable: {
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalText: {
    fontSize: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  removeSkill: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  termsText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  linkText: {
    color: '#007BFF',
    fontWeight: '600',
  },
  createAccountBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createAccountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#000',
  },
});
