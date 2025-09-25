import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserResponse } from "@/types";
import { authService } from "@/services/authService";

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
  // User state (compatible with AuthContext)
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;

  // Recipes state
  recipes: Recipe[];
  savedRecipes: string[];
  hasLoadedRecipes: boolean;
  removingRecipeId: string | null;

  // Navigation state
  activeIndex: number;

  // Auth actions (compatible with AuthContext)
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // User actions
  setUser: (user: UserResponse | null) => void;
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
  isLoading: false, // Start with false to avoid infinite loops
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

      // Auth actions (compatible with AuthContext) - Ahora usa el servicio externo
      login: async (email: string, password: string): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });

          const result = await authService.login({ email, password });

          if (result.success && result.user) {
            set({ user: result.user, isLoading: false });
            authService.saveUserToStorage(result.user);
            return true;
          } else {
            set({ error: result.error || "Login failed", isLoading: false });
            return false;
          }
        } catch (error) {
          console.error("Login error:", error);
          set({ error: "An unexpected error occurred", isLoading: false });
          return false;
        }
      },

      register: async (
        name: string,
        email: string,
        password: string
      ): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });

          const result = await authService.register({ name, email, password });

          if (result.success) {
            set({ isLoading: false });
            return true;
          } else {
            set({
              error: result.error || "Registration failed",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          console.error("Registration error:", error);
          set({ error: "An unexpected error occurred", isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null });
        authService.removeUserFromStorage();
      },

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

// Store exports are used directly via useAppStore hook
