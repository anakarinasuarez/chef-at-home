import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StorageManager, STORAGE_KEYS } from "@/utils/storage";

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

export interface SavedRecipesState {
  // Estado
  savedRecipes: FrontendRecipe[];
  isLoading: boolean;
  error: string | null;
  removingRecipeId: string | null;

  // Acciones
  loadSavedRecipes: (userId: string) => void;
  saveRecipe: (recipe: FrontendRecipe, userId: string) => boolean;
  removeRecipe: (recipeId: string, userId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setRemovingRecipeId: (id: string | null) => void;
  clearSavedRecipes: () => void;
}

export const useSavedRecipesStore = create<SavedRecipesState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      savedRecipes: [],
      isLoading: false,
      error: null,
      removingRecipeId: null,

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
            error:
              error instanceof Error ? error.message : "Error loading recipes",
            isLoading: false,
          });
        }
      },

      saveRecipe: (recipe: FrontendRecipe, userId: string) => {
        try {
          const recipeToSave = {
            ...recipe,
            id: recipe.id || Date.now().toString(),
            savedAt: new Date().toISOString(),
          };

          const currentRecipes = get().savedRecipes;
          const updatedRecipes = [...currentRecipes, recipeToSave];

          set({ savedRecipes: updatedRecipes, error: null });

          const success = StorageManager.setJSON(
            STORAGE_KEYS.SAVED_RECIPES(userId),
            updatedRecipes
          );

          // Cache individual de la receta
          if (
            !StorageManager.getItem(STORAGE_KEYS.RECIPE_CACHE(recipeToSave.id))
          ) {
            StorageManager.setJSON(
              STORAGE_KEYS.RECIPE_CACHE(recipeToSave.id),
              recipeToSave
            );
          }

          return success;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Error saving recipe",
          });
          return false;
        }
      },

      removeRecipe: (recipeId: string, userId: string) => {
        try {
          const currentRecipes = get().savedRecipes;
          const updatedRecipes = currentRecipes.filter(
            (recipe) => recipe.id !== recipeId
          );

          set({ savedRecipes: updatedRecipes, error: null });

          return StorageManager.setJSON(
            STORAGE_KEYS.SAVED_RECIPES(userId),
            updatedRecipes
          );
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Error removing recipe",
          });
          return false;
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setRemovingRecipeId: (removingRecipeId) => set({ removingRecipeId }),
      clearSavedRecipes: () =>
        set({
          savedRecipes: [],
          error: null,
          removingRecipeId: null,
        }),
    }),
    {
      name: "saved-recipes-storage",
      partialize: (state) => ({
        savedRecipes: state.savedRecipes,
      }),
    }
  )
);

// Selectores para facilitar el uso
export const useSavedRecipes = () =>
  useSavedRecipesStore((state) => state.savedRecipes);
export const useSavedRecipesLoading = () =>
  useSavedRecipesStore((state) => state.isLoading);
export const useSavedRecipesError = () =>
  useSavedRecipesStore((state) => state.error);
export const useSavedRecipesRemovingId = () =>
  useSavedRecipesStore((state) => state.removingRecipeId);
export const useSavedRecipesActions = () =>
  useSavedRecipesStore((state) => ({
    loadSavedRecipes: state.loadSavedRecipes,
    saveRecipe: state.saveRecipe,
    removeRecipe: state.removeRecipe,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    setRemovingRecipeId: state.setRemovingRecipeId,
    clearSavedRecipes: state.clearSavedRecipes,
  }));
