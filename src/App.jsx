// src/App.jsx

import React, { useState, useMemo } from 'react';

// 1. UI Components Imports
import Filters from './components/Filters'; 
import IngredientInput from './components/IngredientInput'; 
import RecipeCard from './components/RecipeCard'; 
import LoadingSpinner from './components/LoadingSpinner'; 

// 2. Logic Imports
import { getMatchingRecipes } from './logic/recipeMatcher';

// 3. Icons 
import { VscRocket, VscError, VscSave } from 'react-icons/vsc'; 


const App = () => {
  // State 1: Available Ingredients (from text or image)
  const [availableIngredients, setAvailableIngredients] = useState([]);
  
  // State 2: Filters 
  const [filters, setFilters] = useState({
    difficulty: 'All',
    maxTime: 60,
    isVegetarian: false,
    isGlutenFree: false,
  });

  // State 3: Loading status for AI Service
  const [isLoading, setIsLoading] = useState(false);

  // State 4: Saved Recipes
  const [savedRecipes, setSavedRecipes] = useState(
    JSON.parse(localStorage.getItem('savedRecipes')) || []
  );
  
  // State 5: Error message handling
  const [error, setError] = useState(null);

  // Function to handle saving/unsaving a recipe
  const toggleSave = (recipeId) => {
    const isSaved = savedRecipes.includes(recipeId);
    let newSavedRecipes;

    if (isSaved) {
      newSavedRecipes = savedRecipes.filter(id => id !== recipeId);
    } else {
      newSavedRecipes = [...savedRecipes, recipeId];
    }
    
    setSavedRecipes(newSavedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(newSavedRecipes));
  };


  // Core Logic: Match recipes using useMemo for performance
  const matchedRecipes = useMemo(() => {
    if (availableIngredients.length === 0) return [];
    
    return getMatchingRecipes(availableIngredients, filters);
  }, [availableIngredients, filters]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700 flex items-center justify-center">
          <VscRocket className="mr-3 text-5xl text-red-500" />
          Smart Recipe Generator
        </h1>
        <p className="text-gray-500 mt-2">Find the perfect meal from what you have!</p>
      </header>
      
      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto">
        
        {/* Ingredient Input (Text/Image) */}
        <IngredientInput
          setIngredients={setAvailableIngredients}
          currentIngredients={availableIngredients}
          setIsLoading={setIsLoading}
          setError={setError}
        />

        {/* Filters */}
        <Filters 
          currentFilters={filters} 
          setFilters={setFilters} 
          className="my-6"
        />
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 flex items-center">
            <VscError className="mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center my-12">
            <LoadingSpinner />
            <p className="text-lg text-gray-600 mt-3">Analyzing image and matching recipes...</p>
          </div>
        )}

        {/* Recipe Results */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
          {availableIngredients.length > 0 ? `Matched Recipes (${matchedRecipes.length})` : 'Enter Ingredients to Start'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Render Matched Recipes */}
          {!isLoading && matchedRecipes.length > 0 && matchedRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isSaved={savedRecipes.includes(recipe.id)}
              toggleSave={toggleSave}
            />
          ))}

          {/* No Results Message */}
          {!isLoading && availableIngredients.length > 0 && matchedRecipes.length === 0 && (
            <p className="col-span-full text-center text-xl text-gray-500 p-10 border rounded-lg bg-white shadow-sm">
              <VscError className="inline text-4xl mr-2 text-red-500" />
              Sorry, we couldn't find any recipes matching your ingredients and filters.
            </p>
          )}

          {/* Saved Recipes (Simplified view) */}
          {!isLoading && availableIngredients.length === 0 && savedRecipes.length > 0 && (
            <>
              <h3 className="col-span-full text-xl font-semibold text-gray-700 mt-4 mb-2 flex items-center">
                <VscSave className="mr-2" /> Your Saved Recipes ({savedRecipes.length})
              </h3>
              {/* This message implies that the user has saved recipes, but the detailed list won't render here. */}
              <p className="col-span-full text-center text-md text-gray-500">
                  Enter new ingredients to find matches or refine your saved list.
              </p>
            </>
          )}
        </div>
      </main>
      
    </div>
  );
};

export default App;