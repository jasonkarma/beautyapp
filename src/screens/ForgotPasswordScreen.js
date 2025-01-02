import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsEmailValid(text.length > 0);
  };

  const handleVerifyEmail = async () => {
    if (!isEmailValid) return;
    try {
      const response = await axios.post('https://wiki.kinglyrobot.com/api/password/email', {
        email,
        locale: 'zh-TW',
        env: ''
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      if (response.data.message === 'success') {
        Alert.alert('成功發送電子郵件');
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>忘記密碼？</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} style={styles.icon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="電子郵件"
          autoCapitalize="none"
          value={email}
          onChangeText={handleEmailChange}
        />
      </View>
      <Text style={styles.infoText}>請驗證電子郵件</Text>
      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>返回</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { opacity: isEmailValid ? 1 : 0.5 }]}
        onPress={handleVerifyEmail}
        disabled={!isEmailValid}
      >
        <Text style={styles.buttonText}>驗證Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 5,
  },
  inputWithIcon: {
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingRight: 40,
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  backButton: {
    backgroundColor: '#50948e',
  },
  backButtonText: {
    color: 'black',
  },
});

export default ForgotPasswordScreen;
