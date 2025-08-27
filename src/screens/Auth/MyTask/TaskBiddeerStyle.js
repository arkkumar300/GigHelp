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
    // elevation: 3,
    backgroundColor: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskCard: {
    // backgroundColor: '#fff',
    // // borderRadius: 16,
    // padding: 16,
    // marginBottom: 16,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 8,
    // elevation: 4,
    // borderRadius: 16,

    backgroundColor: '#fff',
    // padding: 16,
    marginBottom: 16,
    elevation: 0,
    shadowColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  taskIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3F51B5',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  metaText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#444',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amountBox: {
    backgroundColor: '#c9cbd6ff',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  amountText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  categoryDetailsCard: {
    backgroundColor: '#f9f9fc',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  descriptionCard: {
    backgroundColor: '#f9f9fc',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 5,
    marginBottom: 2,
  },

  descInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 2,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 80,
    maxHeight: 300,
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
    backgroundColor: '#eef0f7',
  },
  docText: {
    fontSize: 14,
    color: '#333',
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  subText: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 10,
  },
});
