import recipeData from "../data/recipes.json";

const normalize = (list) =>
  new Set(list.map((i) => i.toLowerCase().trim()));

const calculateScore = (recipeIngredients, availableSet) => {
  let matches = 0;

  recipeIngredients.forEach((ing) => {
    if (availableSet.has(ing.toLowerCase().trim())) {
      matches++;
    }
  });

  const matchPercentage = (matches / recipeIngredients.length) * 100;

  return {
    matches,
    matchPercentage: Number(matchPercentage.toFixed(1)),
    missing: recipeIngredients.filter(
      (ing) => !availableSet.has(ing.toLowerCase().trim())
    ),
  };
};

export const getMatchingRecipes = (availableIngredients, filters) => {
  if (availableIngredients.length === 0) return [];

  const availableSet = normalize(availableIngredients);

  let filtered = recipeData.filter((recipe) => {
    if (filters.isVegetarian && !recipe.is_vegetarian) return false;
    if (filters.isGlutenFree && !recipe.is_gluten_free) return false;
    if (recipe.cooking_time > filters.maxTime) return false;
    if (filters.difficulty !== "All" && recipe.difficulty !== filters.difficulty)
      return false;

    return true;
  });

  const scored = filtered.map((recipe) => ({
    ...recipe,
    score: calculateScore(recipe.ingredients, availableSet),
  }));

  return scored
    .filter((r) => r.score.matches > 0)
    .sort((a, b) => b.score.matchPercentage - a.score.matchPercentage);
};
