import Ionicons from 'react-native-vector-icons/Ionicons';

export const ICONS = {
  HOME: (color, size) => <Ionicons name="home" size={size} color={color} />,
  RECIPE: (color, size) => <Ionicons name="restaurant" size={size} color={color} />,
  MEAL_PLAN: (color, size) => <Ionicons name="calendar" size={size} color={color} />,
  PROFILE: (color, size) => <Ionicons name="person" size={size} color={color} />,
  FAVORITE: (color, size) => <Ionicons name="heart" size={size} color={color} />,
  SEARCH: (color, size) => <Ionicons name="search" size={size} color={color} />,
  ADD: (color, size) => <Ionicons name="add-circle" size={size} color={color} />,
  BACK: (color, size) => <Ionicons name="arrow-back" size={size} color={color} />,
  EDIT: (color, size) => <Ionicons name="create" size={size} color={color} />,
  DELETE: (color, size) => <Ionicons name="trash" size={size} color={color} />,
  LOGOUT: (color, size) => <Ionicons name="log-out" size={size} color={color} />,
};