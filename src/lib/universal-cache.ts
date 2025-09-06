/**
 * Universal Cache Manager
 * Uses Enhanced localStorage for reliable client-side caching
 */
import { LocalStorageCacheService } from "./localStorage-cache";

export type CacheProvider = "localStorage";

export class UniversalCacheManager {
  private static provider: CacheProvider = "localStorage";

  /**
   * Initialize cache manager
   */
  static async initialize(): Promise<void> {
    // Use localStorage for reliable client-side operations
    this.provider = "localStorage";
    console.log("🚀 Universal Cache initialized with Enhanced localStorage");
  }

  /**
   * Cache recipes data
   */
  static async cacheRecipes(
    ingredients: string[],
    servings: number,
    recipes: any[],
    ttlSeconds?: number
  ): Promise<void> {
    LocalStorageCacheService.cacheRecipes(
      ingredients,
      servings,
      recipes,
      ttlSeconds || 3600
    );
  }

  /**
   * Get cached recipes
   */
  static async getCachedRecipes(
    ingredients: string[],
    servings: number
  ): Promise<any[] | null> {
    return LocalStorageCacheService.getCachedRecipes(ingredients, servings);
  }

  /**
   * Cache image URL
   */
  static async cacheImage(
    recipeName: string,
    ingredients: string[],
    imageUrl: string,
    ttlSeconds?: number
  ): Promise<void> {
    LocalStorageCacheService.cacheImage(
      recipeName,
      ingredients,
      imageUrl,
      ttlSeconds || 86400
    );
  }

  /**
   * Get cached image URL
   */
  static async getCachedImage(
    recipeName: string,
    ingredients: string[]
  ): Promise<string | null> {
    return LocalStorageCacheService.getCachedImage(recipeName, ingredients);
  }

  /**
   * Clear all cache
   */
  static async clearAllCache(): Promise<void> {
    LocalStorageCacheService.clearAllCache();
  }

  /**
   * Clear recipes cache
   */
  static async clearRecipesCache(): Promise<void> {
    LocalStorageCacheService.clearRecipesCache();
  }

  /**
   * Clear images cache
   */
  static async clearImagesCache(): Promise<void> {
    LocalStorageCacheService.clearImagesCache();
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    provider: string;
    status: string;
    features: string[];
    details?: any;
  }> {
    const stats = LocalStorageCacheService.getCacheStats();
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
  }

  /**
   * Force specific provider (for testing)
   */
  static forceProvider(provider: CacheProvider): void {
    this.provider = provider;
    console.log(`🔧 Forced cache provider: ${provider}`);
  }

  /**
   * Get current provider
   */
  static getCurrentProvider(): CacheProvider {
    return this.provider;
  }

  /**
   * Clean expired items
   */
  static async cleanExpiredItems(): Promise<number> {
    return LocalStorageCacheService.cleanExpiredItems();
  }
}
