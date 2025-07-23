import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    backgroundColor: '#fff',
  },
  taskCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  amountBox: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 12,
  },
  amountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  categoryDetailsCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  descriptionCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
  },
  documentContainer: {
    gap: 12,
    marginTop: 8,
  },
  docButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  docText: {
    fontSize: 14,
  },
  bidderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  bidderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bidderDetail: {
    fontSize: 14,
    color: '#333',
  },
});
