import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    greeting: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    heading: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
    },
    list: {
      paddingBottom: 20,
    },
    card: {
      marginBottom: 12,
      borderWidth: 1,
      borderRadius: 12,
      elevation: 3,
    },
    cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftContent: {
      flex: 1,
    },
    category: {
      fontWeight: 'bold',
      marginVertical: 4,
    },
    statusButton: {
      borderRadius: 20,
    },
    buttonLabel: {
      color: '#fff',
      textTransform: 'capitalize',
    },
  });
  