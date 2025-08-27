import {StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,        
    left: 0,
    right: 0,
    width: '100%',
    height: 200,     
    zIndex: -1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  successMessageContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 999,
    elevation: 5,
  },
  successMessageText: {
    color: '#155724',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    marginTop: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 15,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#000',
  },
  loginBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
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
    color: '#007bff',
    fontWeight: '600',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerImage: {
    width: width,
    height: height * 0.35,
    resizeMode: 'contain',
  },
});
