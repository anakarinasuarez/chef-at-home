import { STORAGE_KEYS, StorageManager } from '@/utils/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface para recetas guardadas (compatible con el sistema actual)
interface FrontendRecipe {
  id?: string;
  title: string;
  servings: number;
  cookingTime: string;
  difficulty: string;
  image?: string;
  source: string;
  ingredients?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions?: string[];
  description?: string;
  savedAt?: string;
}

// Estado inicial estandarizado
const initialState = {
  savedRecipes: [] as FrontendRecipe[],
  isLoading: false,
  error: null as string | null,
  removingRecipeId: null as string | null,
};

export interface SavedRecipesState {
  // Estado
  savedRecipes: FrontendRecipe[];
  isLoading: boolean;
  error: string | null;
  removingRecipeId: string | null;

  // Acciones básicas
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setRemovingRecipeId: (id: string | null) => void;
  clearSavedRecipes: () => void;

  // Acciones específicas de recetas guardadas
  loadSavedRecipes: (userId: string) => void;
  saveRecipe: (recipe: FrontendRecipe, userId: string) => boolean;
  removeRecipe: (recipeId: string, userId: string) => boolean;
  updateRecipe: (recipeId: string, updatedRecipe: FrontendRecipe, userId: string) => boolean;
}

export const useSavedRecipesStore = create<SavedRecipesState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones
      loadSavedRecipes: (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const savedRecipes = StorageManager.getJSON<FrontendRecipe[]>(
            STORAGE_KEYS.SAVED_RECIPES(userId)
          );

          set({
            savedRecipes: savedRecipes || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error loading recipes',
            isLoading: false,
          });
        }
      },

      saveRecipe: (recipe: FrontendRecipe, userId: string) => {
        try {
          console.log('💾 saveRecipe called with:', { recipe, userId });

          const recipeToSave = {
            ...recipe,
            id: recipe.id || Date.now().toString(),
            savedAt: new Date().toISOString(),
          };

          console.log('💾 Recipe to save:', recipeToSave);

          const currentRecipes = get().savedRecipes;
          console.log('💾 Current saved recipes:', currentRecipes.length);

          // Verificar si la receta ya existe
          const existingIndex = currentRecipes.findIndex(r => r.id === recipeToSave.id);
          if (existingIndex !== -1) {
            console.log('💾 Recipe already exists, updating...');
            const updatedRecipes = [...currentRecipes];
            updatedRecipes[existingIndex] = recipeToSave;
            set({ savedRecipes: updatedRecipes, error: null });

            const success = StorageManager.setJSON(
              STORAGE_KEYS.SAVED_RECIPES(userId),
              updatedRecipes
            );

            console.log('💾 Update result:', success);
            return success;
          }

          const updatedRecipes = [...currentRecipes, recipeToSave];
          console.log('💾 Updated recipes count:', updatedRecipes.length);

          set({ savedRecipes: updatedRecipes, error: null });

          const success = StorageManager.setJSON(
            STORAGE_KEYS.SAVED_RECIPES(userId),
            updatedRecipes
          );

          console.log('💾 Storage save result:', success);

          // Cache individual de la receta
          if (!StorageManager.getItem(STORAGE_KEYS.RECIPE_CACHE(recipeToSave.id))) {
            StorageManager.setJSON(STORAGE_KEYS.RECIPE_CACHE(recipeToSave.id), recipeToSave);
          }

          return success;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error saving recipe',
          });
          return false;
        }
      },

      removeRecipe: (recipeId: string, userId: string) => {
        try {
          const currentRecipes = get().savedRecipes;
          const updatedRecipes = currentRecipes.filter(recipe => recipe.id !== recipeId);

          set({ savedRecipes: updatedRecipes, error: null });

          return StorageManager.setJSON(STORAGE_KEYS.SAVED_RECIPES(userId), updatedRecipes);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error removing recipe',
          });
          return false;
        }
      },

      updateRecipe: (recipeId: string, updatedRecipe: FrontendRecipe, userId: string) => {
        try {
          const currentRecipes = get().savedRecipes;
          const recipeIndex = currentRecipes.findIndex(recipe => recipe.id === recipeId);

          if (recipeIndex === -1) {
            console.log('💾 updateRecipe: Recipe not found with ID:', recipeId);
            set({
              error: 'Recipe not found',
            });
            return false;
          }

          console.log('💾 updateRecipe: Found recipe at index:', recipeIndex);
          console.log('💾 updateRecipe: Original recipe:', currentRecipes[recipeIndex]);
          console.log('💾 updateRecipe: Updated recipe:', updatedRecipe);

          const updatedRecipes = [...currentRecipes];
          updatedRecipes[recipeIndex] = {
            ...updatedRecipe,
            id: recipeId, // Mantener el ID original
            savedAt: currentRecipes[recipeIndex].savedAt, // Mantener la fecha original
          };

          console.log('💾 updateRecipe: Final updated recipe:', updatedRecipes[recipeIndex]);

          set({ savedRecipes: updatedRecipes, error: null });

          const success = StorageManager.setJSON(
            STORAGE_KEYS.SAVED_RECIPES(userId),
            updatedRecipes
          );

          // Actualizar cache individual de la receta
          StorageManager.setJSON(STORAGE_KEYS.RECIPE_CACHE(recipeId), updatedRecipes[recipeIndex]);

          console.log('💾 updateRecipe: Success:', success);
          return success;
        } catch (error) {
          console.error('💾 updateRecipe: Error:', error);
          set({
            error: error instanceof Error ? error.message : 'Error updating recipe',
          });
          return false;
        }
      },

      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
      clearError: () => set({ error: null }),
      setRemovingRecipeId: removingRecipeId => set({ removingRecipeId }),
      clearSavedRecipes: () =>
        set({
          savedRecipes: [],
          error: null,
          removingRecipeId: null,
        }),
    }),
    {
      name: 'saved-recipes-storage',
      partialize: state => ({
        savedRecipes: state.savedRecipes,
      }),
    }
  )
);

// Selectores estandarizados para evitar renders innecesarios
export const useSavedRecipes = () => useSavedRecipesStore(state => state.savedRecipes);
export const useSavedRecipesLoading = () => useSavedRecipesStore(state => state.isLoading);
export const useSavedRecipesError = () => useSavedRecipesStore(state => state.error);
export const useSavedRecipesRemovingId = () =>
  useSavedRecipesStore(state => state.removingRecipeId);

// Selector de acciones
export const useSavedRecipesActions = () =>
  useSavedRecipesStore(state => ({
    loadSavedRecipes: state.loadSavedRecipes,
    saveRecipe: state.saveRecipe,
    removeRecipe: state.removeRecipe,
    updateRecipe: state.updateRecipe,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    setRemovingRecipeId: state.setRemovingRecipeId,
    clearSavedRecipes: state.clearSavedRecipes,
  }));
