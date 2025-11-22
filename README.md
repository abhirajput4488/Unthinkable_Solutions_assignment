# Smart Recipe Generator

A powerful AI-based recipe recommendation system that converts your available ingredients into smart meal suggestions. Built using React + Vite, Tailwind CSS, TensorFlow MobileNet, and custom recipe-matching logic.

---

## Features

### Ingredient Input

* Type ingredients manually
* Upload an image to auto-detect ingredients using TensorFlow MobileNet
* Merges detected and typed ingredients
* Displays detected ingredients as tags

### Smart Recipe Matching

* Matches recipes based on available ingredients
* Shows match percentage
* Highlights missing ingredients
* Recipes sorted by highest match accuracy

### Filtering Options

* Filter by difficulty (Easy / Medium / Hard)
* Set maximum cooking time
* Vegetarian and Gluten-Free filters

### Save Recipes

* Save or unsave any recipe
* Saved recipes persist using localStorage

### Tech Stack

* React + Vite
* Tailwind CSS
* TensorFlow (MobileNet model)
* React Icons
* Custom recipe matching logic

---

## Project Structure

```
smart-recipe-generator/
├─ index.html
├─ package.json
├─ vite.config.js
├─ postcss.config.cjs
├─ tailwind.config.js
├─ src/
│  ├─ main.jsx
│  ├─ index.css
│  ├─ App.jsx
│  ├─ logic/
│  │  ├─ aiService.js
│  │  └─ recipeMatcher.js
│  ├─ components/
│  │  ├─ IngredientInput.jsx
│  │  ├─ Filters.jsx
│  │  ├─ RecipeCard.jsx
│  │  └─ LoadingSpinner.jsx
│  └─ data/
│     └─ recipes.json

```

### 3. Start the development server

```
npm run dev
```

## How AI Ingredient Detection Works

* Uses TensorFlow MobileNet for food image classification
* Extracts top predictions
* Normalizes and cleans ingredient labels
* Merges detected ingredients with manually entered ones
* Passes the final list to the recipe matcher

---

## Recipe Matching Logic

Each recipe is scored using the following logic:

* Count of available ingredients
* Count of missing ingredients
* Match Percentage = (available ingredients / total required ingredients) × 100
* Recipes sorted by:

  1. Highest match percentage
  2. Shortest cooking time

---

## Build for Production

```
npm run build
npm run preview
```


## Future Improvements

* Add AI-based dynamic recipe generation
* Add cuisine selection filters
* Multi-image ingredient recognition

---

## Author

Abhishek Rao
MCA, MNNIT Allahabad

