import React, { useState } from "react";
import { VscStarFull, VscStarEmpty, VscStarHalf, VscHistory, VscSave } from "react-icons/vsc";

const RecipeCard = ({ recipe, isSaved, toggleSave }) => {
  const [open, setOpen] = useState(false);
  const {
    id, name, image, ingredients, cooking_time, difficulty,
    score, is_vegetarian, is_gluten_free, instructions, nutritional_info
  } = recipe;

  const colorFor = pct => {
    if (pct >= 90) return "bg-green-600";
    if (pct >= 70) return "bg-yellow-400";
    return "bg-red-500";
  };

  const stars = (percent) => {
    const arr = []; const rating = percent / 20;
    for (let i=1;i<=5;i++) {
      if (rating >= i) arr.push(<VscStarFull key={i} className="text-yellow-500" />);
      else if (rating >= i-0.5) arr.push(<VscStarHalf key={i} className="text-yellow-500" />);
      else arr.push(<VscStarEmpty key={i} className="text-gray-300" />);
    }
    return arr;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
      {/* image */}
      <div className="relative h-40 md:h-10 w-full">
        {/* <img src={image || "/assets/placeholder.png"} alt={name} className="object-cover w-full h-full" /> */}
        <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded">{difficulty}</div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{name}</h3>
          <button onClick={() => toggleSave(id)} title={isSaved ? "Unsave" : "Save"}>
            <VscSave className={`text-2xl ${isSaved ? "text-red-500" : "text-gray-400"}`} />
          </button>
        </div>

        <div className="flex gap-2 mt-2 items-center">
          <div className="flex items-center gap-1">{stars(score.matchPercentage)}</div>
          <div className="ml-auto text-sm text-gray-600">{score.matchPercentage}%</div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          {score.missing.length > 0 && <div className="text-red-500">Missing: {score.missing.join(", ")}</div>}
        </div>

        <div className="mt-3 flex gap-2 items-center">
          <div className="text-sm px-2 py-1 rounded bg-green-50 text-green-700">{is_vegetarian ? "Veg" : "Non-Veg"}</div>
          {is_gluten_free && <div className="text-sm px-2 py-1 rounded bg-indigo-50 text-indigo-700">Gluten-Free</div>}
          <div className="text-sm px-2 py-1 rounded bg-blue-50 text-blue-700 flex items-center"><VscHistory className="mr-1" /> {cooking_time}m</div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => setOpen(!open)} className="px-3 py-2 bg-violet-600 text-white rounded">Instructions</button>
        </div>

        {/* expandable */}
        <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96 mt-4" : "max-h-0"}`}>
          {open && (
            <div>
              <ol className="list-decimal list-inside text-sm text-gray-700">
                {instructions.map((s,i) => <li key={i}>{s}</li>)}
              </ol>

              {/* nutrition bars */}
              <div className="mt-4">
                <div className="text-sm flex justify-between"><span>Calories</span><span>{nutritional_info.calories}</span></div>
                <div className="h-2 bg-red-200 rounded-full mt-1"><div className={`h-full ${colorFor(nutritional_info.calories)}`} style={{width: `${Math.min(nutritional_info.calories / 5, 100)}%`}}></div></div>

                <div className="text-sm flex justify-between mt-3"><span>Protein</span><span>{nutritional_info.protein} g</span></div>
                <div className="h-2 bg-green-200 rounded-full mt-1"><div className="h-full bg-green-600" style={{width: `${Math.min(nutritional_info.protein * 5, 100)}%`}}></div></div>

                <div className="text-sm flex justify-between mt-3"><span>Carbs</span><span>{nutritional_info.carbs} g</span></div>
                <div className="h-2 bg-yellow-200 rounded-full mt-1"><div className="h-full bg-yellow-500" style={{width: `${Math.min(nutritional_info.carbs * 5, 100)}%`}}></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
