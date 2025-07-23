import {StyleSheet, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 70,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 8,
  },
  logoTagline: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 40,
    color: '#000',
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  footerImage: {
    width: '100%',
    height: height * 0.35, // or fixed like 250
    resizeMode: 'contain',
  },
});
