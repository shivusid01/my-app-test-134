import { useState, useCallback } from 'react';
import { recipeApi } from '../api/recipes';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const getRecipes = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.getAll(params);
      if (response.success) {
        setRecipes(response.data.recipes);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecipeById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.getById(id);
      if (response.success) {
        setRecipe(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRecipe = async (recipeData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.create(recipeData);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecipe = async (id, recipeData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.update(id, recipeData);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.delete(id);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const searchRecipes = async (query, params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recipeApi.search(query, params);
      if (response.success) {
        setRecipes(response.data.recipes);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recipes,
    recipe,
    isLoading,
    error,
    pagination,
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    setRecipes,
  };
};