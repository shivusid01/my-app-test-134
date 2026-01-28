import { useState, useCallback } from 'react';
import { mealPlanApi } from '../api/mealPlans';
import { useAuth } from './useAuth';

export const useMealPlans = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRecipeToMealPlan = useCallback(async (mealPlanId, recipeId, servings = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await mealPlanApi.addRecipe(mealPlanId, {
        recipeId,
        servings
      });

      console.log('Recipe added to meal plan:', response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add recipe to meal plan';
      setError(errorMessage);
      console.error('Error adding recipe to meal plan:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAndAddRecipe = useCallback(async (mealPlanName, recipeId, servings = 1) => {
    try {
      setLoading(true);
      setError(null);

      // First create a meal plan
      const mealPlanResponse = await mealPlanApi.create({
        name: mealPlanName,
        description: `Meal plan with ${mealPlanName}`,
      });

      if (mealPlanResponse.success) {
        const mealPlanId = mealPlanResponse.data._id;

        // Then add the recipe to it
        const recipeResponse = await mealPlanApi.addRecipe(mealPlanId, {
          recipeId,
          servings
        });

        console.log('Meal plan created and recipe added:', recipeResponse);
        return recipeResponse;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create meal plan';
      setError(errorMessage);
      console.error('Error creating meal plan and adding recipe:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addRecipeToMealPlan,
    createAndAddRecipe,
    loading,
    error
  };
};
