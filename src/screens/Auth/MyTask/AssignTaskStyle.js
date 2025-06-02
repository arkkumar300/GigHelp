import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { padding: 16 },
    headerBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#083bb6',
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
    },
    headerText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    rowBox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    halfCard: { width: '48%', padding: 16 },
    cardTitle: { fontWeight: 'bold', fontSize: 16 },
    cardText: { fontSize: 14, marginTop: 4 },
    amountButton: { marginTop: 10, borderRadius: 10 },
    sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    documentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginRight: 12,
      borderRadius: 12,
      backgroundColor: '#eaeaea',
    },
    documentLabel: { marginLeft: 8, fontWeight: 'bold' },
    profileCard: { padding: 16, marginVertical: 20 },
    profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    userName: { fontWeight: 'bold', fontSize: 16 },
    userExperience: { color: '#777', fontSize: 14 },
    skillCard: {
      flex: 1,
      margin: 8,
      padding: 12,
      backgroundColor: '#f3f3f3',
      borderRadius: 10,
    },
    skillText: { fontWeight: 'bold', fontSize: 14 },
    expText: { color: '#555', marginTop: 6 },
  });
  