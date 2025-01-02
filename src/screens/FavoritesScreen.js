import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';
import RenderHTML from 'react-native-render-html';
import { Dimensions } from 'react-native';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

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

  const handleArticlePress = async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`https://wiki.kinglyrobot.com/api/pageContentArticle/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setSelectedArticle(response.data);
    } catch (error) {
      console.error('Error fetching article details:', error);
    }
  };

  const contentWidth = Dimensions.get('window').width;

  const styles = {
    articleContainer: {
      flexDirection: 'row',
      marginVertical: 5,
      marginHorizontal: -5,
      backgroundColor: 'white',
      borderRadius: 8,
      overflow: 'hidden',
      height: 100,
    },
    articleImage: {
      width: 100,
      height: 100,
    },
    articleTextContainer: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
      height: '100%',
    },
    articleTitle: {
      fontSize: 23,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 5,
    },
    articleIntro: {
      color: colors.primaryText,
      overflow: 'hidden',
      maxHeight: 40,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primaryBg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {selectedArticle ? (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{selectedArticle.info.bp_subsection_title}</Text>
            <Text style={{ marginBottom: 8 }}>Visits: {selectedArticle.info.visit} | Likes: {selectedArticle.info.likecount} | Published: {selectedArticle.info.bp_subsection_first_enabled_at}</Text>
            <Image
              source={{ uri: `https://wiki.kinglyrobot.com/media/beauty_content_banner_image/${selectedArticle.info.name}` }}
              style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
            />
            {selectedArticle.cnt.map((content, index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{content.title}</Text>
                <RenderHTML
                  contentWidth={contentWidth}
                  source={{ html: content.cnt.replace(/src="\\\/media\\\/beauty_content_index_image\\//g, 'src="https://wiki.kinglyrobot.com/media/beauty_content_index_image/') }}
                />
              </View>
            ))}
          </View>
        ) : (
          favorites.map((article, index) => {
            console.log('Article:', article);
            return (
              <TouchableOpacity key={index} style={styles.articleContainer} onPress={() => handleArticlePress(article.bp_subsection_id)}>
                <Image
                  source={{ uri: `https://wiki.kinglyrobot.com/media/beauty_content_banner_image/${article.Media}` }}
                  style={styles.articleImage}
                />
                <View style={styles.articleTextContainer}>
                  <Text style={styles.articleTitle}>{article.bp_subsection_title}</Text>
                  <Text style={styles.articleIntro}>{article.bp_subsection_intro}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;