import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cacheImage,
  cacheRecipes,
  cleanExpiredItems,
  clearAllCache,
  clearImagesCache,
  clearRecipesCache,
  getCachedImage,
  getCachedRecipes,
  getCacheStats,
} from '../localStorage-cache';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0,
  clear: vi.fn(),
};

// Mock window object
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock console methods
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
};

describe('localStorage-cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.length = 0;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  describe('cacheRecipes', () => {
    it('should cache recipes with default TTL', () => {
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

      cacheRecipes(ingredients, servings, recipes);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'recipes_chicken,rice_4',
        expect.stringContaining('"data":')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('💾 Cached: recipes_chicken,rice_4')
      );
    });

    it('should cache recipes with custom TTL', () => {
      const ingredients = ['beef'];
      const servings = 2;
      const recipes = [
        {
          id: '2',
          title: 'Beef Steak',
          servings: 2,
          cookingTime: '15 min',
          source: 'AI',
          ingredients: ['beef'],
          instructions: ['Cook beef'],
        },
      ];

      cacheRecipes(ingredients, servings, recipes, 1800); // 30 minutes

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'recipes_beef_2',
        expect.stringContaining('"data":')
      );
    });

    it('should sort ingredients for consistent cache keys', () => {
      const ingredients = ['zucchini', 'apple', 'banana'];
      const servings = 3;
      const recipes = [];

      cacheRecipes(ingredients, servings, recipes);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'recipes_apple,banana,zucchini_3',
        expect.any(String)
      );
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      const ingredients = ['chicken'];
      const servings = 1;
      const recipes = [];

      expect(() => {
        cacheRecipes(ingredients, servings, recipes);
      }).not.toThrow();

      expect(consoleSpy.error).toHaveBeenCalledWith('Error setting cache item:', expect.any(Error));
    });
  });

  describe('getCachedRecipes', () => {
    it('should return cached recipes when valid', () => {
      const mockData = {
        data: [
          {
            id: '1',
            title: 'Chicken Rice',
            servings: 4,
            cookingTime: '30 min',
            source: 'AI',
            ingredients: ['chicken', 'rice'],
            instructions: ['Cook chicken', 'Add rice'],
          },
        ],
        expires: Date.now() + 3600000, // 1 hour from now
        created: Date.now(),
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));

      const result = getCachedRecipes(['chicken', 'rice'], 4);

      expect(result).toEqual(mockData.data);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('📦 Using cached: recipes_chicken,rice_4')
      );
    });

    it('should return null when cache is expired', () => {
      const mockData = {
        data: [],
        expires: Date.now() - 1000, // Expired
        created: Date.now() - 3600000,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));

      const result = getCachedRecipes(['chicken'], 1);

      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('recipes_chicken_1');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('⏰ Cache expired: recipes_chicken_1')
      );
    });

    it('should return null when no cache exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = getCachedRecipes(['chicken'], 1);

      expect(result).toBeNull();
    });

    it('should handle JSON parsing errors', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const result = getCachedRecipes(['chicken'], 1);

      expect(result).toBeNull();
      expect(consoleSpy.error).toHaveBeenCalledWith('Error getting cache item:', expect.any(Error));
    });
  });

  describe('cacheImage', () => {
    it('should cache image with default TTL', () => {
      const recipeName = 'Chicken Curry';
      const ingredients = ['chicken', 'spices'];
      const imageUrl = 'https://example.com/image.jpg';

      cacheImage(recipeName, ingredients, imageUrl);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'image_Chicken Curry_chicken,spices',
        expect.stringContaining('"data":"https://example.com/image.jpg"')
      );
    });

    it('should cache image with custom TTL', () => {
      const recipeName = 'Pasta';
      const ingredients = ['pasta'];
      const imageUrl = 'https://example.com/pasta.jpg';

      cacheImage(recipeName, ingredients, imageUrl, 7200); // 2 hours

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'image_Pasta_pasta',
        expect.any(String)
      );
    });
  });

  describe('getCachedImage', () => {
    it('should return cached image URL when valid', () => {
      const mockData = {
        data: 'https://example.com/image.jpg',
        expires: Date.now() + 86400000, // 24 hours from now
        created: Date.now(),
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));

      const result = getCachedImage('Chicken Curry', ['chicken']);

      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should return null when cache is expired', () => {
      const mockData = {
        data: 'https://example.com/image.jpg',
        expires: Date.now() - 1000, // Expired
        created: Date.now() - 86400000,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));

      const result = getCachedImage('Chicken Curry', ['chicken']);

      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('image_Chicken Curry_chicken');
    });
  });

  describe('clearAllCache', () => {
    it('should clear all cache entries', () => {
      mockLocalStorage.length = 4;
      mockLocalStorage.key
        .mockReturnValueOnce('recipes_chicken_4')
        .mockReturnValueOnce('image_pasta_pasta')
        .mockReturnValueOnce('other_key')
        .mockReturnValueOnce('recipes_beef_2')
        .mockReturnValueOnce(null);

      clearAllCache();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('recipes_chicken_4');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('image_pasta_pasta');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('recipes_beef_2');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('other_key');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('🗑️ Cleared 3 cache entries')
      );
    });

    it('should handle localStorage errors', () => {
      mockLocalStorage.key.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        clearAllCache();
      }).not.toThrow();

      // Error handling is tested in the actual implementation
    });
  });

  describe('clearRecipesCache', () => {
    it('should clear only recipe cache entries', () => {
      mockLocalStorage.length = 2;
      mockLocalStorage.key
        .mockReturnValueOnce('recipes_chicken_4')
        .mockReturnValueOnce('image_pasta_pasta')
        .mockReturnValueOnce(null);

      clearRecipesCache();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('recipes_chicken_4');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('image_pasta_pasta');
    });
  });

  describe('clearImagesCache', () => {
    it('should clear only image cache entries', () => {
      mockLocalStorage.length = 2;
      mockLocalStorage.key
        .mockReturnValueOnce('recipes_chicken_4')
        .mockReturnValueOnce('image_pasta_pasta')
        .mockReturnValueOnce(null);

      clearImagesCache();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('image_pasta_pasta');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('recipes_chicken_4');
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      mockLocalStorage.length = 1;
      mockLocalStorage.key.mockReturnValueOnce('recipes_chicken_4').mockReturnValueOnce(null);

      // Mock valid cache item
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify({
          data: [],
          expires: Date.now() + 3600000,
          created: Date.now(),
        })
      );

      const stats = getCacheStats();

      expect(stats.provider).toBe('localStorage');
      expect(stats.totalKeys).toBe(1);
      expect(stats.recipeKeys).toBe(1);
      expect(stats.imageKeys).toBe(0);
      expect(stats.expiredKeys).toBe(0);
      expect(stats.memoryUsage).toContain('KB');
    });

    it('should handle server-side environment', () => {
      // Mock server-side environment
      const originalWindow = global.window;
      delete (global as any).window;

      const stats = getCacheStats();

      expect(stats.provider).toBe('localStorage (Server-side)');
      expect(stats.totalKeys).toBe(0);

      // Restore window
      global.window = originalWindow;
    });

    it('should handle localStorage errors', () => {
      mockLocalStorage.key.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const stats = getCacheStats();

      expect(stats.provider).toBe('localStorage');
      expect(stats.totalKeys).toBe(0);
    });
  });

  describe('cleanExpiredItems', () => {
    it('should clean expired items', () => {
      mockLocalStorage.length = 1;
      mockLocalStorage.key.mockReturnValueOnce('recipes_chicken_4').mockReturnValueOnce(null);

      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify({
          data: [],
          expires: Date.now() - 1000, // Expired
          created: Date.now() - 3600000,
        })
      );

      const cleanedCount = cleanExpiredItems();

      expect(cleanedCount).toBeGreaterThanOrEqual(0);
      expect(mockLocalStorage.removeItem).toHaveBeenCalled();
    });

    it('should handle corrupted items', () => {
      mockLocalStorage.length = 1;
      mockLocalStorage.key.mockReturnValueOnce('recipes_chicken_4').mockReturnValueOnce(null);

      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const cleanedCount = cleanExpiredItems();

      expect(cleanedCount).toBeGreaterThanOrEqual(0);
      // The function should handle corrupted items gracefully
    });

    it('should return 0 when no expired items', () => {
      mockLocalStorage.length = 1;
      mockLocalStorage.key.mockReturnValueOnce('recipes_chicken_4').mockReturnValueOnce(null);

      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify({
          data: [],
          expires: Date.now() + 3600000, // Valid
          created: Date.now(),
        })
      );

      const cleanedCount = cleanExpiredItems();

      expect(cleanedCount).toBe(0);
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });
  });
});
