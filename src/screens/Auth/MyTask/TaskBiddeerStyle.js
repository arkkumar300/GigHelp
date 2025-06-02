import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { padding: 16 },
  card: { marginVertical: 12, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  amountRow: { marginTop: 12 },
  input: { backgroundColor: 'white' },
  amountText: { fontWeight: 'bold', fontSize: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  docItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  modalView: { flex: 1, padding: 16, backgroundColor: 'white' },
  bidderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
  },
});
