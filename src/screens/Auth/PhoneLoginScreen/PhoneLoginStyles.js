import {StyleSheet, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 30,
    paddingBottom: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  loginBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  linkText: {
    color: '#007BFF',
    fontWeight: '600',
  },
  footerImageWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
