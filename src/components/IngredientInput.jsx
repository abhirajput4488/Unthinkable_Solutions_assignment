// src/components/IngredientInput.jsx

import React, { useState, useRef } from 'react';
import { VscSearch, VscClearAll, VscCloudUpload } from 'react-icons/vsc';
import { recognizeIngredients } from '../logic/aiService';

const IngredientInput = ({ 
    setIngredients, 
    currentIngredients, 
    setIsLoading, 
    setError 
}) => {

  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null);

  // Convert text → ingredients array
  const parseIngredients = (text) => {
    return text
      .toLowerCase()
      .split(/[,\n\s]+/)
      .filter(i => i.trim().length > 0);
  };

  // ===========================
  //  IMAGE UPLOAD + TENSORFLOW
  // ===========================
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError && setError(null);
    setIsLoading && setIsLoading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const imgURL = reader.result;
        setPreviewSrc(imgURL);

        // Call TensorFlow Model
        const detected = await recognizeIngredients(imgURL);

        if (!detected || detected.length === 0) {
          setError && setError("No ingredients detected. Try a clearer image.");
        }

        // Merge with manually typed ingredients
        const fromText = parseIngredients(textInput);
        const finalList = [...new Set([...fromText, ...(detected || [])])];

        setIngredients(finalList);
        setTextInput(finalList.join(', '));

      } catch (err) {
        console.error(err);
        setError && setError(err.message || "Image analysis failed.");
      } finally {
        setIsLoading && setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError && setError("Failed to read the image file.");
      setIsLoading && setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };


  // ===========================
  //  TEXT INPUT
  // ===========================
  const handleFindRecipes = () => {
    setError && setError(null);

    const parsed = parseIngredients(textInput);

    if (parsed.length === 0) {
      setIngredients([]);
      setError && setError("Please enter at least one ingredient.");
      return;
    }

    setIngredients(parsed);
  };

  const handleClear = () => {
    setError && setError(null);
    setTextInput('');
    setIngredients([]);
    setPreviewSrc(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">What do you have?</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4 items-stretch">

        {/* IMAGE UPLOAD */}
        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
          <p className="text-sm text-gray-500 mb-2">Upload Image</p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            aria-label="Upload ingredients image"
          />

          <label
            htmlFor="image-upload"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer"
          >
            <VscCloudUpload className="mr-2" /> Upload
          </label>

          {previewSrc && (
            <img
              src={previewSrc}
              alt="preview"
              className="mt-3 max-w-[160px] rounded-md shadow-sm"
            />
          )}
        </div>

        {/* TEXT INPUT */}
        <textarea
          className="flex-1 w-full p-3 border rounded-lg resize-none h-24"
          placeholder="flour, milk, tomato, potato..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleFindRecipes}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg inline-flex items-center"
          aria-label="Find Recipes"
        >
          <VscSearch className="inline mr-2" />
          Find Recipes
        </button>

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 rounded-lg inline-flex items-center"
          aria-label="Clear"
        >
          <VscClearAll className="inline mr-1" />
          Clear
        </button>
      </div>

      {currentIngredients && currentIngredients.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="font-semibold text-sm mb-2">Detected Ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {currentIngredients.map((ing, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
              >
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
