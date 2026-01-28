import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFavourites } from '../context/FavouritesContext';
import { useAuth } from '../hooks/useAuth';
import { useMealPlans } from '../hooks/useMealPlans';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { user } = useAuth();
  const { addRecipeToMealPlan, createAndAddRecipe, loading: mealPlanLoading } = useMealPlans();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(1);
  const [expandedSection, setExpandedSection] = useState('ingredients');
  const [similarRecipes, setSimilarRecipes] = useState([]);

  useEffect(() => {
    fetchRecipe();
    fetchSimilarRecipes();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
      if (response.data.success) {
        setRecipe(response.data.data);
        setServings(response.data.data.servings || 1);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        params: { 
          cuisine: recipe?.cuisine,
          limit: 4,
          page: 1 
        }
      });
      if (response.data.success) {
        setSimilarRecipes(response.data.data.recipes.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error('Error fetching similar recipes:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this delicious ${recipe.name} recipe! ${recipe.name}`,
        url: recipe.image,
        title: recipe.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToMealPlan = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to add recipes to meal plans',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/login') }
        ]
      );
      return;
    }

    Alert.prompt(
      'Add to Meal Plan',
      'Enter meal plan name or leave empty to add to existing',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async (mealPlanName) => {
            try {
              if (mealPlanName && mealPlanName.trim()) {
                // Create new meal plan and add recipe
                await createAndAddRecipe(mealPlanName, id, servings);
                Alert.alert('Success', `Recipe added to meal plan "${mealPlanName}"`);
              } else {
                // Navigate to meal plans to select existing one
                router.push({
                  pathname: '/meal-plans',
                  params: { addRecipeId: id, servings }
                });
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to add recipe to meal plan');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const calculateIngredientQuantity = (ingredient, index) => {
    // Simple parsing for ingredient quantities
    const words = ingredient.split(' ');
    if (words.length > 0 && !isNaN(parseFloat(words[0]))) {
      const quantity = parseFloat(words[0]);
      const adjusted = (quantity / recipe.servings) * servings;
      return ingredient.replace(words[0], adjusted.toFixed(1));
    }
    return ingredient;
  };

  const adjustServings = (operation) => {
    if (operation === 'increase') {
      setServings(prev => prev + 1);
    } else if (operation === 'decrease' && servings > 1) {
      setServings(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>Recipe not found</Text>
        <TouchableOpacity
          style={styles.backHomeButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.backHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const favourite = isFavourite(recipe._id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Recipe Image with Header Buttons */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.rightButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => toggleFavourite(recipe._id)}
            >
              <Ionicons
                name={favourite ? 'heart' : 'heart-outline'}
                size={24}
                color={favourite ? '#FF6B6B' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Recipe Basic Info */}
      <View style={styles.basicInfo}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.cuisine}>{recipe.cuisine}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color="#FF6B6B" />
            <Text style={styles.statValue}>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Ionicons name="restaurant-outline" size={20} color="#FF6B6B" />
            <Text style={styles.statValue}>{recipe.difficulty}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={20} color="#FF6B6B" />
            <Text style={styles.statValue}>{recipe.caloriesPerServing || 'N/A'}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton, mealPlanLoading && styles.buttonDisabled]}
          onPress={handleAddToMealPlan}
          disabled={mealPlanLoading}
        >
          {mealPlanLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Add to Meal Plan</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => {
            // Add to shopping list functionality
            Alert.alert('Coming Soon', 'Shopping list feature coming soon!');
          }}
        >
          <Ionicons name="cart-outline" size={20} color="#FF6B6B" />
          <Text style={styles.secondaryButtonText}>Shopping List</Text>
        </TouchableOpacity>
      </View>

      {/* Servings Adjuster */}
      <View style={styles.servingsContainer}>
        <Text style={styles.servingsLabel}>Servings:</Text>
        <View style={styles.servingsControls}>
          <TouchableOpacity 
            style={styles.servingsButton}
            onPress={() => adjustServings('decrease')}
            disabled={servings <= 1}
          >
            <Ionicons name="remove" size={20} color={servings <= 1 ? '#CBD5E0' : '#4A5568'} />
          </TouchableOpacity>
          
          <Text style={styles.servingsCount}>{servings}</Text>
          
          <TouchableOpacity 
            style={styles.servingsButton}
            onPress={() => adjustServings('increase')}
          >
            <Ionicons name="add" size={20} color="#4A5568" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs for Ingredients/Instructions */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, expandedSection === 'ingredients' && styles.activeTab]}
          onPress={() => setExpandedSection('ingredients')}
        >
          <Text style={[styles.tabText, expandedSection === 'ingredients' && styles.activeTabText]}>
            Ingredients
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, expandedSection === 'instructions' && styles.activeTab]}
          onPress={() => setExpandedSection('instructions')}
        >
          <Text style={[styles.tabText, expandedSection === 'instructions' && styles.activeTabText]}>
            Instructions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ingredients Section */}
      {expandedSection === 'ingredients' && (
        <View style={styles.sectionContent}>
          <FlatList
            data={recipe.ingredients}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.ingredientItem}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>
                  {calculateIngredientQuantity(item, index)}
                </Text>
              </View>
            )}
          />
          
          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Tags:</Text>
              <View style={styles.tagsList}>
                {recipe.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Instructions Section */}
      {expandedSection === 'instructions' && (
        <View style={styles.sectionContent}>
          {recipe.instructions.map((step, index) => (
            <View key={index} style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Author Info */}
      {recipe.userId && (
        <View style={styles.authorContainer}>
          <Text style={styles.authorLabel}>Recipe by:</Text>
          <View style={styles.authorInfo}>
            {recipe.userId.image ? (
              <Image source={{ uri: recipe.userId.image }} style={styles.authorImage} />
            ) : (
              <View style={styles.authorPlaceholder}>
                <Text style={styles.authorInitial}>
                  {recipe.userId.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>
                {recipe.userId.firstName} {recipe.userId.lastName}
              </Text>
              <Text style={styles.authorUsername}>@{recipe.userId.username}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Similar Recipes */}
      {similarRecipes.length > 0 && (
        <View style={styles.similarRecipesContainer}>
          <Text style={styles.similarRecipesTitle}>Similar Recipes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similarRecipes.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.similarRecipeCard}
                onPress={() => router.push(`/recipe-detail?id=${item._id}`)}
              >
                <Image source={{ uri: item.image }} style={styles.similarRecipeImage} />
                <Text style={styles.similarRecipeName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.similarRecipeCuisine}>{item.cuisine}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#8F9BB3',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
  },
  backHomeButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    height: 350,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  basicInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 32,
  },
  cuisine: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8F9BB3',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F7FAFC',
    marginBottom: 20,
  },
  servingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  servingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  servingsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    minWidth: 40,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8F9BB3',
  },
  activeTabText: {
    color: '#FF6B6B',
  },
  sectionContent: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
  tagsContainer: {
    marginTop: 20,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
  authorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F7FAFC',
    marginBottom: 24,
  },
  authorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  authorPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  authorDetails: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  authorUsername: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  similarRecipesContainer: {
    paddingHorizontal: 20,
  },
  similarRecipesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  similarRecipeCard: {
    width: 140,
    marginRight: 12,
  },
  similarRecipeImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  similarRecipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  similarRecipeCuisine: {
    fontSize: 12,
    color: '#8F9BB3',
  },
});