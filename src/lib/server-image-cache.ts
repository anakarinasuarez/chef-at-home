/**
 * Server-side Image Cache Manager
 * Handles caching of OpenAI generated images on the server
 */

interface CachedImageItem {
  imageUrl: string;
  expires: number;
  created: number;
  recipeName: string;
  ingredients: string[];
}

// Server-side cache storage
let serverImageCache: Map<string, CachedImageItem> = new Map();

// Generate cache key for images
const getImageCacheKey = (recipeName: string, ingredients: string[]): string => {
  const ingredientsKey = ingredients.sort().join(',');
  const normalizedRecipeName = recipeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `img_${normalizedRecipeName}_${ingredientsKey}`;
};

// Check if image is cached and not expired
export const getCachedImage = (recipeName: string, ingredients: string[]): string | null => {
  const cacheKey = getImageCacheKey(recipeName, ingredients);
  const cachedItem = serverImageCache.get(cacheKey);

  if (!cachedItem) {
    console.log(`❌ No cached image found for: ${recipeName}`);
    return null;
  }

  // Check if expired
  if (Date.now() > cachedItem.expires) {
    serverImageCache.delete(cacheKey);
    console.log(`⏰ Cached image expired for: ${recipeName}`);
    return null;
  }

  console.log(`📦 Using cached image for: ${recipeName}`);
  return cachedItem.imageUrl;
};

// Cache image URL
export const cacheImage = (
  recipeName: string,
  ingredients: string[],
  imageUrl: string,
  ttlSeconds: number = 86400 // 24 hours default
): void => {
  const cacheKey = getImageCacheKey(recipeName, ingredients);

  const cachedItem: CachedImageItem = {
    imageUrl,
    expires: Date.now() + ttlSeconds * 1000,
    created: Date.now(),
    recipeName,
    ingredients: [...ingredients], // Copy array
  };

  serverImageCache.set(cacheKey, cachedItem);
  console.log(`💾 Image cached for: ${recipeName} (TTL: ${ttlSeconds}s)`);
};

// Clear expired images
export const cleanExpiredImages = (): number => {
  let cleanedCount = 0;
  const now = Date.now();

  for (const [key, item] of serverImageCache.entries()) {
    if (now > item.expires) {
      serverImageCache.delete(key);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} expired image cache entries`);
  }

  return cleanedCount;
};

// Get cache statistics
export const getImageCacheStats = (): {
  totalImages: number;
  expiredImages: number;
  memoryUsage: string;
} => {
  const now = Date.now();
  let expiredCount = 0;

  for (const item of serverImageCache.values()) {
    if (now > item.expires) {
      expiredCount++;
    }
  }

  // Estimate memory usage
  const estimatedSize = JSON.stringify(Array.from(serverImageCache.entries())).length;
  const memoryUsage = `${Math.round(estimatedSize / 1024)} KB`;

  return {
    totalImages: serverImageCache.size,
    expiredImages: expiredCount,
    memoryUsage,
  };
};

// Clear all cached images
export const clearAllCachedImages = (): void => {
  const count = serverImageCache.size;
  serverImageCache.clear();
  console.log(`🗑️ Cleared ${count} cached images`);
};

// Get all cached image keys (for debugging)
export const getAllCachedImageKeys = (): string[] => {
  return Array.from(serverImageCache.keys());
};

// Initialize cache cleanup interval (run every hour)
let cleanupInterval: NodeJS.Timeout | null = null;

export const startImageCacheCleanup = (): void => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }

  cleanupInterval = setInterval(
    () => {
      cleanExpiredImages();
    },
    60 * 60 * 1000
  ); // 1 hour

  console.log('🔄 Image cache cleanup started (every hour)');
};

export const stopImageCacheCleanup = (): void => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log('⏹️ Image cache cleanup stopped');
  }
};
