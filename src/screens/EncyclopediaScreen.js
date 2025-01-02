import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import { colors } from '../styles/colors';
import RenderHTML from 'react-native-render-html';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: bound renderChildren: Support for defaultProps will be removed',
]);

const EncyclopediaScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const frontPageResponse = await axios.get('https://wiki.kinglyrobot.com/api/beauty/frontPageContent', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const articleIds = frontPageResponse.data.hotContents.map(content => content.bp_subsection_id);

        const articlePromises = articleIds.map(id =>
          axios.get(`https://wiki.kinglyrobot.com/api/pageContentArticle/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
        );

        const articleResponses = await Promise.all(articlePromises);
        const articlesData = articleResponses.map(response => response.data);

        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleArticlePress = async (id) => {
    try {
      console.log('Article ID:', id); // Log the article ID
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`https://wiki.kinglyrobot.com/api/pageContentArticle/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Article Response:', response.data); // Log the API response
      setSelectedArticle(response.data);
    } catch (error) {
      console.error('Error fetching article details:', error);
    }
  };

  const contentWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {selectedArticle ? (
            <View style={styles.articleDetailContainer}>
              <Text style={styles.articleTitle}>{selectedArticle.info.bp_subsection_title}</Text>
              <View style={styles.articleIcons}>
                <TouchableOpacity style={styles.iconButton}><Text>+</Text></TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}><Text>❤️</Text></TouchableOpacity>
              </View>
              <Text style={styles.articleInfo}>Visits: {selectedArticle.info.visit} | Likes: {selectedArticle.info.likecount} | Published: {selectedArticle.info.bp_subsection_first_enabled_at}</Text>
              <Text style={styles.articleIntro}>{selectedArticle.info.bp_subsection_intro}</Text>
              <Image
                source={{ uri: `https://wiki.kinglyrobot.com/media/beauty_content_banner_image/${selectedArticle.info.name}` }}
                style={styles.articleImage}
              />
              {selectedArticle.cnt.map((content, index) => (
                <View key={index} style={styles.contentSection}>
                  <Text style={styles.contentTitle}>{content.title}</Text>
                  <RenderHTML
                    contentWidth={contentWidth}
                    source={{ html: content.cnt.replace(/src="\/media\/beauty_content_index_image\//g, 'src="https://wiki.kinglyrobot.com/media/beauty_content_index_image/') }}
                  />
                </View>
              ))}
            </View>
          ) : (
            articles.map((article, index) => (
              <TouchableOpacity key={index} style={styles.articleContainer} onPress={() => handleArticlePress(article.info.bp_subsection_id)}>
                <Image
                  source={{ uri: `https://wiki.kinglyrobot.com/media/beauty_content_banner_image/${article.info.name}` }}
                  style={styles.articleImage}
                />
                <View style={styles.articleTextContainer}>
                  <Text style={styles.articleTitle}>{article.info.bp_subsection_title}</Text>
                  <Text style={styles.articleIntro}>{article.info.bp_subsection_intro}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => setSelectedArticle(null)}>
          <Text style={styles.navButtonText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => {}}>
          <Text style={styles.navButtonText}>🔍 Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => {}}>
          <Text style={styles.navButtonText}>❤️ Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navButtonText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  scrollViewContent: {
    paddingBottom: 0, 
  },
  articleContainer: {
    flexDirection: 'row',
    marginVertical: 5, // Reduce vertical margin to shorten gap between articles
    marginHorizontal: 10,
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
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxHeight: 40, 
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60, // Increased height for higher buttons
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: -10, // Move icons and text up slightly
  },
  navButtonText: {
    fontSize: 12,
    color: '#333',
  },
  articleDetailContainer: {
    padding: 20,
  },
  articleIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  articleInfo: {
    fontSize: 12,
    color: colors.primaryText,
    marginBottom: 10,
  },
  contentSection: {
    marginVertical: 10,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
};

EncyclopediaScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default EncyclopediaScreen;
