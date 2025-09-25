import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UnifiedRecipe } from "@/types/recipe";
import { recipeGenerationService } from "@/services/recipeGenerationService";
import { UniversalCacheManager } from "@/lib/universal-cache";

// Estado inicial estandarizado
const initialState = {
  recipes: [] as UnifiedRecipe[],
  isLoading: false,
  error: null as string | null,
  hasLoadedRecipes: false,
  activeIndex: 0,
  removingRecipeId: null as string | null,
};

export interface RecipesState {
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

  // Acciones específicas de generación
  generateRecipes: (ingredients: string[], servings: number) => Promise<void>;
  scrollToRecipe: (index: number) => void;
  clearCache: () => Promise<void>;
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones básicas
      setRecipes: (recipes) => set({ recipes, error: null }),
      addRecipe: (recipe) => {
        const { recipes } = get();
        set({ recipes: [...recipes, recipe] });
      },
      removeRecipe: (recipeId) => {
        const { recipes } = get();
        set({ recipes: recipes.filter((r) => r.id !== recipeId) });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setHasLoadedRecipes: (hasLoadedRecipes) => set({ hasLoadedRecipes }),
      setActiveIndex: (activeIndex) => set({ activeIndex }),
      setRemovingRecipeId: (removingRecipeId) => set({ removingRecipeId }),
      clearRecipes: () => set({ recipes: [], hasLoadedRecipes: false }),

      // Generar recetas - Usa el servicio externo
      generateRecipes: async (ingredients: string[], servings: number) => {
        set({ isLoading: true, error: null });

        try {
          const result = await recipeGenerationService.generateRecipes({
            ingredients,
            servings,
            count: 4,
          });

          if (result.success && result.recipes) {
            set({
              recipes: result.recipes,
              hasLoadedRecipes: true,
              isLoading: false,
            });

            // Guardar en sessionStorage usando el servicio
            recipeGenerationService.saveRecipesToSession(result.recipes);
          } else {
            set({
              error: result.error || "No recipes generated",
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error generating recipes:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to generate recipes",
            isLoading: false,
          });
        }
      },

      // Scroll a receta específica
      scrollToRecipe: (index: number) => {
        set({ activeIndex: index });
        // Scroll logic se maneja en el componente
      },

      // Limpiar cache
      clearCache: async () => {
        try {
          // Limpiar sessionStorage
          recipeGenerationService.clearRecipesFromSession();

          // Limpiar cache usando UniversalCacheManager
          await UniversalCacheManager.clearAllCache();

          // Limpiar localStorage relacionado con recetas
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (
              key &&
              (key.startsWith("recipes_") ||
                key.startsWith("image_") ||
                key.includes("cache"))
            ) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key));

          // Limpiar estado
          set({
            recipes: [],
            hasLoadedRecipes: false,
            isLoading: false,
          });

          console.log("🧹 Cache cleared successfully");
        } catch (error) {
          console.error("Error clearing cache:", error);
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

// Selectores estandarizados para evitar renders innecesarios
export const useRecipes = () => useRecipesStore((state) => state.recipes);
export const useRecipesLoading = () =>
  useRecipesStore((state) => state.isLoading);
export const useRecipesError = () => useRecipesStore((state) => state.error);
export const useHasLoadedRecipes = () =>
  useRecipesStore((state) => state.hasLoadedRecipes);
export const useActiveRecipeIndex = () =>
  useRecipesStore((state) => state.activeIndex);
export const useRemovingRecipeId = () =>
  useRecipesStore((state) => state.removingRecipeId);

// Selector de acciones
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
    clearCache: state.clearCache,
  }));
