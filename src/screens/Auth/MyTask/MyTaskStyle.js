import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: "#fff",
    },
    header: {
      textAlign: "center",
      fontWeight: "bold",
      marginVertical: 20,
    },
    card: {
      marginVertical: 8,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 5,
    },
    modal: {
      backgroundColor: "white",
      padding: 20,
      margin: 20,
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: "red",
    },
    modalContent: {
      textAlign: "center",
      marginBottom: 20,
    },
  });
  