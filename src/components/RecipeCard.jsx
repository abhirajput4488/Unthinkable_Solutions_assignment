// src/components/RecipeCard.jsx

// VscStar को हटा दिया गया है, क्योंकि वह Vsc family में मौजूद नहीं है
import React, { useState } from "react";
// VscClock को VscHistory से बदला गया है (जैसा कि पहले fix किया गया था)
import { VscStarFull, VscRocket, VscHistory, VscClose, VscSave } from "react-icons/vsc"; 

const RecipeCard = ({ recipe, isSaved, toggleSave }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const { name, ingredients, cooking_time, difficulty, score, is_vegetarian, is_gluten_free } = recipe;

  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };

  const getMatchColor = (percent) => {
    if (percent === 100) return 'text-green-600';
    if (percent >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-bold text-gray-800 leading-snug">{name}</h4>
          
          <button 
            onClick={() => toggleSave(recipe.id)}
            className="p-1.5 rounded-full transition-colors duration-200"
            title={isSaved ? "Unsave" : "Save Recipe"}
          >
            <VscSave className={`text-2xl ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColor[difficulty]}`}>
            {difficulty}
          </span>
          {is_vegetarian && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white">
              Veg
            </span>
          )}
          {is_gluten_free && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500 text-white">
              Gluten-Free
            </span>
          )}
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
            {/* VscHistory is used instead of VscClock */}
            <VscHistory className="mr-1" /> {cooking_time} min
          </span>
        </div>

        {/* Match Score */}
        <div className="flex items-center justify-between border-t pt-3 mt-3">
          <div className="flex items-center">
            {/* VscStarFull is used for the main score icon */}
            <VscStarFull className={`text-2xl mr-2 ${getMatchColor(score.matchPercentage)}`} />
            <span className={`text-lg font-bold ${getMatchColor(score.matchPercentage)}`}>
              {score.matchPercentage}% Match
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({score.matches} / {ingredients.length} ingredients)
          </span>
        </div>

        {/* Missing Ingredients */}
        {score.missing && score.missing.length > 0 && (
          <p className="mt-3 text-sm text-red-500 border-t pt-3">
            Missing: {score.missing.join(', ')}
          </p>
        )}
      </div>

      {/* Instructions Toggle */}
      <div 
        className="bg-gray-50 border-t cursor-pointer hover:bg-gray-100 transition-colors duration-150 p-4 text-center font-semibold text-gray-700"
        onClick={() => setShowInstructions(!showInstructions)}
      >
        {showInstructions ? 'Hide Instructions' : 'View Instructions'}
      </div>
      
      {showInstructions && (
        <div className="p-5 border-t bg-gray-50">
          <h5 className="font-semibold mb-2">Instructions:</h5>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <div className="mt-4 text-sm text-gray-500">
            <p>Calories: {recipe.nutritional_info.calories} | Protein: {recipe.nutritional_info.protein}g</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;