import api from './axios';

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },

  getFavorites: async (params = {}) => {
    const response = await api.get('/users/favorites', { params });
    return response.data;
  },

  addFavorite: async (recipeId) => {
    const response = await api.post(`/users/favorites/${recipeId}`);
    return response.data;
  },

  removeFavorite: async (recipeId) => {
    const response = await api.delete(`/users/favorites/${recipeId}`);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/profile');
    return response.data;
  },
};