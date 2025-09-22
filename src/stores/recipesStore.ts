import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UnifiedRecipe, convertToUnifiedRecipe } from "@/types/recipe";

interface RecipesState {
  // Estado
  recipes: UnifiedRecipe[];
  isLoading: boolean;
  error: string | null;
  hasLoadedRecipes: boolean;
  activeIndex: number;
  removingRecipeId: string | null;

  // Acciones básicas
  setRecipes: (recipes: UnifiedRecipe[]) => void;
  addRecipe: (recipe: UnifiedRecipe) => void;
  removeRecipe: (recipeId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setHasLoadedRecipes: (loaded: boolean) => void;
  setActiveIndex: (index: number) => void;
  setRemovingRecipeId: (id: string | null) => void;
  clearRecipes: () => void;

  // Acciones específicas de useRecipes
  generateRecipes: (ingredients: string[], servings: number) => Promise<void>;
  scrollToRecipe: (index: number) => void;
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      recipes: [],
      isLoading: true,
      error: null,
      hasLoadedRecipes: false,
      activeIndex: 0,
      removingRecipeId: null,

      // Acciones básicas
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
      setRemovingRecipeId: (removingRecipeId) => set({ removingRecipeId }),
      clearRecipes: () =>
        set({
          recipes: [],
          hasLoadedRecipes: false,
          activeIndex: 0,
          error: null,
          removingRecipeId: null,
        }),

      // Generar recetas
      generateRecipes: async (ingredients: string[], servings: number) => {
        set({ isLoading: true });
        set({ error: null });

        try {
          const response = await fetch("/api/recipes/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ingredients,
              servings,
              count: 4,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Number of recipes received:", data.recipes?.length || 0);

          if (!data.recipes || data.recipes.length === 0) {
            throw new Error("No recipes generated");
          }

          // Convertir a UnifiedRecipe
          const unifiedRecipes = data.recipes.map((recipe: unknown) =>
            convertToUnifiedRecipe(recipe)
          );

          set({ recipes: unifiedRecipes, hasLoadedRecipes: true });

          // Guardar en sessionStorage
          sessionStorage.setItem(
            "currentRecipes",
            JSON.stringify(unifiedRecipes)
          );
        } catch (error) {
          console.error("Error generating recipes:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to generate recipes",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Scroll a receta
      scrollToRecipe: (index: number) => {
        const element = document.getElementById(`recipe-${index}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          set({ activeIndex: index });
        }
      },
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
export const useRemovingRecipeId = () =>
  useRecipesStore((state) => state.removingRecipeId);
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
    setRemovingRecipeId: state.setRemovingRecipeId,
    clearRecipes: state.clearRecipes,
    generateRecipes: state.generateRecipes,
    scrollToRecipe: state.scrollToRecipe,
  }));
