import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const FavouritesContext = createContext();

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [favouritesRecipes, setFavouritesRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favourites from API
  useEffect(() => {
    if (user && token) {
      fetchFavourites();
    } else {
      setFavourites([]);
      setFavouritesRecipes([]);
      setLoading(false);
    }
  }, [user, token]);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      console.log('Fetching favourites...');
      
      const response = await axios.get(`${API_BASE_URL}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Favourites API Response:', response.data);

      if (response.data.success) {
        // Check different possible response structures
        let favRecipes = [];
        let favIds = [];

        if (response.data.data && Array.isArray(response.data.data)) {
          // Structure 1: { data: [{recipe}, {recipe}] }
          favRecipes = response.data.data;
          favIds = favRecipes.map(recipe => recipe._id);
        } else if (response.data.data && response.data.data.recipes && Array.isArray(response.data.data.recipes)) {
          // Structure 2: { data: { recipes: [{recipe}, {recipe}] } }
          favRecipes = response.data.data.recipes;
          favIds = favRecipes.map(recipe => recipe._id);
        } else if (response.data.data && response.data.data.favouriteRecipes && Array.isArray(response.data.data.favouriteRecipes)) {
          // Structure 3: { data: { favouriteRecipes: [{recipe}, {recipe}] } }
          favRecipes = response.data.data.favouriteRecipes;
          favIds = favRecipes.map(recipe => recipe._id);
        }

        console.log('Processed favourites:', favIds.length, 'recipes');
        setFavourites(favIds);
        setFavouritesRecipes(favRecipes);
      } else {
        console.log('No favourites found');
        setFavourites([]);
        setFavouritesRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching favourites:', error.response?.data || error.message);
      setFavourites([]);
      setFavouritesRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = async (recipeId) => {
    try {
      const isFav = favourites.includes(recipeId);
      console.log('Toggle favourite:', recipeId, 'isFav:', isFav);
      
      if (isFav) {
        // Remove from favourites
        console.log('Removing from favourites...');
        await axios.delete(`${API_BASE_URL}/users/favorites/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update local state
        setFavourites(prev => {
          const newFavs = prev.filter(id => id !== recipeId);
          console.log('New favourites after remove:', newFavs);
          return newFavs;
        });
        
        setFavouritesRecipes(prev => {
          const newRecipes = prev.filter(recipe => recipe._id !== recipeId);
          console.log('New recipes after remove:', newRecipes.length);
          return newRecipes;
        });
      } else {
        // Add to favourites
        console.log('Adding to favourites...');
        const response = await axios.post(`${API_BASE_URL}/users/favorites/${recipeId}`, 
          { },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Add to favourites response:', response.data);

        // Fetch the recipe details
        const recipeResponse = await axios.get(`${API_BASE_URL}/recipes/${recipeId}`);
        if (recipeResponse.data.success) {
          const newRecipe = recipeResponse.data.data;
          setFavourites(prev => {
            const newFavs = [...prev, recipeId];
            console.log('New favourites after add:', newFavs);
            return newFavs;
          });
          
          setFavouritesRecipes(prev => {
            const newRecipes = [...prev, newRecipe];
            console.log('New recipes after add:', newRecipes.length);
            return newRecipes;
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favourite:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || 'Failed to update favourites'}`);
    }
  };

  const addToFavourites = async (recipe) => {
    try {
      console.log('Adding recipe to favourites:', recipe._id);
      const response = await axios.post(`${API_BASE_URL}/users/favorites/${recipe._id}`, 
        { },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Add response:', response.data);
      setFavourites(prev => [...prev, recipe._id]);
      setFavouritesRecipes(prev => [...prev, recipe]);
      return true;
    } catch (error) {
      console.error('Error adding to favourites:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || 'Failed to add to favourites'}`);
      return false;
    }
  };

  const removeFromFavourites = async (recipeId) => {
    try {
      console.log('Removing recipe from favourites:', recipeId);
      await axios.delete(`${API_BASE_URL}/users/favourites/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFavourites(prev => prev.filter(id => id !== recipeId));
      setFavouritesRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
      return true;
    } catch (error) {
      console.error('Error removing from favourites:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || 'Failed to remove from favourites'}`);
      return false;
    }
  };

  const isFavourite = (recipeId) => {
    const isFav = favourites.includes(recipeId);
    console.log('Checking if favourite:', recipeId, 'isFav:', isFav);
    console.log('Current favourites:', favourites);
    return isFav;
  };

  return (
    <FavouritesContext.Provider value={{
      favourites,
      favouritesRecipes,
      loading,
      toggleFavourite,
      addToFavourites,
      removeFromFavourites,
      isFavourite,
      refreshFavourites: fetchFavourites
    }}>
      {children}
    </FavouritesContext.Provider>
  );
};