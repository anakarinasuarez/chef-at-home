/**
 * Enhanced localStorage Cache Service
 * Better than basic localStorage with TTL support
 */
export interface CacheItem<T> {
  data: T;
  expires: number;
  created: number;
}

export class LocalStorageCacheService {
  /**
   * Generate cache key for recipes
   */
  private static getRecipeCacheKey(
    ingredients: string[],
    servings: number
  ): string {
    const ingredientsKey = ingredients.sort().join(",");
    return `recipes_${ingredientsKey}_${servings}`;
  }

  /**
   * Generate cache key for images
   */
  private static getImageCacheKey(
    recipeName: string,
    ingredients: string[]
  ): string {
    const ingredientsKey = ingredients.sort().join(",");
    return `image_${recipeName}_${ingredientsKey}`;
  }

  /**
   * Set data in cache with TTL
   */
  private static setCacheItem<T>(
    key: string,
    data: T,
    ttlSeconds: number = 3600
  ): void {
    if (typeof window === "undefined") return; // Server-side check

    const item: CacheItem<T> = {
      data,
      expires: Date.now() + ttlSeconds * 1000,
      created: Date.now(),
    };

    try {
      localStorage.setItem(key, JSON.stringify(item));
      console.log(`💾 Cached: ${key} (TTL: ${ttlSeconds}s)`);
    } catch (error) {
      console.error("Error setting cache item:", error);
    }
  }

  /**
   * Get data from cache
   */
  private static getCacheItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null; // Server-side check

    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);

      // Check if expired
      if (Date.now() > item.expires) {
        localStorage.removeItem(key);
        console.log(`⏰ Cache expired: ${key}`);
        return null;
      }

      console.log(`📦 Using cached: ${key}`);
      return item.data;
    } catch (error) {
      console.error("Error getting cache item:", error);
      return null;
    }
  }

  /**
   * Cache recipes data
   */
  static cacheRecipes(
    ingredients: string[],
    servings: number,
    recipes: any[],
    ttlSeconds: number = 3600 // 1 hour default
  ): void {
    const cacheKey = this.getRecipeCacheKey(ingredients, servings);
    this.setCacheItem(cacheKey, recipes, ttlSeconds);
  }

  /**
   * Get cached recipes
   */
  static getCachedRecipes(
    ingredients: string[],
    servings: number
  ): any[] | null {
    const cacheKey = this.getRecipeCacheKey(ingredients, servings);
    return this.getCacheItem<any[]>(cacheKey);
  }

  /**
   * Cache image URL
   */
  static cacheImage(
    recipeName: string,
    ingredients: string[],
    imageUrl: string,
    ttlSeconds: number = 86400 // 24 hours default
  ): void {
    const cacheKey = this.getImageCacheKey(recipeName, ingredients);
    this.setCacheItem(cacheKey, imageUrl, ttlSeconds);
  }

  /**
   * Get cached image URL
   */
  static getCachedImage(
    recipeName: string,
    ingredients: string[]
  ): string | null {
    const cacheKey = this.getImageCacheKey(recipeName, ingredients);
    return this.getCacheItem<string>(cacheKey);
  }

  /**
   * Clear all cache
   */
  static clearAllCache(): void {
    if (typeof window === "undefined") return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("recipes_") || key.startsWith("image_"))) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
      console.log(`🗑️ Cleared ${keysToRemove.length} cache entries`);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  /**
   * Clear recipes cache only
   */
  static clearRecipesCache(): void {
    if (typeof window === "undefined") return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("recipes_")) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
      console.log(`🗑️ Cleared ${keysToRemove.length} recipe cache entries`);
    } catch (error) {
      console.error("Error clearing recipes cache:", error);
    }
  }

  /**
   * Clear images cache only
   */
  static clearImagesCache(): void {
    if (typeof window === "undefined") return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("image_")) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
      console.log(`🗑️ Cleared ${keysToRemove.length} image cache entries`);
    } catch (error) {
      console.error("Error clearing images cache:", error);
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): {
    provider: string;
    totalKeys: number;
    recipeKeys: number;
    imageKeys: number;
    expiredKeys: number;
    memoryUsage: string;
  } {
    if (typeof window === "undefined") {
      return {
        provider: "localStorage (Server-side)",
        totalKeys: 0,
        recipeKeys: 0,
        imageKeys: 0,
        expiredKeys: 0,
        memoryUsage: "N/A",
      };
    }

    try {
      let totalKeys = 0;
      let recipeKeys = 0;
      let imageKeys = 0;
      let expiredKeys = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("recipes_") || key.startsWith("image_"))) {
          totalKeys++;

          if (key.startsWith("recipes_")) {
            recipeKeys++;
          } else if (key.startsWith("image_")) {
            imageKeys++;
          }

          // Check if expired
          try {
            const itemStr = localStorage.getItem(key);
            if (itemStr) {
              const item = JSON.parse(itemStr);
              if (Date.now() > item.expires) {
                expiredKeys++;
              }
            }
          } catch (error) {
            // Ignore parsing errors
          }
        }
      }

      // Estimate memory usage
      const estimatedSize = JSON.stringify(localStorage).length;
      const memoryUsage = `${Math.round(estimatedSize / 1024)} KB`;

      return {
        provider: "localStorage",
        totalKeys,
        recipeKeys,
        imageKeys,
        expiredKeys,
        memoryUsage,
      };
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return {
        provider: "localStorage (Error)",
        totalKeys: 0,
        recipeKeys: 0,
        imageKeys: 0,
        expiredKeys: 0,
        memoryUsage: "Error",
      };
    }
  }

  /**
   * Clean expired items
   */
  static cleanExpiredItems(): number {
    if (typeof window === "undefined") return 0;

    let cleanedCount = 0;
    const keysToRemove: string[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("recipes_") || key.startsWith("image_"))) {
          try {
            const itemStr = localStorage.getItem(key);
            if (itemStr) {
              const item = JSON.parse(itemStr);
              if (Date.now() > item.expires) {
                keysToRemove.push(key);
              }
            }
          } catch (error) {
            // Remove corrupted items
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
        cleanedCount++;
      });

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} expired cache items`);
      }
    } catch (error) {
      console.error("Error cleaning expired items:", error);
    }

    return cleanedCount;
  }
}
