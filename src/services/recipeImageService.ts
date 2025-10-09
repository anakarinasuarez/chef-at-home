/**
 * Recipe Image Service
 * Handles getting cached images for recipes by ID
 */

import {
  getCachedRecipeImage,
  getRecipeImageCacheInfo,
  isRecipeImageCached,
} from '@/lib/recipe-image-cache';
import { generateRecipeImageWithOpenAI } from '@/services/openaiImageService';

export interface RecipeImageRequest {
  recipeId: string;
  recipeName: string;
  ingredients: string[];
  cuisine?: string;
  style?: 'photorealistic' | 'artistic' | 'minimalist' | 'gourmet';
}

/**
 * Get cached image for a recipe by ID
 * If not cached, generate a new one and cache it
 */
export const getRecipeImage = async (request: RecipeImageRequest): Promise<string | null> => {
  const {
    recipeId,
    recipeName,
    ingredients,
    cuisine = 'international',
    style = 'photorealistic',
  } = request;

  try {
    // First, check if image is already cached by recipe ID
    const cachedImage = getCachedRecipeImage(recipeId);

    if (cachedImage) {
      console.log(`📦 Using cached image for recipe ID: ${recipeId}`);
      return cachedImage;
    }

    console.log(`🎨 No cached image found for recipe ID: ${recipeId}, generating new one...`);

    // If not cached, generate new image
    const newImage = await generateRecipeImageWithOpenAI({
      recipeName,
      ingredients,
      cuisine,
      style,
    });

    if (newImage && newImage !== '/images/plate.png') {
      // Cache the new image by recipe ID
      const { cacheRecipeImage } = await import('@/lib/recipe-image-cache');
      cacheRecipeImage(recipeId, recipeName, ingredients, newImage);
      console.log(`💾 New image cached for recipe ID: ${recipeId}`);
      return newImage;
    }

    // Fallback to default image
    return '/images/plate.png';
  } catch (error) {
    console.error(`Error getting recipe image for ID ${recipeId}:`, error);
    return '/images/plate.png';
  }
};

/**
 * Check if a recipe image is cached
 */
export const isRecipeImageAvailable = (recipeId: string): boolean => {
  return isRecipeImageCached(recipeId);
};

/**
 * Get recipe image cache information
 */
export const getRecipeImageInfo = (recipeId: string) => {
  return getRecipeImageCacheInfo(recipeId);
};

/**
 * Force regenerate image for a recipe (useful when editing)
 */
export const regenerateRecipeImage = async (
  request: RecipeImageRequest
): Promise<string | null> => {
  const {
    recipeId,
    recipeName,
    ingredients,
    cuisine = 'international',
    style = 'photorealistic',
  } = request;

  try {
    console.log(`🔄 Force regenerating image for recipe ID: ${recipeId}`);

    // Generate new image
    const newImage = await generateRecipeImageWithOpenAI({
      recipeName,
      ingredients,
      cuisine,
      style,
    });

    if (newImage && newImage !== '/images/plate.png') {
      // Update the cached image
      const { updateCachedRecipeImage } = await import('@/lib/recipe-image-cache');
      updateCachedRecipeImage(recipeId, newImage, recipeName, ingredients);
      console.log(`🔄 Updated cached image for recipe ID: ${recipeId}`);
      return newImage;
    }

    return '/images/plate.png';
  } catch (error) {
    console.error(`Error regenerating recipe image for ID ${recipeId}:`, error);
    return '/images/plate.png';
  }
};
