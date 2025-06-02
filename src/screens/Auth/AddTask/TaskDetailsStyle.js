import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      padding: 12,
    },
    card: {
      marginVertical: 10,
      padding: 10,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 6,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    label: {
      fontWeight: 'bold',
    },
    status: {
      color: '#007BFF',
      fontWeight: '600',
    },
    sectionTitle: {
      marginTop: 15,
      fontWeight: 'bold',
      fontSize: 18,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    statBox: {
      alignItems: 'center',
      flex: 1,
    },
    statTitle: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
    },
    bidButton: {
      marginTop: 20,
      alignSelf: 'center',
      width: '50%',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#00000099',
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      maxHeight: '80%',
    },
    closeButton: {
      alignSelf: 'flex-end',
    },
    previewPdf: {
      flex: 1,
      width: '100%',
      height: 400,
    },
    previewImage: {
      width: '100%',
      height: 400,
    },
  });
  