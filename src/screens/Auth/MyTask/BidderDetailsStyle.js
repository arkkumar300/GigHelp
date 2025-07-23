import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: "#FFF"
  },
  profileContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    marginBottom: 36,
  },
  
  profileCard: {
    // backgroundColor: '#fff',
    padding: 16, 
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  userExp: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },

  approveButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  skillsContainer: {
    // backgroundColor: '#fff',
    // borderRadius: 12,
    padding: 16,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },

  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  skillCol: {
    width: '48%',
  },

  skillText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },

  skillUnderline: {
    height: 1,
    backgroundColor: '#000',
  },

  skillLabel: {
    fontSize: 14,
    color: '#000',
  },

  expLabel: {
    fontSize: 14,
    color: '#000',
  },

  skillCard: {
    marginBottom: 10,
    borderRadius: 10,
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalHeader: {
    backgroundColor: '#1DA1F2', // Bright blue
    width: '100%',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    width: '85%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
    color: '#000',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#1DA1F2',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalCard: {
    width: '85%',
    padding: 20,
    borderRadius: 10,
  },
  mt10: {
    marginTop: 10,
  },
  transferRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  transferModal: {
    width: 330,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
  },
  amountBox: {
    backgroundColor: '#ddd',
    width: '100%',
    borderRadius: 8,
    padding: 10,
  },
  amountText: {
    fontSize: 16,
    color: '#000',
  },
  noteLabel: {
    color: '#1DA1F2',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  transferBox: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    width: 110,
    height: 70,
    justifyContent: 'center',
  },
  transferLabel: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  arrow: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  transferButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  transferButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successModal: {
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007E33', // dark green
    marginBottom: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 25,
  },
  doneButton: {
    backgroundColor: '#007E33',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
