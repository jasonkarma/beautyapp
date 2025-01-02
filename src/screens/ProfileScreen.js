import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('https://wiki.kinglyrobot.com/api/get-user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserInfo(response.data.user);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChangePhoto = () => {
    // Handle photo change
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DEF4F2', padding: 24 }}>
      {userInfo ? (
        <View style={{ backgroundColor: '#fff', borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, padding: 24, alignItems: 'center', marginBottom: 24 }}>
          <Image
            style={{ width: 160, height: 160, borderRadius: 80, marginBottom: 24, borderColor: '#fff', borderWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
            source={{ uri: `https://wiki.kinglyrobot.com/media/user_icon_image/${userInfo.media_name}` }}
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{userInfo.username}</Text>
          <Text style={{ color: '#666', marginBottom: 16 }}>{userInfo.realname}</Text>
          
          <TouchableOpacity
            onPress={handleChangePhoto}
            style={{ backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24, width: '75%', marginBottom: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Change Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileEdit', { userInfo })}
            style={{ backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24, width: '75%', marginBottom: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={{ width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#666' }}>Phone:</Text>
              <Text>{userInfo.phone}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#666' }}>Birth:</Text>
              <Text>{userInfo.birth}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#666' }}>Weight:</Text>
              <Text>{userInfo.weight} kg</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#666' }}>Height:</Text>
              <Text>{userInfo.height} cm</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#666' }}>City:</Text>
              <Text>{userInfo.addr}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#666' }}>Gender:</Text>
              <Text>{userInfo.sex}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ color: '#666' }}>Blood Type:</Text>
              <Text>{userInfo.blood_type}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={{ backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
