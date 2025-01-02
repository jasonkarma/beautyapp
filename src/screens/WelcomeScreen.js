import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../assets/images';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Retrieved token:', token); // Log retrieved token
      if (token) {
        navigation.navigate('Encyclopedia');
      }
    };
    checkLoginStatus();
  }, []);

  const handleGetStarted = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('Token on Get Started:', token); // Log token on button press
    if (token) {
      navigation.navigate('Encyclopedia');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
        style={styles.logo}
        source={images.siteLogo}
        resizeMode="contain"
      />
      {/* Welcome Message */}
      <Surface style={styles.welcomeBox}>
        <Text style={styles.title}>Welcome to BeautyApp</Text>
        <Text style={styles.subtitle}>
          Discover the ultimate beauty encyclopedia and manage your skincare routines effectively.
        </Text>
      </Surface>
      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleGetStarted}>
        <Text style={styles.buttonLabel}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

WelcomeScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DEF4F2', // light blue
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  welcomeBox: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#d4d4d8', // light gray
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E1972D', // Orange for a warm touch
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#05221B', // dark green
  },
  loginButton: {
    width: '80%',
    borderRadius: 25,
    backgroundColor: '#0891b2', // dark blue
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
});

export default WelcomeScreen;
