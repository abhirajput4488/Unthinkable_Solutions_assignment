import React from "react";

const Filters = ({ currentFilters, setFilters }) => {
  const update = (patch) => setFilters(prev => ({ ...prev, ...patch }));

  return (
    <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Recipe Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Difficulty</label>
          <select
            className="w-full p-2 border rounded-md"
            value={currentFilters.difficulty}
            onChange={(e) => update({ difficulty: e.target.value })}
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Max Time (min)</label>
          <input
            type="number"
            min="1"
            className="w-full p-2 border rounded-md"
            value={currentFilters.maxTime}
            onChange={(e) => update({ maxTime: Number(e.target.value) })}
          />
        </div>

        <div className="flex gap-4 items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentFilters.isVegetarian}
              onChange={(e) => update({ isVegetarian: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Vegetarian</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentFilters.isGlutenFree}
              onChange={(e) => update({ isGlutenFree: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Gluten-Free</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Filters;
