import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 15,
  },
  linkText: {
    color: '#007BFF',
  },
  footerImage: {
    width: '100%',
    height: '50%',
    marginBottom: -200,
    alignSelf: 'center',
  },
});
