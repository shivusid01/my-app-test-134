// app/(tabs)/index.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeTab() {
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch featured recipes (highest rated)
      const featuredResponse = await axios.get(`${API_BASE_URL}/recipes`, {
        params: { limit: 6, sortBy: '-rating' }
      });
      
      // Fetch recent recipes
      const recentResponse = await axios.get(`${API_BASE_URL}/recipes`, {
        params: { limit: 6, sortBy: '-createdAt' }
      });
      
      // Fetch cuisines
      const cuisinesResponse = await axios.get(`${API_BASE_URL}/recipes/cuisines`);
      
      if (featuredResponse.data.success) {
        setFeaturedRecipes(featuredResponse.data.data.recipes);
      }
      
      if (recentResponse.data.success) {
        setRecentRecipes(recentResponse.data.data.recipes);
      }
      
      if (cuisinesResponse.data.success) {
        setCategories(cuisinesResponse.data.data.slice(0, 8));
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback dummy data
      setCategories(['Italian', 'Indian', 'Mexican', 'Thai', 'Japanese', 'Chinese', 'American', 'French']);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleRecipePress = (recipeId) => {
    router.push({
      pathname: '/recipe-detail',
      params: { id: recipeId }
    });
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item._id)}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={1}>{item.name}</Text>
        <View style={styles.recipeDetails}>
          <View style={styles.recipeDetail}>
            <Ionicons name="time-outline" size={12} color="#8F9BB3" />
            <Text style={styles.detailText}>
              {item.prepTimeMinutes + item.cookTimeMinutes} min
            </Text>
          </View>
          <View style={styles.recipeDetail}>
            <Ionicons name="people-outline" size={12} color="#8F9BB3" />
            <Text style={styles.detailText}>{item.servings} servings</Text>
          </View>
        </View>
        <View style={styles.recipeFooter}>
          <Text style={styles.recipeCuisine}>{item.cuisine}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#FFBB33" />
            <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = (category) => (
    <TouchableOpacity 
      key={category}
      style={styles.categoryCard}
      onPress={() => router.push(`/recipes?cuisine=${category}`)}
    >
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryIconText}>{category.charAt(0)}</Text>
      </View>
      <Text style={styles.categoryText}>{category}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'Guest'}</Text>
            <Text style={styles.subtitle}>What would you like to cook today?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>
                  {user?.firstName?.charAt(0) || 'G'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={20} color="#8F9BB3" />
          <Text style={styles.searchPlaceholder}>Search recipes...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map(renderCategoryItem)}
          </ScrollView>
        </View>

        {/* Featured Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Recipes</Text>
            <TouchableOpacity onPress={() => router.push('/recipes?sortBy=-rating')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {featuredRecipes.length > 0 ? (
            <FlatList
              horizontal
              data={featuredRecipes}
              renderItem={renderRecipeItem}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#8F9BB3" />
              <Text style={styles.emptyText}>No featured recipes found</Text>
            </View>
          )}
        </View>

        {/* Recent Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <TouchableOpacity onPress={() => router.push('/recipes?sortBy=-createdAt')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentRecipes.length > 0 ? (
            <FlatList
              horizontal
              data={recentRecipes}
              renderItem={renderRecipeItem}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#8F9BB3" />
              <Text style={styles.emptyText}>No recent recipes found</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/create-recipe')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFE5E5' }]}>
              <Ionicons name="add" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.actionText}>Add Recipe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/meal-plans')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E5F7F6' }]}>
              <Ionicons name="calendar" size={24} color="#4ECDC4" />
            </View>
            <Text style={styles.actionText}>Meal Plans</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8F9BB3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#8F9BB3',
    marginTop: 4,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  profilePlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#8F9BB3',
    marginLeft: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  categoryIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  categoryText: {
    fontSize: 12,
    color: '#8F9BB3',
    fontWeight: '500',
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  recipeCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 10,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCuisine: {
    fontSize: 12,
    color: '#8F9BB3',
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    color: '#000000',
    marginLeft: 2,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#8F9BB3',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '45%',
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#8F9BB3',
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});