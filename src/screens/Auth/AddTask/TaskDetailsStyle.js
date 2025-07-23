import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  lightText: {
    color: '#888',
  },
  descLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  description: {
    color: '#555',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  docText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  amountButton: {
    backgroundColor: '#2196f3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  addBidBtn: {
    backgroundColor: '#0047AB',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBidBtnText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    // fontSize: 16,
    fontWeight: 'bold',
    // marginTop: 16,
    // marginBottom: 8,
    color: '#222',
  },
});
