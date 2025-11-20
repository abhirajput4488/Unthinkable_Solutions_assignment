// src/logic/aiService.js

import axios from 'axios';

// Google Cloud Vision API key .env file se load hoga
const API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY; 

/**
 * Image recognition service for identifying ingredients from a base64 image string.
 * This is based on the Google Cloud Vision API endpoint.
 */
export async function recognizeIngredients(base64Image) {
  if (!API_KEY) {
    throw new Error("API Key missing. Please set VITE_GOOGLE_VISION_API_KEY in your .env file.");
  }

  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
  
  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image.split(',')[1], // Remove the "data:image/jpeg;base64," prefix
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 10,
          },
          {
            type: 'OBJECT_LOCALIZATION',
            maxResults: 10,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(endpoint, requestBody);
    
    // Extract labels (ingredients) from the response
    const detections = response.data.responses[0];
    let ingredients = [];

    // Combine results from Label Detection and Object Localization
    if (detections.labelAnnotations) {
      const labels = detections.labelAnnotations.map(anno => anno.description.toLowerCase());
      ingredients = [...ingredients, ...labels];
    }

    if (detections.localizedObjectAnnotations) {
      const objects = detections.localizedObjectAnnotations.map(anno => anno.name.toLowerCase());
      ingredients = [...ingredients, ...objects];
    }

    // Remove duplicates and return top ingredients
    const uniqueIngredients = [...new Set(ingredients)].slice(0, 10);
    
    // Example: ['broccoli', 'tomato', 'onion']
    return uniqueIngredients;

  } catch (error) {
    console.error("AI Service Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to analyze image. Check your API Key and network connection.");
  }
}