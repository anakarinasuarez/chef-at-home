import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cacheImageData,
  cacheRecipesData,
  cleanExpiredCacheItems,
  clearAllCacheData,
  clearImagesCacheData,
  clearRecipesCacheData,
  forceProvider,
  getCachedImageData,
  getCachedRecipesData,
  getCacheStatistics,
  getCurrentProvider,
  initializeCache,
  UniversalCacheManager,
} from '../universal-cache';

// Mock localStorage-cache functions
vi.mock('../localStorage-cache', () => ({
  cacheRecipes: vi.fn(),
  getCachedRecipes: vi.fn(),
  cacheImage: vi.fn(),
  getCachedImage: vi.fn(),
  clearAllCache: vi.fn(),
  clearRecipesCache: vi.fn(),
  clearImagesCache: vi.fn(),
  getCacheStats: vi.fn(),
  cleanExpiredItems: vi.fn(),
}));

describe('Universal Cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initializeCache', () => {
    it('should initialize cache with localStorage provider', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await initializeCache();

      expect(consoleSpy).toHaveBeenCalledWith(
        '🚀 Universal Cache initialized with Enhanced localStorage'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('cacheRecipesData', () => {
    it('should cache recipes data with default TTL', async () => {
      const { cacheRecipes } = await import('../localStorage-cache');
      const mockCacheRecipes = vi.mocked(cacheRecipes);

      const ingredients = ['chicken', 'rice'];
      const servings = 4;
      const recipes = [
        {
          id: '1',
          title: 'Chicken Rice',
          servings: 4,
          cookingTime: '30 min',
          source: 'AI',
          ingredients: ['chicken', 'rice'],
          instructions: ['Cook chicken', 'Add rice'],
        },
      ];

      await cacheRecipesData(ingredients, servings, recipes);

      expect(mockCacheRecipes).toHaveBeenCalledWith(ingredients, servings, recipes, 3600);
    });

    it('should cache recipes data with custom TTL', async () => {
      const { cacheRecipes } = await import('../localStorage-cache');
      const mockCacheRecipes = vi.mocked(cacheRecipes);

      const ingredients = ['beef'];
      const servings = 2;
      const recipes = [];

      await cacheRecipesData(ingredients, servings, recipes, 1800);

      expect(mockCacheRecipes).toHaveBeenCalledWith(ingredients, servings, recipes, 1800);
    });
  });

  describe('getCachedRecipesData', () => {
    it('should get cached recipes data', async () => {
      const { getCachedRecipes } = await import('../localStorage-cache');
      const mockGetCachedRecipes = vi.mocked(getCachedRecipes);

      const mockRecipes = [
        {
          id: '1',
          title: 'Chicken Rice',
          servings: 4,
          cookingTime: '30 min',
          source: 'AI',
          ingredients: ['chicken', 'rice'],
          instructions: ['Cook chicken', 'Add rice'],
        },
      ];

      mockGetCachedRecipes.mockReturnValue(mockRecipes);

      const result = await getCachedRecipesData(['chicken', 'rice'], 4);

      expect(mockGetCachedRecipes).toHaveBeenCalledWith(['chicken', 'rice'], 4);
      expect(result).toEqual(mockRecipes);
    });

    it('should return null when no cached data', async () => {
      const { getCachedRecipes } = await import('../localStorage-cache');
      const mockGetCachedRecipes = vi.mocked(getCachedRecipes);

      mockGetCachedRecipes.mockReturnValue(null);

      const result = await getCachedRecipesData(['chicken'], 1);

      expect(result).toBeNull();
    });
  });

  describe('cacheImageData', () => {
    it('should cache image data with default TTL', async () => {
      const { cacheImage } = await import('../localStorage-cache');
      const mockCacheImage = vi.mocked(cacheImage);

      const recipeName = 'Chicken Curry';
      const ingredients = ['chicken', 'spices'];
      const imageUrl = 'https://example.com/image.jpg';

      await cacheImageData(recipeName, ingredients, imageUrl);

      expect(mockCacheImage).toHaveBeenCalledWith(recipeName, ingredients, imageUrl, 86400);
    });

    it('should cache image data with custom TTL', async () => {
      const { cacheImage } = await import('../localStorage-cache');
      const mockCacheImage = vi.mocked(cacheImage);

      const recipeName = 'Pasta';
      const ingredients = ['pasta'];
      const imageUrl = 'https://example.com/pasta.jpg';

      await cacheImageData(recipeName, ingredients, imageUrl, 7200);

      expect(mockCacheImage).toHaveBeenCalledWith(recipeName, ingredients, imageUrl, 7200);
    });
  });

  describe('getCachedImageData', () => {
    it('should get cached image data', async () => {
      const { getCachedImage } = await import('../localStorage-cache');
      const mockGetCachedImage = vi.mocked(getCachedImage);

      const imageUrl = 'https://example.com/image.jpg';
      mockGetCachedImage.mockReturnValue(imageUrl);

      const result = await getCachedImageData('Chicken Curry', ['chicken']);

      expect(mockGetCachedImage).toHaveBeenCalledWith('Chicken Curry', ['chicken']);
      expect(result).toBe(imageUrl);
    });

    it('should return null when no cached image', async () => {
      const { getCachedImage } = await import('../localStorage-cache');
      const mockGetCachedImage = vi.mocked(getCachedImage);

      mockGetCachedImage.mockReturnValue(null);

      const result = await getCachedImageData('Pasta', ['pasta']);

      expect(result).toBeNull();
    });
  });

  describe('clearAllCacheData', () => {
    it('should clear all cache data', async () => {
      const { clearAllCache } = await import('../localStorage-cache');
      const mockClearAllCache = vi.mocked(clearAllCache);

      await clearAllCacheData();

      expect(mockClearAllCache).toHaveBeenCalled();
    });
  });

  describe('clearRecipesCacheData', () => {
    it('should clear recipes cache data', async () => {
      const { clearRecipesCache } = await import('../localStorage-cache');
      const mockClearRecipesCache = vi.mocked(clearRecipesCache);

      await clearRecipesCacheData();

      expect(mockClearRecipesCache).toHaveBeenCalled();
    });
  });

  describe('clearImagesCacheData', () => {
    it('should clear images cache data', async () => {
      const { clearImagesCache } = await import('../localStorage-cache');
      const mockClearImagesCache = vi.mocked(clearImagesCache);

      await clearImagesCacheData();

      expect(mockClearImagesCache).toHaveBeenCalled();
    });
  });

  describe('getCacheStatistics', () => {
    it('should get cache statistics', async () => {
      const { getCacheStats } = await import('../localStorage-cache');
      const mockGetCacheStats = vi.mocked(getCacheStats);

      const mockStats = {
        provider: 'localStorage',
        totalKeys: 5,
        recipeKeys: 3,
        imageKeys: 2,
        expiredKeys: 1,
        memoryUsage: '2 KB',
      };

      mockGetCacheStats.mockReturnValue(mockStats);

      const result = await getCacheStatistics();

      expect(result).toEqual({
        provider: 'localStorage',
        status: '✅ Active',
        features: [
          'Client-side caching',
          'TTL support',
          'Automatic expiration',
          'Memory management',
        ],
        details: mockStats,
      });
    });
  });

  describe('forceProvider', () => {
    it('should force specific provider', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      forceProvider('localStorage');

      expect(consoleSpy).toHaveBeenCalledWith('🔧 Forced cache provider: localStorage');

      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentProvider', () => {
    it('should return current provider', () => {
      const provider = getCurrentProvider();

      expect(provider).toBe('localStorage');
    });
  });

  describe('cleanExpiredCacheItems', () => {
    it('should clean expired cache items', async () => {
      const { cleanExpiredItems } = await import('../localStorage-cache');
      const mockCleanExpiredItems = vi.mocked(cleanExpiredItems);

      mockCleanExpiredItems.mockReturnValue(3);

      const result = await cleanExpiredCacheItems();

      expect(mockCleanExpiredItems).toHaveBeenCalled();
      expect(result).toBe(3);
    });
  });

  describe('UniversalCacheManager class', () => {
    it('should provide static methods', async () => {
      const { cacheRecipes } = await import('../localStorage-cache');
      const mockCacheRecipes = vi.mocked(cacheRecipes);

      const ingredients = ['chicken'];
      const servings = 1;
      const recipes = [];

      await UniversalCacheManager.cacheRecipes(ingredients, servings, recipes);

      expect(mockCacheRecipes).toHaveBeenCalledWith(ingredients, servings, recipes, 3600);
    });

    it('should initialize cache', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await UniversalCacheManager.initialize();

      expect(consoleSpy).toHaveBeenCalledWith(
        '🚀 Universal Cache initialized with Enhanced localStorage'
      );

      consoleSpy.mockRestore();
    });

    it('should get cached recipes', async () => {
      const { getCachedRecipes } = await import('../localStorage-cache');
      const mockGetCachedRecipes = vi.mocked(getCachedRecipes);

      const mockRecipes = [{ id: '1', title: 'Test' }];
      mockGetCachedRecipes.mockReturnValue(mockRecipes);

      const result = await UniversalCacheManager.getCachedRecipes(['chicken'], 1);

      expect(result).toEqual(mockRecipes);
    });

    it('should cache image', async () => {
      const { cacheImage } = await import('../localStorage-cache');
      const mockCacheImage = vi.mocked(cacheImage);

      await UniversalCacheManager.cacheImage('Pasta', ['pasta'], 'url.jpg');

      expect(mockCacheImage).toHaveBeenCalledWith('Pasta', ['pasta'], 'url.jpg', 86400);
    });

    it('should get cached image', async () => {
      const { getCachedImage } = await import('../localStorage-cache');
      const mockGetCachedImage = vi.mocked(getCachedImage);

      mockGetCachedImage.mockReturnValue('url.jpg');

      const result = await UniversalCacheManager.getCachedImage('Pasta', ['pasta']);

      expect(result).toBe('url.jpg');
    });

    it('should clear all cache', async () => {
      const { clearAllCache } = await import('../localStorage-cache');
      const mockClearAllCache = vi.mocked(clearAllCache);

      await UniversalCacheManager.clearAllCache();

      expect(mockClearAllCache).toHaveBeenCalled();
    });

    it('should clear recipes cache', async () => {
      const { clearRecipesCache } = await import('../localStorage-cache');
      const mockClearRecipesCache = vi.mocked(clearRecipesCache);

      await UniversalCacheManager.clearRecipesCache();

      expect(mockClearRecipesCache).toHaveBeenCalled();
    });

    it('should clear images cache', async () => {
      const { clearImagesCache } = await import('../localStorage-cache');
      const mockClearImagesCache = vi.mocked(clearImagesCache);

      await UniversalCacheManager.clearImagesCache();

      expect(mockClearImagesCache).toHaveBeenCalled();
    });

    it('should get cache stats', async () => {
      const { getCacheStats } = await import('../localStorage-cache');
      const mockGetCacheStats = vi.mocked(getCacheStats);

      const mockStats = {
        provider: 'localStorage',
        totalKeys: 0,
        recipeKeys: 0,
        imageKeys: 0,
        expiredKeys: 0,
        memoryUsage: '0 KB',
      };

      mockGetCacheStats.mockReturnValue(mockStats);

      const result = await UniversalCacheManager.getCacheStats();

      expect(result.provider).toBe('localStorage');
      expect(result.status).toBe('✅ Active');
    });

    it('should force provider', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      UniversalCacheManager.forceProvider('localStorage');

      expect(consoleSpy).toHaveBeenCalledWith('🔧 Forced cache provider: localStorage');

      consoleSpy.mockRestore();
    });

    it('should get current provider', () => {
      const provider = UniversalCacheManager.getCurrentProvider();

      expect(provider).toBe('localStorage');
    });

    it('should clean expired items', async () => {
      const { cleanExpiredItems } = await import('../localStorage-cache');
      const mockCleanExpiredItems = vi.mocked(cleanExpiredItems);

      mockCleanExpiredItems.mockReturnValue(2);

      const result = await UniversalCacheManager.cleanExpiredItems();

      expect(result).toBe(2);
    });
  });
});
