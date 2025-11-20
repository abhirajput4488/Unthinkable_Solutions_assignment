// src/components/IngredientInput.jsx
import React, { useState, useRef } from "react";
// src/components/IngredientInput.jsx (Line 4)
import { recognizeIngredients } from "../logic/aiService"; 
// VscCamera को VscCloudUpload से बदला गया
import { VscFileCode, VscCloudUpload, VscTrash } from "react-icons/vsc";

const IngredientInput = ({ setIngredients, currentIngredients, setIsLoading, setError }) => {
  const [inputText, setInputText] = useState(currentIngredients.join(', '));
  const fileInputRef = useRef(null);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const newIngredients = inputText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);
      
    setIngredients(newIngredients);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result is the base64 string
        handleImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (base64Image) => {
    setIsLoading(true);
    setIngredients([]); // Clear old ingredients while loading
    
    try {
      const ingredients = await recognizeIngredients(base64Image);
      setIngredients(ingredients);
      setInputText(ingredients.join(', '));
    } catch (err) {
      setError(err.message || "An unknown error occurred during image analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearIngredients = () => {
    setIngredients([]);
    setInputText('');
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">What do you have?</h3>

      {/* Image Input */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150"
        >
          <VscCloudUpload className="mr-2" />
          Upload Image
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          className="hidden" 
        />
        <p className="text-sm text-gray-500">OR list them below:</p>
      </div>

      {/* Text Input */}
      <form onSubmit={handleTextSubmit} className="space-y-4">
        <textarea
          rows="3"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., chicken breast, canned tomato, onion, rice"
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 text-gray-700 resize-none"
        />
        
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-150"
          >
            <VscFileCode className="mr-2" />
            Find Recipes
          </button>
          
          <button
            type="button"
            onClick={clearIngredients}
            className="flex items-center text-sm text-red-500 hover:text-red-700 transition duration-150"
          >
            <VscTrash className="mr-1" />
            Clear
          </button>
        </div>
      </form>
      
      {/* Current Ingredients Display */}
      {currentIngredients.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="font-semibold text-sm text-gray-700 mb-2">Currently Available:</p>
          <div className="flex flex-wrap gap-2">
            {currentIngredients.map((ing, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput;