/**
 * Recipe Image Cache Manager
 * Handles caching of images by recipe ID for persistent storage
 */

interface RecipeImageCacheItem {
  imageUrl: string;
  recipeId: string;
  recipeName: string;
  ingredients: string[];
  expires: number;
  created: number;
}

// Global server cache that persists across compilations
declare global {
  var recipeImageCacheGlobal: Map<string, RecipeImageCacheItem> | undefined;
}

// Server-side cache storage for recipe images
let recipeImageCache: Map<string, RecipeImageCacheItem>;

// Initialize cache from global or create new one
const initializeCache = () => {
  if (typeof window === 'undefined') {
    if (!global.recipeImageCacheGlobal) {
      global.recipeImageCacheGlobal = new Map();
      console.log('🔄 Recipe image cache initialized (global server cache)');
    } else {
      console.log('📦 Recipe image cache restored from global cache');
    }
    recipeImageCache = global.recipeImageCacheGlobal;
  } else {
    recipeImageCache = new Map();
  }
};

// Initialize cache on module load
initializeCache();

// Generate cache key for recipe images by ID
const getRecipeImageCacheKey = (recipeId: string): string => {
  return `recipe_img_${recipeId}`;
};

// Cache image by recipe ID
export const cacheRecipeImage = (
  recipeId: string,
  recipeName: string,
  ingredients: string[],
  imageUrl: string,
  ttlSeconds: number = 86400 * 7 // 7 days default for recipe images
): void => {
  const cacheKey = getRecipeImageCacheKey(recipeId);

  const cachedItem: RecipeImageCacheItem = {
    imageUrl,
    recipeId,
    recipeName,
    ingredients: [...ingredients], // Copy array
    expires: Date.now() + ttlSeconds * 1000,
    created: Date.now(),
  };

  recipeImageCache.set(cacheKey, cachedItem);
  console.log(`💾 Recipe image cached for ID: ${recipeId} (TTL: ${ttlSeconds}s)`);
};

// Get cached image by recipe ID
export const getCachedRecipeImage = (recipeId: string): string | null => {
  if (!recipeId) {
    console.log(`❌ No recipe ID provided for cache lookup`);
    return null;
  }

  const cacheKey = getRecipeImageCacheKey(recipeId);
  const cachedItem = recipeImageCache.get(cacheKey);

  if (!cachedItem) {
    console.log(`❌ No cached image found for recipe ID: ${recipeId}`);
    return null;
  }

  // Check if expired
  if (Date.now() > cachedItem.expires) {
    recipeImageCache.delete(cacheKey);
    console.log(`⏰ Cached image expired for recipe ID: ${recipeId}`);
    return null;
  }

  console.log(`📦 Using cached image for recipe ID: ${recipeId}`);
  return cachedItem.imageUrl;
};

// Update cached image when recipe is edited
export const updateCachedRecipeImage = (
  recipeId: string,
  newImageUrl: string,
  newRecipeName?: string,
  newIngredients?: string[]
): void => {
  const cacheKey = getRecipeImageCacheKey(recipeId);
  const existingItem = recipeImageCache.get(cacheKey);

  if (existingItem) {
    const updatedItem: RecipeImageCacheItem = {
      ...existingItem,
      imageUrl: newImageUrl,
      recipeName: newRecipeName || existingItem.recipeName,
      ingredients: newIngredients || existingItem.ingredients,
      created: Date.now(), // Update creation time
    };

    recipeImageCache.set(cacheKey, updatedItem);
    console.log(`🔄 Updated cached image for recipe ID: ${recipeId}`);
  } else {
    // If no existing cache, create new one
    cacheRecipeImage(
      recipeId,
      newRecipeName || 'Unknown Recipe',
      newIngredients || [],
      newImageUrl
    );
  }
};

// Remove cached image when recipe is deleted
export const removeCachedRecipeImage = (recipeId: string): void => {
  const cacheKey = getRecipeImageCacheKey(recipeId);
  const existed = recipeImageCache.delete(cacheKey);

  if (existed) {
    console.log(`🗑️ Removed cached image for recipe ID: ${recipeId}`);
  }
};

// Clean expired recipe images
export const cleanExpiredRecipeImages = (): number => {
  let cleanedCount = 0;
  const now = Date.now();

  for (const [key, item] of recipeImageCache.entries()) {
    if (now > item.expires) {
      recipeImageCache.delete(key);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} expired recipe image cache entries`);
  }

  return cleanedCount;
};

// Get recipe image cache statistics
export const getRecipeImageCacheStats = (): {
  totalRecipeImages: number;
  expiredRecipeImages: number;
  memoryUsage: string;
} => {
  const now = Date.now();
  let expiredCount = 0;

  for (const item of recipeImageCache.values()) {
    if (now > item.expires) {
      expiredCount++;
    }
  }

  // Estimate memory usage
  const estimatedSize = JSON.stringify(Array.from(recipeImageCache.entries())).length;
  const memoryUsage = `${Math.round(estimatedSize / 1024)} KB`;

  return {
    totalRecipeImages: recipeImageCache.size,
    expiredRecipeImages: expiredCount,
    memoryUsage,
  };
};

// Clear all cached recipe images
export const clearAllCachedRecipeImages = (): void => {
  const count = recipeImageCache.size;
  recipeImageCache.clear();
  console.log(`🗑️ Cleared ${count} cached recipe images`);
};

// Get all cached recipe image IDs (for debugging)
export const getAllCachedRecipeImageIds = (): string[] => {
  return Array.from(recipeImageCache.values()).map(item => item.recipeId);
};

// Check if recipe image is cached
export const isRecipeImageCached = (recipeId: string): boolean => {
  const cacheKey = getRecipeImageCacheKey(recipeId);
  const cachedItem = recipeImageCache.get(cacheKey);

  if (!cachedItem) return false;

  // Check if expired
  if (Date.now() > cachedItem.expires) {
    recipeImageCache.delete(cacheKey);
    return false;
  }

  return true;
};

// Get cache info for a specific recipe
export const getRecipeImageCacheInfo = (
  recipeId: string
): {
  isCached: boolean;
  imageUrl?: string;
  recipeName?: string;
  ingredients?: string[];
  expires?: number;
  created?: number;
} => {
  const cacheKey = getRecipeImageCacheKey(recipeId);
  const cachedItem = recipeImageCache.get(cacheKey);

  if (!cachedItem) {
    return { isCached: false };
  }

  // Check if expired
  if (Date.now() > cachedItem.expires) {
    recipeImageCache.delete(cacheKey);
    return { isCached: false };
  }

  return {
    isCached: true,
    imageUrl: cachedItem.imageUrl,
    recipeName: cachedItem.recipeName,
    ingredients: cachedItem.ingredients,
    expires: cachedItem.expires,
    created: cachedItem.created,
  };
};

// Initialize cache cleanup interval for recipe images (run every 2 hours)
let recipeImageCleanupInterval: NodeJS.Timeout | null = null;

export const startRecipeImageCacheCleanup = (): void => {
  if (recipeImageCleanupInterval) {
    clearInterval(recipeImageCleanupInterval);
  }

  recipeImageCleanupInterval = setInterval(
    () => {
      cleanExpiredRecipeImages();
    },
    2 * 60 * 60 * 1000
  ); // 2 hours

  console.log('🔄 Recipe image cache cleanup started (every 2 hours)');
};

export const stopRecipeImageCacheCleanup = (): void => {
  if (recipeImageCleanupInterval) {
    clearInterval(recipeImageCleanupInterval);
    recipeImageCleanupInterval = null;
    console.log('⏹️ Recipe image cache cleanup stopped');
  }
};
