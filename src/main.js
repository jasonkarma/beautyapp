import { StyleSheet } from 'react-native';
import { colors } from './styles/colors';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.primaryBg,
    },
    input: { borderBottomWidth: 1, marginBottom: 10 },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: colors.primary,
    },
    radioGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'black',
      marginRight: 5,
    },
    filledCircle: {
      backgroundColor: 'black',
    },
    radioLabel: {
      fontSize: 14,
      color: 'black',
    },
    disabledInput: {
      backgroundColor: '#f0f0f0',
      color: '#a0a0a0',
    },
  });

  export default styles