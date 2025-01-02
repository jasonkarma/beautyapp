import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordValid = password.length > 8 && /[a-z]/.test(password) && /[A-Z]/.test(password);
  const isFormValid = email && username && isPasswordValid;

  const handleSignUp = async () => {
    if (!email || !username || !password) {
      Alert.alert('Invalid Input', 'Please fill all the fields.');
      return;
    }
    if (!email.includes('@')) {
        Alert.alert('Invalid Input', 'Please enter a valid email address.');
        return;
      }
    if (!isPasswordValid) {
        Alert.alert('Invalid Input', 'Password must be at least 8 characters long and contain both uppercase and lowercase letters.');
        return;
    }

    setIsLoading(true);
    console.log('Sign Up button pressed');
    try {
      const response = await fetch('https://wiki.kinglyrobot.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
          from: 'beauty_app',
        }),
      });

      console.log('API Response Status:', response.status);
      const data = await response.json();
      console.log('API Response Data:', data);

      if (response.status === 200) {
        Alert.alert('Success', data.message);
        navigation.navigate('Login');
      } else if (response.status === 422) {
        // Extract error messages
        const errorMessages = [];
        if (data.error.email) {
          errorMessages.push(`Email: ${data.error.email.join(', ')}`);
        }
        if (data.error.username) {
          errorMessages.push(`Username: ${data.error.username.join(', ')}`);
        }
        Alert.alert('Sign Up Failed', errorMessages.join('\n'));
      } else if (response.status === 404) {
        Alert.alert('Sign Up Failed', Array.isArray(data.error) ? data.error.join('\n') : data.error);
      }
    } catch (error) {
      console.error('Sign Up Error:', error);
      Alert.alert('Network Error', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>註冊</Text>
      <Text style={styles.label}>暱稱</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} style={styles.icon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="請輸入暱稱"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <Text style={styles.label}>電子郵件</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} style={[styles.icon, { marginLeft: -6 }]} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="請輸入電子郵件"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Text style={styles.label}>密碼</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} style={styles.icon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="請輸入密碼"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>
      {!isPasswordValid && (
        <Text style={styles.passwordRule}>密碼必須大於8字，且有大小寫英文</Text>
      )}
      <TouchableOpacity style={[styles.button, styles.forgotButton]} onPress={handleForgotPassword}>
        <Text style={[styles.buttonText, styles.forgotButtonText]}>忘記密碼</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isFormValid ? '#50948e' : '#d3d3d3', opacity: isFormValid ? 1 : 0.5 }]} 
        onPress={handleSignUp} 
        disabled={!isFormValid}
      >
        <Text style={[styles.buttonText, { color: isFormValid ? 'black' : 'white' }]}>確認註冊</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 5, // Adjust padding to move icon left
  },
  icon: {
    marginRight: 8,
  },
  inputWithIcon: {
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingRight: 40, // Adjust for eye icon
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  eyeIcon: {
    color: 'gray',
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordRule: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  forgotButton: {
    backgroundColor: '#d3d3d3',
  },
  forgotButtonText: {
    color: '#50948e',
  },
});

export default SignUpScreen;
