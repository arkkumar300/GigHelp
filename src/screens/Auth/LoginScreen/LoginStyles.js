import {StyleSheet, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#000',
  },
  linkText: {
    color: '#007bff',
    fontWeight: '600',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerImage: {
    width: '100%',
    height: height * 0.25,
    resizeMode: 'contain',
  },
});
