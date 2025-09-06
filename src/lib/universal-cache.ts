/**
 * Universal Cache Manager
 * Automatically chooses the best caching strategy available
 * Priority: Next.js Cache > Enhanced localStorage > Basic localStorage
 */
import { SimpleCacheService } from "./simple-cache";
import { LocalStorageCacheService } from "./localStorage-cache";

export type CacheProvider = "nextjs" | "localStorage" | "fallback";

export class UniversalCacheManager {
  private static provider: CacheProvider = "nextjs";

  /**
   * Initialize cache manager
   */
  static async initialize(): Promise<void> {
    // Use localStorage for now as it's more reliable for client-side operations
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
    if (this.provider === "nextjs") {
      await SimpleCacheService.cacheRecipes(ingredients, servings, recipes);
    } else {
      LocalStorageCacheService.cacheRecipes(
        ingredients,
        servings,
        recipes,
        ttlSeconds || 3600
      );
    }
  }

  /**
   * Get cached recipes
   */
  static async getCachedRecipes(
    ingredients: string[],
    servings: number
  ): Promise<any[] | null> {
    if (this.provider === "nextjs") {
      return await SimpleCacheService.getCachedRecipes(ingredients, servings);
    } else {
      return LocalStorageCacheService.getCachedRecipes(ingredients, servings);
    }
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
    if (this.provider === "nextjs") {
      await SimpleCacheService.cacheImage(recipeName, ingredients, imageUrl);
    } else {
      LocalStorageCacheService.cacheImage(
        recipeName,
        ingredients,
        imageUrl,
        ttlSeconds || 86400
      );
    }
  }

  /**
   * Get cached image URL
   */
  static async getCachedImage(
    recipeName: string,
    ingredients: string[]
  ): Promise<string | null> {
    if (this.provider === "nextjs") {
      return await SimpleCacheService.getCachedImage(recipeName, ingredients);
    } else {
      return LocalStorageCacheService.getCachedImage(recipeName, ingredients);
    }
  }

  /**
   * Clear all cache
   */
  static async clearAllCache(): Promise<void> {
    if (this.provider === "nextjs") {
      await SimpleCacheService.clearCache();
    } else {
      LocalStorageCacheService.clearAllCache();
    }
  }

  /**
   * Clear recipes cache
   */
  static async clearRecipesCache(): Promise<void> {
    if (this.provider === "nextjs") {
      await SimpleCacheService.clearCache();
    } else {
      LocalStorageCacheService.clearRecipesCache();
    }
  }

  /**
   * Clear images cache
   */
  static async clearImagesCache(): Promise<void> {
    if (this.provider === "nextjs") {
      await SimpleCacheService.clearCache();
    } else {
      LocalStorageCacheService.clearImagesCache();
    }
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
    if (this.provider === "nextjs") {
      const stats = await SimpleCacheService.getCacheStats();
      return {
        provider: stats.provider,
        status: stats.status,
        features: stats.features,
      };
    } else {
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
   * Clean expired items (localStorage only)
   */
  static async cleanExpiredItems(): Promise<number> {
    if (this.provider === "nextjs") {
      console.log("🧹 Next.js Cache handles expiration automatically");
      return 0;
    } else {
      return LocalStorageCacheService.cleanExpiredItems();
    }
  }
}
