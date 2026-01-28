import api from './axios';

export const recipeApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  update: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  search: async (query, params = {}) => {
    const response = await api.get('/recipes/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  getCuisines: async () => {
    const response = await api.get('/recipes/cuisines');
    return response.data;
  },

  getTags: async () => {
    const response = await api.get('/recipes/tags');
    return response.data;
  },

  getByCuisine: async (cuisine, params = {}) => {
    const response = await api.get(`/recipes/cuisine/${cuisine}`, { params });
    return response.data;
  },

  getByMealType: async (mealType, params = {}) => {
    const response = await api.get(`/recipes/meal/${mealType}`, { params });
    return response.data;
  },
};