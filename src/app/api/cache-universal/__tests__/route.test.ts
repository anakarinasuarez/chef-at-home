import { UniversalCacheManager } from '@/lib/universal-cache';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../route';

// Mock the UniversalCacheManager
vi.mock('@/lib/universal-cache', () => ({
  UniversalCacheManager: {
    getCacheStats: vi.fn(),
    getCurrentProvider: vi.fn(),
    clearRecipesCache: vi.fn(),
    clearImagesCache: vi.fn(),
    clearAllCache: vi.fn(),
    cleanExpiredItems: vi.fn(),
    initialize: vi.fn(),
    getCachedRecipes: vi.fn(),
    getCachedImage: vi.fn(),
    cacheRecipes: vi.fn(),
    cacheImage: vi.fn(),
    forceProvider: vi.fn(),
  },
}));

const mockUniversalCacheManager = vi.mocked(UniversalCacheManager);

describe('/api/cache-universal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return cache stats', async () => {
      const mockStats = {
        provider: 'localStorage',
        totalKeys: 10,
        recipeKeys: 5,
        imageKeys: 5,
        expiredKeys: 2,
        memoryUsage: '1.2 KB',
      };

      mockUniversalCacheManager.getCacheStats.mockResolvedValue(
        mockStats as unknown as Awaited<
          ReturnType<typeof UniversalCacheManager.getCacheStats>
        >
      );
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=stats',
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        stats: mockStats,
        provider: 'localStorage',
      });
    });

    it('should clear all cache', async () => {
      mockUniversalCacheManager.clearAllCache.mockResolvedValue();
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=clear&type=all',
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Cache cleared: all',
        provider: 'localStorage',
      });
      expect(mockUniversalCacheManager.clearAllCache).toHaveBeenCalled();
    });

    it('should clear recipes cache', async () => {
      mockUniversalCacheManager.clearRecipesCache.mockResolvedValue();
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=clear&type=recipes',
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Cache cleared: recipes',
        provider: 'localStorage',
      });
      expect(mockUniversalCacheManager.clearRecipesCache).toHaveBeenCalled();
    });

    it('should clear images cache', async () => {
      mockUniversalCacheManager.clearImagesCache.mockResolvedValue();
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=clear&type=images',
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Cache cleared: images',
        provider: 'localStorage',
      });
      expect(mockUniversalCacheManager.clearImagesCache).toHaveBeenCalled();
    });

    it('should clean expired items', async () => {
      mockUniversalCacheManager.cleanExpiredItems.mockResolvedValue(3);
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=clean',
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Cleaned 3 expired items',
        cleanedCount: 3,
        provider: 'localStorage',
      });
    });

    it('should initialize cache manager', async () => {
      mockUniversalCacheManager.initialize.mockResolvedValue();
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=init',
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Cache manager initialized',
        provider: 'localStorage',
      });
    });

    it('should get cached recipes', async () => {
      const mockRecipes = [
        {
          id: '1',
          title: 'Chicken Risotto',
          ingredients: [{ name: 'chicken', quantity: '500g' }],
          instructions: ['Cook chicken', 'Add rice'],
          servings: 4,
          cookingTime: '30 minutes',
        },
      ];

      mockUniversalCacheManager.getCachedRecipes.mockResolvedValue(mockRecipes);
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const ingredients = encodeURIComponent(JSON.stringify(['chicken', 'rice']));
      const mockRequest = {
        url: `http://localhost:3000/api/cache-universal?action=get&type=recipes&ingredients=${ingredients}&servings=4`,
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        recipes: mockRecipes,
        provider: 'localStorage',
      });
      expect(mockUniversalCacheManager.getCachedRecipes).toHaveBeenCalledWith(
        ['chicken', 'rice'],
        4
      );
    });

    it('should return no cached recipes found', async () => {
      mockUniversalCacheManager.getCachedRecipes.mockResolvedValue(null);

      const ingredients = encodeURIComponent(JSON.stringify(['chicken', 'rice']));
      const mockRequest = {
        url: `http://localhost:3000/api/cache-universal?action=get&type=recipes&ingredients=${ingredients}&servings=4`,
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: false,
        message: 'No cached recipes found',
      });
    });

    it('should get cached image', async () => {
      const mockImageUrl = 'https://example.com/image.jpg';
      mockUniversalCacheManager.getCachedImage.mockResolvedValue(mockImageUrl);
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const ingredients = encodeURIComponent(JSON.stringify(['chicken', 'rice']));
      const mockRequest = {
        url: `http://localhost:3000/api/cache-universal?action=get&type=image&ingredients=${ingredients}&recipeName=Chicken%20Risotto`,
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        imageUrl: mockImageUrl,
        provider: 'localStorage',
      });
      expect(mockUniversalCacheManager.getCachedImage).toHaveBeenCalledWith('Chicken Risotto', [
        'chicken',
        'rice',
      ]);
    });

    it('should return invalid action for unknown action', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=unknown',
      } as NextRequest;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: false,
        message: 'Invalid action. Use: stats, clear, clean, init, get',
      });
    });

    it('should handle errors gracefully', async () => {
      mockUniversalCacheManager.getCacheStats.mockRejectedValue(new Error('Cache error'));

      const mockRequest = {
        url: 'http://localhost:3000/api/cache-universal?action=stats',
      } as NextRequest;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: false,
        message: 'Cache operation failed',
        error: 'Cache error',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Cache API error:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('POST', () => {
    it('should cache recipes', async () => {
      mockUniversalCacheManager.cacheRecipes.mockResolvedValue();
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const requestBody = {
        action: 'cache-recipes',
        data: {
          ingredients: ['chicken', 'rice'],
          servings: 4,
          recipes: [
            {
              id: '1',
              title: 'Chicken Risotto',
              ingredients: [{ name: 'chicken', quantity: '500g' }],
              instructions: ['Cook chicken', 'Add rice'],
              servings: 4,
              cookingTime: '30 minutes',
            },
          ],
          ttl: 3600,
        },
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Recipes cached successfully',
        provider: 'localStorage',
      });
      expect(mockUniversalCacheManager.cacheRecipes).toHaveBeenCalledWith(
        ['chicken', 'rice'],
        4,
        requestBody.data.recipes,
        3600
      );
    });

    it('should cache image', async () => {
      mockUniversalCacheManager.cacheImage.mockResolvedValue();
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue('localStorage');

      const requestBody = {
        action: 'cache-image',
        data: {
          recipeName: 'Chicken Risotto',
          ingredients: ['chicken', 'rice'],
          imageUrl: 'https://example.com/image.jpg',
          ttl: 86400,
        },
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Image cached successfully',
        provider: 'localStorage',
      });
      expect(mockUniversalCacheManager.cacheImage).toHaveBeenCalledWith(
        'Chicken Risotto',
        ['chicken', 'rice'],
        'https://example.com/image.jpg',
        86400
      );
    });

    it('should force provider', async () => {
      mockUniversalCacheManager.forceProvider.mockImplementation(() => {});
      mockUniversalCacheManager.getCurrentProvider.mockReturnValue(
        'memory' as unknown as ReturnType<
          typeof UniversalCacheManager.getCurrentProvider
        >
      );

      const requestBody = {
        action: 'force-provider',
        data: {
          provider: 'memory',
        },
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Provider forced to: memory',
        provider: 'memory',
      });
      expect(mockUniversalCacheManager.forceProvider).toHaveBeenCalledWith('memory');
    });

    it('should return invalid action for unknown action', async () => {
      const requestBody = {
        action: 'unknown-action',
        data: {},
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: false,
        message: 'Invalid action',
      });
    });

    it('should handle errors gracefully', async () => {
      const requestBody = {
        action: 'cache-recipes',
        data: {
          ingredients: ['chicken', 'rice'],
          servings: 4,
          recipes: [],
          ttl: 3600,
        },
      };

      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Network error')),
      } as unknown as NextRequest;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: false,
        message: 'Cache operation failed',
        error: 'Network error',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Cache API error:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
