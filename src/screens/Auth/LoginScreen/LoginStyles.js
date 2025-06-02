import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 24,
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    marginTop: 50,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 40,
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#000',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },
  linkText: {
    color: '#007bff',
    fontWeight: '500',
  },
  footerImage: {
    width: '100%',
    height: height * 0.35,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
