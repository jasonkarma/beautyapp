import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

const ProfileEditScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState(route.params.userInfo);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token:', token);
      console.log('User Info:', userInfo);

      // Create a copy of userInfo without the realname and birth fields
      const { realname, birth, ...updateData } = userInfo;

      const response = await axios.post('https://wiki.kinglyrobot.com/api/update-user', updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response:', response);

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.error.join(', '));
      }
    } catch (error) {
      console.error('Update Error:', error.response.data);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const renderRadioButton = (label, value, groupValue, onPress) => (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
      <View style={[styles.circle, groupValue === value && styles.filledCircle]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Real Name</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Real Name"
        value={userInfo.realname}
        editable={false}
      />
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={userInfo.phone}
        onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
      />
      <Text style={styles.label}>Birth</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Birth"
        value={userInfo.birth}
        editable={false}
      />
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userInfo.username}
        onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
      />
      <Text style={styles.label}>Weight</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={userInfo.weight}
        onChangeText={(text) => setUserInfo({ ...userInfo, weight: text })}
      />
      <Text style={styles.label}>Height</Text>
      <TextInput
        style={styles.input}
        placeholder="Height"
        value={userInfo.height}
        onChangeText={(text) => setUserInfo({ ...userInfo, height: text })}
      />
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={userInfo.addr}
        onChangeText={(text) => setUserInfo({ ...userInfo, addr: text })}
      />
      <Text style={styles.label}>Sex</Text>
      <View style={styles.radioGroup}>
        {renderRadioButton('Female', 0, userInfo.sex, () => setUserInfo({ ...userInfo, sex: 0 }))}
        {renderRadioButton('Male', 1, userInfo.sex, () => setUserInfo({ ...userInfo, sex: 1 }))}
        {renderRadioButton('Unspecified', 2, userInfo.sex, () => setUserInfo({ ...userInfo, sex: 2 }))}
      </View>
      <Text style={styles.label}>Blood Type</Text>
      <View style={styles.radioGroup}>
        {renderRadioButton('A', 0, userInfo.blood_type, () => setUserInfo({ ...userInfo, blood_type: 0 }))}
        {renderRadioButton('B', 1, userInfo.blood_type, () => setUserInfo({ ...userInfo, blood_type: 1 }))}
        {renderRadioButton('AB', 2, userInfo.blood_type, () => setUserInfo({ ...userInfo, blood_type: 2 }))}
        {renderRadioButton('O', 3, userInfo.blood_type, () => setUserInfo({ ...userInfo, blood_type: 3 }))}
      </View>
      <Button title="上傳會員資料" onPress={handleUpdate} color="black" />
    </View>
  );
};

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

export default ProfileEditScreen;