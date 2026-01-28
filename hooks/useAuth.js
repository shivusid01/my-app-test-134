// hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { authApi } from '../api/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('recipe_app_token');
      const storedUser = await AsyncStorage.getItem('recipe_app_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        const { token, ...userData } = response.data;
        
        // Save to storage
        await AsyncStorage.setItem('recipe_app_token', token);
        await AsyncStorage.setItem('recipe_app_user', JSON.stringify(userData));
        
        // Update state
        setToken(token);
        setUser(userData);
        
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      
      if (response.success) {
        const { token, ...userData } = response.data;
        
        // Save to storage
        await AsyncStorage.setItem('recipe_app_token', token);
        await AsyncStorage.setItem('recipe_app_user', JSON.stringify(userData));
        
        // Update state
        setToken(token);
        setUser(userData);
        
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      
      // Clear AsyncStorage
      await AsyncStorage.multiRemove(['recipe_app_token', 'recipe_app_user']);
      
      // Clear state
      setUser(null);
      setToken(null);
      
      console.log('Logout successful');
      
      // Navigate to login with replace to clear navigation stack
      setTimeout(() => {
        router.replace('/login');
      }, 100);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state even if storage fails
      setUser(null);
      setToken(null);
      router.replace('/login');
      return { success: true };
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    AsyncStorage.setItem('recipe_app_user', JSON.stringify({ ...user, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};