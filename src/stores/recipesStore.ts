import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Recipe } from "@/types/recipe";

interface RecipesState {
  // Estado
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  hasLoadedRecipes: boolean;
  activeIndex: number;

  // Acciones
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setHasLoadedRecipes: (loaded: boolean) => void;
  setActiveIndex: (index: number) => void;
  clearRecipes: () => void;
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      recipes: [],
      isLoading: false,
      error: null,
      hasLoadedRecipes: false,
      activeIndex: 0,

      // Acciones
      setRecipes: (recipes) => set({ recipes, error: null }),
      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [...state.recipes, recipe],
          error: null,
        })),
      removeRecipe: (recipeId) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== recipeId),
          error: null,
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setHasLoadedRecipes: (hasLoadedRecipes) => set({ hasLoadedRecipes }),
      setActiveIndex: (activeIndex) => set({ activeIndex }),
      clearRecipes: () =>
        set({
          recipes: [],
          hasLoadedRecipes: false,
          activeIndex: 0,
          error: null,
        }),
    }),
    {
      name: "recipes-storage",
      partialize: (state) => ({
        recipes: state.recipes,
        hasLoadedRecipes: state.hasLoadedRecipes,
        activeIndex: state.activeIndex,
      }),
    }
  )
);

// Selectores para facilitar el uso
export const useRecipes = () => useRecipesStore((state) => state.recipes);
export const useRecipesLoading = () =>
  useRecipesStore((state) => state.isLoading);
export const useRecipesError = () => useRecipesStore((state) => state.error);
export const useHasLoadedRecipes = () =>
  useRecipesStore((state) => state.hasLoadedRecipes);
export const useActiveIndex = () =>
  useRecipesStore((state) => state.activeIndex);
export const useRecipesActions = () =>
  useRecipesStore((state) => ({
    setRecipes: state.setRecipes,
    addRecipe: state.addRecipe,
    removeRecipe: state.removeRecipe,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    setHasLoadedRecipes: state.setHasLoadedRecipes,
    setActiveIndex: state.setActiveIndex,
    clearRecipes: state.clearRecipes,
  }));
