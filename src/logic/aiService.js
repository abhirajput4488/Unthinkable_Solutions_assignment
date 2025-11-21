// src/logic/aiService.js

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

// TensorFlow model load caching
let model = null;

/**
 * Load COCO-SSD model (load once)
 */
async function loadModel() {
    if (!model) {
        model = await cocoSsd.load();
        console.log("TensorFlow model loaded");
    }
    return model;
}

/**
 * Detect ingredients from image using TensorFlow
 */
export async function recognizeIngredients(imageDataUrl) {
    const model = await loadModel();

    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageDataUrl;

        img.onload = async () => {
            const predictions = await model.detect(img);

            console.log("TF Predictions:", predictions);

            // Useful food labels from COCO model
            const FOOD_ITEMS = [
                "banana", "apple", "orange", "carrot", "broccoli", "lettuce",
                "cucumber", "pizza", "cake", "bowl", "hot dog", "donut",
                "sandwich", "cup"
            ];

            const detected = predictions
                .map(p => p.class.toLowerCase())
                .filter(p => FOOD_ITEMS.includes(p));

            resolve(detected);
        };
    });
}
