/**
 * Universal Cache Manager
 * Uses Enhanced localStorage for reliable client-side caching
 */
import { 
  cacheRecipes,
  getCachedRecipes,
  cacheImage,
  getCachedImage,
  clearAllCache,
  clearRecipesCache,
  clearImagesCache,
  getCacheStats,
  cleanExpiredItems
} from "./localStorage-cache";

export type CacheProvider = "localStorage";

let currentProvider: CacheProvider = "localStorage";

// Initialize cache manager
export const initializeCache = async (): Promise<void> => {
  // Use localStorage for reliable client-side operations
  currentProvider = "localStorage";
  console.log("🚀 Universal Cache initialized with Enhanced localStorage");
};

// Cache recipes data
export const cacheRecipesData = async (
  ingredients: string[],
  servings: number,
  recipes: any[],
  ttlSeconds?: number
): Promise<void> => {
  cacheRecipes(
    ingredients,
    servings,
    recipes,
    ttlSeconds || 3600
  );
};

// Get cached recipes
export const getCachedRecipesData = async (
  ingredients: string[],
  servings: number
): Promise<any[] | null> => {
  return getCachedRecipes(ingredients, servings);
};

// Cache image URL
export const cacheImageData = async (
  recipeName: string,
  ingredients: string[],
  imageUrl: string,
  ttlSeconds?: number
): Promise<void> => {
  cacheImage(
    recipeName,
    ingredients,
    imageUrl,
    ttlSeconds || 86400
  );
};

// Get cached image URL
export const getCachedImageData = async (
  recipeName: string,
  ingredients: string[]
): Promise<string | null> => {
  return getCachedImage(recipeName, ingredients);
};

// Clear all cache
export const clearAllCacheData = async (): Promise<void> => {
  clearAllCache();
};

// Clear recipes cache
export const clearRecipesCacheData = async (): Promise<void> => {
  clearRecipesCache();
};

// Clear images cache
export const clearImagesCacheData = async (): Promise<void> => {
  clearImagesCache();
};

// Get cache statistics
export const getCacheStatistics = async (): Promise<{
  provider: string;
  status: string;
  features: string[];
  details?: any;
}> => {
  const stats = getCacheStats();
  return {
    provider: stats.provider,
    status: "✅ Active",
    features: [
      "Client-side caching",
      "TTL support",
      "Automatic expiration",
      "Memory management",
    ],
    details: stats,
  };
};

// Force specific provider (for testing)
export const forceProvider = (provider: CacheProvider): void => {
  currentProvider = provider;
  console.log(`🔧 Forced cache provider: ${provider}`);
};

// Get current provider
export const getCurrentProvider = (): CacheProvider => {
  return currentProvider;
};

// Clean expired items
export const cleanExpiredCacheItems = async (): Promise<number> => {
  return cleanExpiredItems();
};

// Legacy class-based API for backward compatibility
export class UniversalCacheManager {
  static async initialize(): Promise<void> {
    return initializeCache();
  }

  static async cacheRecipes(
    ingredients: string[],
    servings: number,
    recipes: any[],
    ttlSeconds?: number
  ): Promise<void> {
    return cacheRecipesData(ingredients, servings, recipes, ttlSeconds);
  }

  static async getCachedRecipes(
    ingredients: string[],
    servings: number
  ): Promise<any[] | null> {
    return getCachedRecipesData(ingredients, servings);
  }

  static async cacheImage(
    recipeName: string,
    ingredients: string[],
    imageUrl: string,
    ttlSeconds?: number
  ): Promise<void> {
    return cacheImageData(recipeName, ingredients, imageUrl, ttlSeconds);
  }

  static async getCachedImage(
    recipeName: string,
    ingredients: string[]
  ): Promise<string | null> {
    return getCachedImageData(recipeName, ingredients);
  }

  static async clearAllCache(): Promise<void> {
    return clearAllCacheData();
  }

  static async clearRecipesCache(): Promise<void> {
    return clearRecipesCacheData();
  }

  static async clearImagesCache(): Promise<void> {
    return clearImagesCacheData();
  }

  static async getCacheStats(): Promise<{
    provider: string;
    status: string;
    features: string[];
    details?: any;
  }> {
    return getCacheStatistics();
  }

  static forceProvider(provider: CacheProvider): void {
    return forceProvider(provider);
  }

  static getCurrentProvider(): CacheProvider {
    return getCurrentProvider();
  }

  static async cleanExpiredItems(): Promise<number> {
    return cleanExpiredCacheItems();
  }
}