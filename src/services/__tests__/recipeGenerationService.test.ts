import { convertToUnifiedRecipe } from '@/types/recipe';
import type { UnifiedRecipe } from '@/types/recipe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RecipeGenerationService, recipeGenerationService } from '../recipeGenerationService';

// Helper to build a complete UnifiedRecipe for test doubles
const makeUnifiedRecipe = (overrides: Partial<UnifiedRecipe> = {}): UnifiedRecipe => ({
  id: '1',
  title: 'Recipe',
  description: '',
  ingredients: [],
  instructions: [],
  prepTime: '15 minutes',
  cookingTime: '30 minutes',
  totalTime: '45 minutes',
  servings: 4,
  cuisine: 'international',
  source: 'ai-generated',
  ...overrides,
});

// Mock fetch
global.fetch = vi.fn();

// Mock convertToUnifiedRecipe
vi.mock('@/types/recipe', () => ({
  convertToUnifiedRecipe: vi.fn(),
}));

// Mock console methods
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

describe('RecipeGenerationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = RecipeGenerationService.getInstance();
      const instance2 = RecipeGenerationService.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(RecipeGenerationService);
    });

    it('should export singleton instance', () => {
      expect(recipeGenerationService).toBeInstanceOf(RecipeGenerationService);
    });
  });

  describe('generateRecipes', () => {
    it('should generate recipes successfully', async () => {
      const mockRecipes = [
        { id: '1', title: 'Recipe 1' },
        { id: '2', title: 'Recipe 2' },
      ];

      const mockUnifiedRecipes = [
        makeUnifiedRecipe({ id: '1', title: 'Recipe 1' }),
        makeUnifiedRecipe({ id: '2', title: 'Recipe 2' }),
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recipes: mockRecipes }),
      } as Response);

      vi.mocked(convertToUnifiedRecipe)
        .mockReturnValueOnce(mockUnifiedRecipes[0])
        .mockReturnValueOnce(mockUnifiedRecipes[1]);

      const result = await recipeGenerationService.generateRecipes({
        ingredients: ['chicken', 'rice'],
        servings: 4,
        count: 2,
      });

      expect(result.success).toBe(true);
      expect(result.recipes).toEqual(mockUnifiedRecipes);
      expect(result.error).toBeUndefined();
      expect(consoleLogSpy).toHaveBeenCalledWith('Number of recipes received:', 2);
    });

    it('should use default count when not provided', async () => {
      const mockRecipes = Array(4).fill({ id: '1', title: 'Recipe' });

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recipes: mockRecipes }),
      } as Response);

      vi.mocked(convertToUnifiedRecipe).mockReturnValue(
        makeUnifiedRecipe({ id: '1', title: 'Recipe' })
      );

      await recipeGenerationService.generateRecipes({
        ingredients: ['chicken'],
        servings: 2,
      });

      expect(fetch).toHaveBeenCalledWith('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ['chicken'],
          servings: 2,
          count: 4,
        }),
      });
    });

    it('should handle HTTP errors', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      const result = await recipeGenerationService.generateRecipes({
        ingredients: ['chicken'],
        servings: 2,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('HTTP error! status: 500');
      expect(result.recipes).toBeUndefined();
    });

    it('should handle empty recipes response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ recipes: [] }),
      } as Response);

      const result = await recipeGenerationService.generateRecipes({
        ingredients: ['chicken'],
        servings: 2,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('No recipes generated');
      expect(result.recipes).toBeUndefined();
    });

    it('should handle missing recipes in response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);

      const result = await recipeGenerationService.generateRecipes({
        ingredients: ['chicken'],
        servings: 2,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('No recipes generated');
    });

    it('should handle fetch errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      const result = await recipeGenerationService.generateRecipes({
        ingredients: ['chicken'],
        servings: 2,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating recipes:', expect.any(Error));
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(fetch).mockRejectedValue('String error');

      const result = await recipeGenerationService.generateRecipes({
        ingredients: ['chicken'],
        servings: 2,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to generate recipes');
    });
  });

  describe('saveRecipesToSession', () => {
    it('should save recipes to sessionStorage', () => {
      const recipes = [
        makeUnifiedRecipe({ id: '1', title: 'Recipe 1' }),
        makeUnifiedRecipe({ id: '2', title: 'Recipe 2' }),
      ];

      recipeGenerationService.saveRecipesToSession(recipes);

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'currentRecipes',
        JSON.stringify(recipes)
      );
    });

    it('should handle server-side environment', () => {
      // Mock server-side environment
      const originalWindow = global.window;
      delete (global as any).window;

      const recipes = [makeUnifiedRecipe({ id: '1', title: 'Recipe' })];
      recipeGenerationService.saveRecipesToSession(recipes);

      // Should not throw error
      expect(true).toBe(true);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('getRecipesFromSession', () => {
    it('should get recipes from sessionStorage', () => {
      const recipes = [
        { id: '1', title: 'Recipe 1', ingredients: [], instructions: [] },
        { id: '2', title: 'Recipe 2', ingredients: [], instructions: [] },
      ];

      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(recipes));

      const result = recipeGenerationService.getRecipesFromSession();

      expect(result).toEqual(recipes);
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('currentRecipes');
    });

    it('should return empty array when no recipes stored', () => {
      mockSessionStorage.getItem.mockReturnValue(null);

      const result = recipeGenerationService.getRecipesFromSession();

      expect(result).toEqual([]);
    });

    it('should handle JSON parsing errors', () => {
      mockSessionStorage.getItem.mockReturnValue('invalid json');

      const result = recipeGenerationService.getRecipesFromSession();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error parsing stored recipes:',
        expect.any(Error)
      );
    });

    it('should return empty array in server-side environment', () => {
      // Mock server-side environment
      const originalWindow = global.window;
      delete (global as any).window;

      const result = recipeGenerationService.getRecipesFromSession();

      expect(result).toEqual([]);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('clearRecipesFromSession', () => {
    it('should clear recipes from sessionStorage', () => {
      recipeGenerationService.clearRecipesFromSession();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('currentRecipes');
    });

    it('should handle server-side environment', () => {
      // Mock server-side environment
      const originalWindow = global.window;
      delete (global as any).window;

      // Should not throw error
      expect(() => {
        recipeGenerationService.clearRecipesFromSession();
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });
});
