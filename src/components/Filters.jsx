// src/components/Filters.jsx
import React from "react";
import { VscSettings } from "react-icons/vsc";

const Filters = ({ currentFilters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convert string inputs to numbers where required
    let newValue = value;
    if (name === 'maxTime') {
        newValue = parseInt(value, 10);
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue,
    }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
        <VscSettings className="mr-2" />
        Recipe Filters
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Difficulty</label>
          <select 
            name="difficulty" 
            value={currentFilters.difficulty || 'All'} 
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
          >
            <option value="All">Any</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Max Cooking Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Max Time (min)</label>
          <input 
            type="number" 
            name="maxTime" 
            value={currentFilters.maxTime || 60} 
            onChange={handleChange}
            min="5"
            max="180"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
          />
        </div>

        {/* Vegetarian Checkbox */}
        <div className="flex items-center pt-5">
          <input 
            type="checkbox" 
            name="isVegetarian" 
            checked={currentFilters.isVegetarian || false} 
            onChange={handleChange}
            id="vegetarian"
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="vegetarian" className="ml-2 text-sm font-medium text-gray-700">Vegetarian</label>
        </div>
        
        {/* Gluten-Free Checkbox */}
        <div className="flex items-center pt-5">
          <input 
            type="checkbox" 
            name="isGlutenFree" 
            checked={currentFilters.isGlutenFree || false} 
            onChange={handleChange}
            id="glutenFree"
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="glutenFree" className="ml-2 text-sm font-medium text-gray-700">Gluten-Free</label>
        </div>

      </div>
    </div>
  );
};

export default Filters;