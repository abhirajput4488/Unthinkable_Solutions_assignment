// src/logic/aiService.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const API_ENDPOINT = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Ingredient Classification Approach: Calls Google Cloud Vision API to recognize objects.
 */
export const recognizeIngredients = async (imageFile) => {
  if (!API_KEY) {
    console.error("API Key is missing. Check your .env file.");
    return ['error: no api key'];
  }
  
  const base64Image = await fileToBase64(imageFile);

  const payload = {
    requests: [
      {
        image: { content: base64Image },
        // Using LABEL_DETECTION for general ingredient identification
        features: [{ type: 'LABEL_DETECTION', maxResults: 15 }], 
      },
    ],
  };

  try {
    const response = await axios.post(API_ENDPOINT, payload);
    const data = response.data.responses[0];
    
    if (data.labelAnnotations) {
      // Extract, normalize, and filter for results with decent confidence
      const ingredients = data.labelAnnotations
        .filter(label => label.score > 0.7) 
        .map(label => label.description.toLowerCase());
      
      return ingredients;
    }
    
    return [];
  } catch (error) {
    // Basic Error Handling
    console.error("Google Vision API Error:", error.response?.data || error.message);
    return ['recognition_failed']; 
  }
};