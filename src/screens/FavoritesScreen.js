import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('https://wiki.kinglyrobot.com/api/clientLikeList/beauty', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setFavorites(response.data.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.primaryBg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {favorites.map((article, index) => (
          <TouchableOpacity key={index} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{article.bp_subsection_title}</Text>
            <Image
              source={{ uri: `https://wiki.kinglyrobot.com/media/beauty_content_banner_image/${article.Media}` }}
              style={{ width: '100%', height: 200, borderRadius: 8 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;
