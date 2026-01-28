// components/ui/RecipeCard.jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Simple COLORS constant
const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F7F9FC',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8F9BB3',
  lightGray: '#EDF1F7',
  success: '#00C851',
  warning: '#FFBB33',
  danger: '#FF4444',
};

const RecipeCard = ({ recipe, onPress }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return COLORS.success;
      case 'Medium':
        return COLORS.warning;
      case 'Hard':
        return COLORS.danger;
      default:
        return COLORS.gray;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(recipe)}>
      {/* Recipe Image */}
      <Image 
        source={{ uri: recipe.image }} 
        style={styles.image}
      />
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.gray} />
            <Text style={styles.detailText}>
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={14} color={COLORS.gray} />
            <Text style={styles.detailText}>{recipe.servings} servings</Text>
          </View>
          
          <View style={[
            styles.difficulty, 
            { backgroundColor: getDifficultyColor(recipe.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.cuisine}>{recipe.cuisine}</Text>
          
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={COLORS.warning} />
            <Text style={styles.ratingText}>{recipe.rating?.toFixed(1) || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  difficulty: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuisine: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.black,
    marginLeft: 4,
  },
});

// ✅ Important: Export karna
export default RecipeCard;