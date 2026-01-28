import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Text } from 'react-native';
import { useFavourites } from '../../context/FavouritesContext';

const colors = {
  primary: '#FF6B6B',
  inactive: '#8F9BB3',
  background: '#FFFFFF',
  border: '#EDF1F7',
};

export default function TabLayout() {
  const { favourites } = useFavourites();
  const favCount = favourites.length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Recipes Tab - नया टैब जोड़ें */}
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'restaurant' : 'restaurant-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* favorites Tab */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'favorites',
          tabBarBadge: favCount > 0 ? favCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            lineHeight: 16,
          },
          tabBarIcon: ({ focused, color, size }) => (
            <View>
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}