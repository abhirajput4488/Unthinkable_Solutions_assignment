// src/logic/recipeMatcher.js
import recipeData from '../data/recipes.json';

const normalize = (items) => new Set(items.map(i => i.toLowerCase().trim()));

const calculateMatchScore = (recipeIngredients, availableSet) => {
  let matches = 0;
  for (const requiredIng of recipeIngredients) {
    if (availableSet.has(requiredIng.toLowerCase().trim())) {
      matches++;
    }
  }
  
  const totalRequired = recipeIngredients.length;
  const matchPercentage = (matches / totalRequired) * 100;
  
  return { 
    matches, 
    matchPercentage: parseFloat(matchPercentage.toFixed(1)), 
    // For Substitution Suggestions
    missing: recipeIngredients.filter(ing => !availableSet.has(ing.toLowerCase().trim())) 
  };
};

export const getMatchingRecipes = (availableIngredients, filters) => {
  if (availableIngredients.length === 0) return [];

  const availableSet = normalize(availableIngredients);

  // 1. Filter by Dietary Restrictions and other constraints
  let filteredRecipes = recipeData.filter(recipe => {
    // Dietary restrictions handling (Must match exactly if filter is on)
    if (filters.isVegetarian && !recipe.is_vegetarian) return false;
    if (filters.isGlutenFree && !recipe.is_gluten_free) return false;

    // Time and Difficulty filters
    if (filters.maxTime && recipe.cooking_time > filters.maxTime) return false;
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;
    
    return true;
  });

  // 2. Score recipes and combine data
  const scoredRecipes = filteredRecipes.map(recipe => {
    const score = calculateMatchScore(recipe.ingredients, availableSet);
    return { ...recipe, score };
  });

  // 3. Filter out recipes with 0 matches and sort
  const matchedRecipes = scoredRecipes.filter(recipe => recipe.score.matches > 0);

  // 4. Recipe Matching Logic: Sort by highest percentage match first
  matchedRecipes.sort((a, b) => b.score.matchPercentage - a.score.matchPercentage);
  
  return matchedRecipes;
};