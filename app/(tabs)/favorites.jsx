import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useFavourites } from '../../context/FavouritesContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FavoritesTab() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    favouritesRecipes, 
    removeFromFavourites, 
    loading, 
    refreshFavourites 
  } = useFavourites();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFavourites();
    setRefreshing(false);
  };

  const handleRecipePress = (recipeId) => {
    router.push({
      pathname: '/recipe-detail',
      params: { id: recipeId }
    });
  };

  const handleRemoveFavourite = (recipeId, recipeName) => {
    Alert.alert(
      'Remove from Favorites',
      `Are you sure you want to remove "${recipeName}" from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromFavourites(recipeId)
        }
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => handleRecipePress(item._id)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.favoriteImage}
        resizeMode="cover"
      />
      
      <View style={styles.favoriteContent}>
        <Text style={styles.favoriteTitle} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.favoriteDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="restaurant" size={14} color="#8F9BB3" />
            <Text style={styles.detailText}>{item.cuisine}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#8F9BB3" />
            <Text style={styles.detailText}>
              {item.prepTimeMinutes + item.cookTimeMinutes} min
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={14} color="#8F9BB3" />
            <Text style={styles.detailText}>{item.servings} servings</Text>
          </View>
        </View>
        
        <View style={styles.favoriteFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFBB33" />
            <Text style={styles.ratingText}>
              {item.rating?.toFixed(1) || '4.5'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveFavourite(item._id, item.name)}
            activeOpacity={0.7}
          >
            <Ionicons name="heart" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Ionicons name="heart-outline" size={80} color="#8F9BB3" />
          <Text style={styles.authTitle}>Login Required</Text>
          <Text style={styles.authText}>
            Please login to view your favorite recipes
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favouritesRecipes}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FF6B6B"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>My Favorites</Text>
              <Text style={styles.count}>
                {favouritesRecipes.length} recipe{favouritesRecipes.length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            {favouritesRecipes.length > 0 && (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={() => {
                  Alert.alert(
                    'Clear All Favorites',
                    'Are you sure you want to remove all recipes from favorites?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Clear All', 
                        style: 'destructive',
                        onPress: () => {
                          favouritesRecipes.forEach(recipe => {
                            removeFromFavourites(recipe._id);
                          });
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={100} color="#8F9BB3" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart icon on any recipe to add it here
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/recipes')}
              activeOpacity={0.8}
            >
              <Text style={styles.browseButtonText}>Browse Recipes</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
  },
  authText: {
    fontSize: 16,
    color: '#8F9BB3',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  clearAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
  },
  clearAllText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 30,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  favoriteImage: {
    width: 100,
    height: 100,
  },
  favoriteContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 20,
  },
  favoriteDetails: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#8F9BB3',
    marginLeft: 4,
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#000000',
    marginLeft: 4,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8F9BB3',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  browseButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});