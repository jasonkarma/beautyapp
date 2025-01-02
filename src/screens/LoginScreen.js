import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://wiki.kinglyrobot.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Success: Save token and navigate to the EncyclopediaScreen
        await AsyncStorage.setItem('userToken', data.token);
        console.log('Token saved:', data.token); // Log token saving
        navigation.navigate('Encyclopedia', { token: data.token });
      } else if (response.status === 404) {
        // Failure: Show error message
        Alert.alert('Login Failed', data.error || 'Unknown error occurred.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = (password) => {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/.test(password);
  };

  const isFormValid = () => {
    return email.length > 0 && isPasswordValid(password);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primaryBg,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.secondary,
      borderRadius: 8,
      padding: 8,
      marginBottom: 16,
      width: '80%',
    },
    inputIcon: {
      marginLeft: 8,
    },
    input: {
      flex: 1,
      marginLeft: 8,
    },
    forgotPassword: {
      width: '80%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    loginButton: {
      width: '80%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 8,
      marginBottom: 16,
    },
    loginButtonText: {
      fontSize: 16,
      color: 'white',
    },
    signUpButton: {
      width: '80%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    signUpButtonText: {
      fontSize: 16,
      color: 'white',
    },
    passwordInputIcon: {
      marginLeft: 12,
    },
    passwordInput: {
      flex: 1,
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>登入</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="請輸入電子郵件"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} style={styles.passwordInputIcon} />
        <TextInput
          style={styles.passwordInput}
          placeholder="請輸入密碼"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8 }}>
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={{ fontSize: 16, color: colors.primary }}>忘記密碼？</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButton, !isFormValid() ? { backgroundColor: 'gray' } : null]}
        onPress={handleLogin}
        disabled={!isFormValid() || isLoading}
      >
        <Text style={styles.loginButtonText}>{isLoading ? '登入中...' : '登入'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpButtonText}>註冊</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
