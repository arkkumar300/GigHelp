import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
    },
    heroImage: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
    overlay: {
      position: "absolute",
      top: 40,
      left: 20,
    },
    heroText: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "600",
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    title: {
      textAlign: "center",
      marginVertical: 15,
    },
    card: {
      margin: 10,
      elevation: 3,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 30,
      fontSize: 16,
      color: "gray",
    },
  });
  