import api from './axios';

export const mealPlanApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/meal-plans', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/meal-plans/${id}`);
    return response.data;
  },

  create: async (mealPlanData) => {
    const response = await api.post('/meal-plans', mealPlanData);
    return response.data;
  },

  update: async (id, mealPlanData) => {
    const response = await api.put(`/meal-plans/${id}`, mealPlanData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/meal-plans/${id}`);
    return response.data;
  },

  addRecipe: async (mealPlanId, recipeData) => {
    const response = await api.post(`/meal-plans/${mealPlanId}/recipes`, recipeData);
    return response.data;
  },
};