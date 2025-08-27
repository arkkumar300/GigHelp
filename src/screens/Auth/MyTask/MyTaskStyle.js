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
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
    padding: 0,
    // Adding subtle shadow for iOS and Android
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  taskIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: -15,
  },

  categoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  subText: {
    fontSize: 14,
    color: '#555',
  },

  descriptionText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    flex: 1,
  },

  chipStyle: (color) => ({
    backgroundColor: color,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 0,
    minWidth: 70,
    textAlign: 'center',
  }),

  chipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  amountChip: {
    backgroundColor: '#f0f0f0', // light gray background
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 0,
    minWidth: 70,
    alignItems: 'center',
  },

  amountText: {
    color: '#000', // dark text
    fontWeight: 'bold',
    fontSize: 14,
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
  