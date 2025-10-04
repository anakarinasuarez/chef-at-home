import { StorageManager } from '@/utils/storage';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSavedRecipesStore } from '../savedRecipesStore';

// Mock del StorageManager
vi.mock('@/utils/storage', () => ({
  STORAGE_KEYS: {
    SAVED_RECIPES: vi.fn((userId: string) => `saved_recipes_${userId}`),
    RECIPE_CACHE: vi.fn((recipeId: string) => `recipe_cache_${recipeId}`),
  },
  StorageManager: {
    getJSON: vi.fn(),
    setJSON: vi.fn(),
    getItem: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock de localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('SavedRecipesStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Reset store state
    act(() => {
      useSavedRecipesStore.setState({
        savedRecipes: [],
        isLoading: false,
        error: null,
        removingRecipeId: null,
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSavedRecipesStore());

      expect(result.current.savedRecipes).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.removingRecipeId).toBeNull();
    });

    it('should have all required methods', () => {
      const { result } = renderHook(() => useSavedRecipesStore());

      expect(typeof result.current.setLoading).toBe('function');
      expect(typeof result.current.setError).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
      expect(typeof result.current.setRemovingRecipeId).toBe('function');
      expect(typeof result.current.clearSavedRecipes).toBe('function');
      expect(typeof result.current.loadSavedRecipes).toBe('function');
      expect(typeof result.current.saveRecipe).toBe('function');
      expect(typeof result.current.removeRecipe).toBe('function');
      expect(typeof result.current.updateRecipe).toBe('function');
    });
  });

  describe('Basic Actions', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useSavedRecipesStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set error', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const errorMessage = 'Test error';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useSavedRecipesStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should set removing recipe id', () => {
      const { result } = renderHook(() => useSavedRecipesStore());

      act(() => {
        result.current.setRemovingRecipeId('recipe-123');
      });

      expect(result.current.removingRecipeId).toBe('recipe-123');

      act(() => {
        result.current.setRemovingRecipeId(null);
      });

      expect(result.current.removingRecipeId).toBeNull();
    });

    it('should clear saved recipes', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const mockRecipes = [
        {
          id: '1',
          title: 'Test Recipe',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
      ];

      act(() => {
        useSavedRecipesStore.setState({ savedRecipes: mockRecipes });
      });

      expect(result.current.savedRecipes).toHaveLength(1);

      act(() => {
        result.current.clearSavedRecipes();
      });

      expect(result.current.savedRecipes).toEqual([]);
    });
  });

  describe('Load Saved Recipes Action', () => {
    it('should load saved recipes successfully', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const mockRecipes = [
        {
          id: '1',
          title: 'Saved Recipe 1',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
        {
          id: '2',
          title: 'Saved Recipe 2',
          servings: 4,
          cookingTime: '45 min',
          difficulty: 'Medium',
          source: 'test',
        },
      ];

      vi.mocked(StorageManager.getJSON).mockReturnValue(mockRecipes);

      act(() => {
        result.current.loadSavedRecipes(userId);
      });

      expect(result.current.savedRecipes).toEqual(mockRecipes);
      expect(StorageManager.getJSON).toHaveBeenCalledWith(`saved_recipes_${userId}`);
    });

    it('should handle empty saved recipes', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';

      vi.mocked(StorageManager.getJSON).mockReturnValue(null);

      act(() => {
        result.current.loadSavedRecipes(userId);
      });

      expect(result.current.savedRecipes).toEqual([]);
    });

    it('should handle storage error', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';

      vi.mocked(StorageManager.getJSON).mockImplementation(() => {
        throw new Error('Storage error');
      });

      act(() => {
        result.current.loadSavedRecipes(userId);
      });

      expect(result.current.error).toBe('Storage error');
    });
  });

  describe('Save Recipe Action', () => {
    it('should save recipe successfully', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const newRecipe = {
        title: 'New Recipe',
        servings: 2,
        cookingTime: '30 min',
        difficulty: 'Easy',
        source: 'test',
        ingredients: [{ name: 'tomato', quantity: 2, unit: 'pieces' }],
        instructions: ['Chop tomatoes', 'Cook'],
      };

      vi.mocked(StorageManager.getJSON).mockReturnValue([]);
      vi.mocked(StorageManager.setJSON).mockReturnValue(true);
      vi.mocked(StorageManager.getItem).mockReturnValue(null);

      const saveResult = result.current.saveRecipe(newRecipe, userId);

      // Just verify the function was called and returned true
      expect(saveResult).toBe(true);
      expect(StorageManager.setJSON).toHaveBeenCalled();
    });

    it('should handle save recipe error', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const newRecipe = {
        title: 'New Recipe',
        servings: 2,
        cookingTime: '30 min',
        difficulty: 'Easy',
        source: 'test',
      };

      vi.mocked(StorageManager.getJSON).mockReturnValue([]);
      vi.mocked(StorageManager.setJSON).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const saveResult = result.current.saveRecipe(newRecipe, userId);

      expect(saveResult).toBe(false);
    });
  });

  describe('Remove Recipe Action', () => {
    it('should remove recipe successfully', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const existingRecipes = [
        {
          id: '1',
          title: 'Recipe 1',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
        {
          id: '2',
          title: 'Recipe 2',
          servings: 4,
          cookingTime: '45 min',
          difficulty: 'Medium',
          source: 'test',
        },
      ];

      act(() => {
        useSavedRecipesStore.setState({ savedRecipes: existingRecipes });
      });

      vi.mocked(StorageManager.setJSON).mockReturnValue(true);

      const removeResult = result.current.removeRecipe('1', userId);

      // Just verify the function was called and returned true
      expect(removeResult).toBe(true);
      expect(StorageManager.setJSON).toHaveBeenCalled();
    });

    it('should handle remove recipe not found', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const existingRecipes = [
        {
          id: '1',
          title: 'Recipe 1',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
      ];

      act(() => {
        useSavedRecipesStore.setState({ savedRecipes: existingRecipes });
      });

      vi.mocked(StorageManager.setJSON).mockReturnValue(true);

      const removeResult = result.current.removeRecipe('nonexistent', userId);

      // removeRecipe always returns the result of StorageManager.setJSON
      // It doesn't check if the recipe exists
      expect(removeResult).toBe(true);
    });

    it('should handle remove recipe error', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const existingRecipes = [
        {
          id: '1',
          title: 'Recipe 1',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
      ];

      act(() => {
        useSavedRecipesStore.setState({ savedRecipes: existingRecipes });
      });

      vi.mocked(StorageManager.setJSON).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const removeResult = result.current.removeRecipe('1', userId);

      expect(removeResult).toBe(false);
    });
  });

  describe('Update Recipe Action', () => {
    it('should update recipe successfully', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const existingRecipes = [
        {
          id: '1',
          title: 'Original Recipe',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
      ];

      act(() => {
        useSavedRecipesStore.setState({ savedRecipes: existingRecipes });
      });

      const updatedRecipe = {
        id: '1',
        title: 'Updated Recipe',
        servings: 4,
        cookingTime: '45 min',
        difficulty: 'Medium',
        source: 'test',
      };

      vi.mocked(StorageManager.setJSON).mockReturnValue(true);

      const updateResult = result.current.updateRecipe('1', updatedRecipe, userId);

      expect(updateResult).toBe(true);
      expect(StorageManager.setJSON).toHaveBeenCalled();
    });

    it('should handle update recipe not found', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const existingRecipes = [
        {
          id: '1',
          title: 'Recipe 1',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
      ];

      act(() => {
        useSavedRecipesStore.setState({ savedRecipes: existingRecipes });
      });

      const updatedRecipe = {
        id: 'nonexistent',
        title: 'Updated Recipe',
        servings: 4,
        cookingTime: '45 min',
        difficulty: 'Medium',
        source: 'test',
      };

      const updateResult = result.current.updateRecipe('nonexistent', updatedRecipe, userId);

      expect(updateResult).toBe(false);
    });

    it('should handle update recipe error', () => {
      const { result } = renderHook(() => useSavedRecipesStore());
      const userId = 'user-123';
      const existingRecipes = [
        {
          id: '1',
          title: 'Recipe 1',
          servings: 2,
          cookingTime: '30 min',
          difficulty: 'Easy',
          source: 'test',
        },
      ];

      act(() => {
        useSavedRecipesStore.setState({ savedRecipes: existingRecipes });
      });

      const updatedRecipe = {
        id: '1',
        title: 'Updated Recipe',
        servings: 4,
        cookingTime: '45 min',
        difficulty: 'Medium',
        source: 'test',
      };

      vi.mocked(StorageManager.setJSON).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const updateResult = result.current.updateRecipe('1', updatedRecipe, userId);

      expect(updateResult).toBe(false);
    });
  });
});
