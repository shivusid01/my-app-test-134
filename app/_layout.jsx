import { Stack } from 'expo-router';
import { AuthProvider } from '../hooks/useAuth';
import { FavouritesProvider } from '../context/FavouritesContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavouritesProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="login"
            options={{ title: 'Login' }}
          />

          <Stack.Screen
            name="register"
            options={{ title: 'Sign Up' }}
          />

          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="recipe-detail"
            options={{ title: 'Recipe Details' }}
          />

          <Stack.Screen
            name="create-recipe"
            options={{ title: 'Create Recipe' }}
          />
        </Stack>
      </FavouritesProvider>
    </AuthProvider>
  );
}
