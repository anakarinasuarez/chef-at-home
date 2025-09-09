import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSavedRecipes } from '../useSavedRecipes'
import { mockAuthContext } from '../../test/mocks/contexts'

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}))

describe('useSavedRecipes', () => {
  const mockUser = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  }

  const mockRecipe = {
    id: 'test-recipe-id',
    title: 'Test Recipe',
    servings: 4,
    cookingTime: '30 minutes',
    difficulty: 'Easy',
    image: 'https://example.com/image.jpg',
    source: 'ai-generated',
    ingredients: [
      { name: 'tomato', quantity: 2, unit: 'pieces' },
      { name: 'onion', quantity: 1, unit: 'piece' },
    ],
    instructions: ['Step 1', 'Step 2'],
    description: 'A delicious test recipe',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
    vi.mocked(localStorage.removeItem).mockClear()
    
    // Reset auth context
    mockAuthContext.user = mockUser
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('initializes with empty saved recipes when no user', () => {
      mockAuthContext.user = null
      
      const { result } = renderHook(() => useSavedRecipes())
      
      expect(result.current.savedRecipes).toEqual([])
      expect(result.current.loading).toBe(false)
    })

    it('initializes with empty saved recipes when localStorage is empty', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      
      const { result } = renderHook(() => useSavedRecipes())
      
      expect(result.current.savedRecipes).toEqual([])
      expect(result.current.loading).toBe(false)
    })

    it('loads saved recipes from localStorage on mount', () => {
      const savedRecipes = [mockRecipe]
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(savedRecipes))
      
      const { result } = renderHook(() => useSavedRecipes())
      
      expect(result.current.savedRecipes).toEqual(savedRecipes)
      expect(result.current.loading).toBe(false)
    })

    it('handles corrupted localStorage data gracefully', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-json')
      
      const { result } = renderHook(() => useSavedRecipes())
      
      expect(result.current.savedRecipes).toEqual([])
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Save Recipe', () => {
    it('saves a new recipe successfully', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.saveRecipe(mockRecipe)
        expect(success).toBe(true)
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
      expect(result.current.savedRecipes[0]).toMatchObject({
        ...mockRecipe,
        id: mockRecipe.id,
        savedAt: expect.any(String),
      })
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        `savedRecipes_${mockUser.id}`,
        expect.any(String)
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        `recipe-${mockRecipe.id}`,
        expect.any(String)
      )
    })

    it('generates ID for recipe without ID', () => {
      const recipeWithoutId = { ...mockRecipe, id: undefined }
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.saveRecipe(recipeWithoutId)
      })
      
      expect(result.current.savedRecipes[0].id).toBeDefined()
      expect(typeof result.current.savedRecipes[0].id).toBe('string')
    })

    it('returns false when no user is logged in', () => {
      mockAuthContext.user = null
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.saveRecipe(mockRecipe)
        expect(success).toBe(false)
      })
      
      expect(result.current.savedRecipes).toEqual([])
    })

    it('handles localStorage errors gracefully', () => {
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.saveRecipe(mockRecipe)
        expect(success).toBe(false)
      })
      
      expect(result.current.savedRecipes).toEqual([])
    })

    it('prevents duplicate recipes with same ID', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.saveRecipe(mockRecipe)
        result.current.saveRecipe(mockRecipe) // Same recipe again
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
    })
  })

  describe('Remove Recipe', () => {
    it('removes a saved recipe successfully', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      // First save a recipe
      act(() => {
        result.current.saveRecipe(mockRecipe)
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
      
      // Then remove it
      act(() => {
        const success = result.current.removeRecipe(mockRecipe.id!)
        expect(success).toBe(true)
      })
      
      expect(result.current.savedRecipes).toHaveLength(0)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        `savedRecipes_${mockUser.id}`,
        JSON.stringify([])
      )
    })

    it('returns false when no user is logged in', () => {
      mockAuthContext.user = null
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.removeRecipe(mockRecipe.id!)
        expect(success).toBe(false)
      })
    })

    it('handles localStorage errors gracefully during removal', () => {
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.removeRecipe(mockRecipe.id!)
        expect(success).toBe(false)
      })
    })

    it('handles removal of non-existent recipe gracefully', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.removeRecipe('non-existent-id')
        expect(success).toBe(true) // Should still return true
      })
      
      expect(result.current.savedRecipes).toEqual([])
    })
  })

  describe('Check if Recipe is Saved', () => {
    it('returns true for saved recipe', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.saveRecipe(mockRecipe)
      })
      
      act(() => {
        const isSaved = result.current.isRecipeSaved(mockRecipe.id!)
        expect(isSaved).toBe(true)
      })
    })

    it('returns false for non-saved recipe', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const isSaved = result.current.isRecipeSaved('non-existent-id')
        expect(isSaved).toBe(false)
      })
    })

    it('returns false when no recipes are saved', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const isSaved = result.current.isRecipeSaved(mockRecipe.id!)
        expect(isSaved).toBe(false)
      })
    })
  })

  describe('Toggle Save Recipe', () => {
    it('saves recipe when not saved', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.toggleSaveRecipe(mockRecipe)
        expect(success).toBe(true)
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
      expect(result.current.isRecipeSaved(mockRecipe.id!)).toBe(true)
    })

    it('removes recipe when already saved', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      // First save the recipe
      act(() => {
        result.current.saveRecipe(mockRecipe)
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
      
      // Then toggle to remove it
      act(() => {
        const success = result.current.toggleSaveRecipe(mockRecipe)
        expect(success).toBe(true)
      })
      
      expect(result.current.savedRecipes).toHaveLength(0)
      expect(result.current.isRecipeSaved(mockRecipe.id!)).toBe(false)
    })

    it('generates ID for recipe without ID during toggle', () => {
      const recipeWithoutId = { ...mockRecipe, id: undefined }
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.toggleSaveRecipe(recipeWithoutId)
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
      expect(result.current.savedRecipes[0].id).toBeDefined()
    })
  })

  describe('Update Recipe', () => {
    it('updates an existing recipe successfully', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      // First save a recipe
      act(() => {
        result.current.saveRecipe(mockRecipe)
      })
      
      const updatedData = {
        title: 'Updated Recipe Title',
        servings: 6,
      }
      
      act(() => {
        const success = result.current.updateRecipe(mockRecipe.id!, updatedData)
        expect(success).toBe(true)
      })
      
      expect(result.current.savedRecipes[0]).toMatchObject({
        ...mockRecipe,
        ...updatedData,
        id: mockRecipe.id,
      })
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        `savedRecipes_${mockUser.id}`,
        expect.any(String)
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        `recipe-${mockRecipe.id}`,
        expect.any(String)
      )
    })

    it('returns false when recipe not found for update', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.updateRecipe('non-existent-id', { title: 'New Title' })
        expect(success).toBe(false)
      })
      
      expect(result.current.savedRecipes).toEqual([])
    })

    it('returns false when no user is logged in', () => {
      mockAuthContext.user = null
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.updateRecipe(mockRecipe.id!, { title: 'New Title' })
        expect(success).toBe(false)
      })
    })

    it('handles localStorage errors gracefully during update', () => {
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const { result } = renderHook(() => useSavedRecipes())
      
      // First save a recipe
      act(() => {
        result.current.saveRecipe(mockRecipe)
      })
      
      act(() => {
        const success = result.current.updateRecipe(mockRecipe.id!, { title: 'New Title' })
        expect(success).toBe(false)
      })
    })

    it('preserves original ID during update', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      // First save a recipe
      act(() => {
        result.current.saveRecipe(mockRecipe)
      })
      
      const updatedData = {
        id: 'new-id', // This should be ignored
        title: 'Updated Recipe Title',
      }
      
      act(() => {
        result.current.updateRecipe(mockRecipe.id!, updatedData)
      })
      
      expect(result.current.savedRecipes[0].id).toBe(mockRecipe.id)
      expect(result.current.savedRecipes[0].title).toBe('Updated Recipe Title')
    })
  })

  describe('Load Saved Recipes', () => {
    it('loads recipes from localStorage', () => {
      const savedRecipes = [mockRecipe]
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(savedRecipes))
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.loadSavedRecipes()
      })
      
      expect(result.current.savedRecipes).toEqual(savedRecipes)
    })

    it('handles empty localStorage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.loadSavedRecipes()
      })
      
      expect(result.current.savedRecipes).toEqual([])
    })

    it('handles corrupted localStorage data', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-json')
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.loadSavedRecipes()
      })
      
      expect(result.current.savedRecipes).toEqual([])
    })

    it('sets loading to false after loading', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.loadSavedRecipes()
      })
      
      expect(result.current.loading).toBe(false)
    })
  })

  describe('User Changes', () => {
    it('reloads recipes when user changes', () => {
      const { result, rerender } = renderHook(() => useSavedRecipes())
      
      // Initial state with no user
      mockAuthContext.user = null
      expect(result.current.savedRecipes).toEqual([])
      
      // User logs in
      mockAuthContext.user = mockUser
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify([mockRecipe]))
      
      rerender()
      
      expect(result.current.savedRecipes).toEqual([mockRecipe])
    })

    it('clears recipes when user logs out', () => {
      const { result, rerender } = renderHook(() => useSavedRecipes())
      
      // Initial state with user
      mockAuthContext.user = mockUser
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify([mockRecipe]))
      
      expect(result.current.savedRecipes).toEqual([mockRecipe])
      
      // User logs out
      mockAuthContext.user = null
      
      rerender()
      
      expect(result.current.savedRecipes).toEqual([])
    })
  })

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', () => {
      const { result } = renderHook(() => useSavedRecipes())
      
      const initialRecipes = result.current.savedRecipes
      
      // Call a function that shouldn't change state
      act(() => {
        result.current.isRecipeSaved('non-existent-id')
      })
      
      expect(result.current.savedRecipes).toBe(initialRecipes)
    })

    it('handles large number of recipes efficiently', () => {
      const largeRecipeList = Array.from({ length: 100 }, (_, i) => ({
        ...mockRecipe,
        id: `recipe-${i}`,
        title: `Recipe ${i}`,
      }))
      
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(largeRecipeList))
      
      const { result } = renderHook(() => useSavedRecipes())
      
      expect(result.current.savedRecipes).toHaveLength(100)
      
      act(() => {
        const isSaved = result.current.isRecipeSaved('recipe-50')
        expect(isSaved).toBe(true)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles recipe with missing optional fields', () => {
      const minimalRecipe = {
        title: 'Minimal Recipe',
        servings: 1,
        cookingTime: '5 minutes',
        difficulty: 'Easy',
        source: 'manual',
      }
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.saveRecipe(minimalRecipe)
        expect(success).toBe(true)
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
      expect(result.current.savedRecipes[0]).toMatchObject(minimalRecipe)
    })

    it('handles recipe with special characters in title', () => {
      const specialRecipe = {
        ...mockRecipe,
        title: 'Recipe with Special Characters: @#$%^&*()',
      }
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        result.current.saveRecipe(specialRecipe)
      })
      
      expect(result.current.savedRecipes[0].title).toBe(specialRecipe.title)
    })

    it('handles very long recipe data', () => {
      const longRecipe = {
        ...mockRecipe,
        title: 'A'.repeat(1000),
        description: 'B'.repeat(5000),
        instructions: Array.from({ length: 100 }, (_, i) => `Step ${i}: ${'C'.repeat(100)}`),
      }
      
      const { result } = renderHook(() => useSavedRecipes())
      
      act(() => {
        const success = result.current.saveRecipe(longRecipe)
        expect(success).toBe(true)
      })
      
      expect(result.current.savedRecipes).toHaveLength(1)
      expect(result.current.savedRecipes[0].title).toBe(longRecipe.title)
    })
  })
})
