import React, { useState, useMemo } from "react";
import Filters from "./components/Filters";
import IngredientInput from "./components/IngredientInput";
import RecipeCard from "./components/RecipeCard";
import LoadingSpinner from "./components/LoadingSpinner";

import { getMatchingRecipes } from "./logic/recipeMatcher";
import { VscError, VscSave } from "react-icons/vsc";

const App = () => {
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    difficulty: "All",
    maxTime: 60,
    isVegetarian: false,
    isGlutenFree: false,
  });

  const [error, setError] = useState(null);

  const [savedRecipes, setSavedRecipes] = useState(
    JSON.parse(localStorage.getItem("savedRecipes")) || []
  );

  const toggleSave = (id) => {
    let updated = [];

    if (savedRecipes.includes(id)) {
      updated = savedRecipes.filter((x) => x !== id);
    } else {
      updated = [...savedRecipes, id];
    }

    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
  };

  const matchedRecipes = useMemo(() => {
    if (availableIngredients.length === 0) return [];
    return getMatchingRecipes(availableIngredients, filters);
  }, [availableIngredients, filters]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          Smart Recipe Generator
        </h1>
        <p className="text-gray-500">Turn your ingredients into meals</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <IngredientInput
          setIngredients={setAvailableIngredients}
          currentIngredients={availableIngredients}
          setIsLoading={setIsLoading}
          setError={setError}
        />

        <Filters currentFilters={filters} setFilters={setFilters} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mt-4 flex items-center">
            <VscError className="mr-2" />
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center my-8">
            <LoadingSpinner />
            <p className="text-gray-600">Analyzing image...</p>
          </div>
        )}

        <h2 className="text-xl font-semibold mt-6">
          {availableIngredients.length === 0
            ? "Start by adding ingredients"
            : `Recipes Found (${matchedRecipes.length})`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {!isLoading &&
            matchedRecipes.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                isSaved={savedRecipes.includes(r.id)}
                toggleSave={toggleSave}
              />
            ))}

          {!isLoading &&
            availableIngredients.length > 0 &&
            matchedRecipes.length === 0 && (
              <p className="col-span-full text-gray-500 text-center p-10 bg-white rounded">
                <VscError className="inline-block text-red-500 text-3xl mr-2" />
                No matching recipes found.
              </p>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
