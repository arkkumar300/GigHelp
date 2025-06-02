import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpContainer: {
    width: '80%',
    alignSelf: 'center',
    height: 80,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 20,
    color: '#000',
  },
  codeText: {
    textAlign: 'center',
    marginTop: 15,
  },
  timerText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#555',
  },
  blueText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  continueBtn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
