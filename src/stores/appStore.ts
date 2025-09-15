import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookingTime: string;
  image?: string;
  source: string;
  difficulty?: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}

interface AppState {
  // User state
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Recipes state
  recipes: Recipe[];
  savedRecipes: string[];
  hasLoadedRecipes: boolean;
  removingRecipeId: string | null;

  // Navigation state
  activeIndex: number;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Recipe actions
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
  setHasLoadedRecipes: (loaded: boolean) => void;
  setRemovingRecipeId: (id: string | null) => void;

  // Saved recipes actions
  saveRecipe: (recipeId: string) => void;
  unsaveRecipe: (recipeId: string) => void;
  isRecipeSaved: (recipeId: string) => boolean;

  // Navigation actions
  setActiveIndex: (index: number) => void;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  recipes: [],
  savedRecipes: [],
  hasLoadedRecipes: false,
  removingRecipeId: null,
  activeIndex: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User actions
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Recipe actions
      setRecipes: (recipes) => set({ recipes }),
      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [...state.recipes, recipe],
        })),
      removeRecipe: (recipeId) =>
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
        })),
      setHasLoadedRecipes: (hasLoadedRecipes) => set({ hasLoadedRecipes }),
      setRemovingRecipeId: (removingRecipeId) => set({ removingRecipeId }),

      // Saved recipes actions
      saveRecipe: (recipeId) =>
        set((state) => ({
          savedRecipes: [...state.savedRecipes, recipeId],
        })),
      unsaveRecipe: (recipeId) =>
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((id) => id !== recipeId),
        })),
      isRecipeSaved: (recipeId) => {
        const state = get();
        return state.savedRecipes.includes(recipeId);
      },

      // Navigation actions
      setActiveIndex: (activeIndex) => set({ activeIndex }),

      // Utility actions
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: "chef-at-home-storage",
      // Only persist user and savedRecipes, not temporary state
      partialize: (state) => ({
        user: state.user,
        savedRecipes: state.savedRecipes,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useRecipes = () => useAppStore((state) => state.recipes);
export const useSavedRecipes = () => useAppStore((state) => state.savedRecipes);
export const useHasLoadedRecipes = () =>
  useAppStore((state) => state.hasLoadedRecipes);
export const useRemovingRecipeId = () =>
  useAppStore((state) => state.removingRecipeId);
export const useActiveIndex = () => useAppStore((state) => state.activeIndex);

// Action selectors
export const useAppActions = () =>
  useAppStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    setRecipes: state.setRecipes,
    addRecipe: state.addRecipe,
    removeRecipe: state.removeRecipe,
    setHasLoadedRecipes: state.setHasLoadedRecipes,
    setRemovingRecipeId: state.setRemovingRecipeId,
    saveRecipe: state.saveRecipe,
    unsaveRecipe: state.unsaveRecipe,
    isRecipeSaved: state.isRecipeSaved,
    setActiveIndex: state.setActiveIndex,
    clearError: state.clearError,
    reset: state.reset,
  }));
