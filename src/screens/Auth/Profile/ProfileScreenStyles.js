import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scroll: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: -30
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  profileName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  kycRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  kycText: {
    color: '#1D9BFB',
    fontWeight: '600',
  },
  kycChip: {
    backgroundColor: '#fddede',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  kycChipText: {
    color: '#f00',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  seeMore: {
    color: '#1D9BFB',
    fontWeight: '500',
  },
  skillItem: {
    backgroundColor: '#eee',
    padding: 8,
    marginVertical: 4,
    borderRadius: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
  },
  navItemCenter: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 50,
    marginTop: -30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
  },
  proofImage: {
    width: 100,
    height: 140,
    marginRight: 10,
    borderRadius: 6,
  },
  updateBtn: {
    backgroundColor: '#1D9BFB',
    margin: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusMsgContainer: {
    // marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    borderColor: '#1D9BFB',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  statusMessageText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
});
