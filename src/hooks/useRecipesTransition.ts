"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecipesStore } from "@/stores/recipesStore";
import { UnifiedRecipe } from "@/types/recipe";

interface UseRecipesOptions {
  autoGenerate?: boolean;
  ingredients?: string[];
  servings?: number;
}

interface UseRecipesTransitionReturn {
  recipes: UnifiedRecipe[];
  loading: boolean;
  error: string | null;
  hasLoadedRecipes: boolean;
  removingRecipeId: string | null;
  activeIndex: number;
  generateRecipes: (ingredients: string[], servings: number) => Promise<void>;
  removeRecipe: (recipeId: string) => void;
  setActiveIndex: (index: number) => void;
  scrollToRecipe: (index: number) => void;
  clearError: () => void;
}

export const useRecipesTransition = (
  options: UseRecipesOptions = {}
): UseRecipesTransitionReturn => {
  const { autoGenerate = false, ingredients = [], servings = 4 } = options;
  const router = useRouter();

  // Obtener estado del store
  const recipes = useRecipesStore((state) => state.recipes);
  const loading = useRecipesStore((state) => state.isLoading);
  const error = useRecipesStore((state) => state.error);
  const hasLoadedRecipes = useRecipesStore((state) => state.hasLoadedRecipes);
  const removingRecipeId = useRecipesStore((state) => state.removingRecipeId);
  const activeIndex = useRecipesStore((state) => state.activeIndex);

  // Obtener acciones del store
  const generateRecipesAction = useRecipesStore((state) => state.generateRecipes);
  const removeRecipeAction = useRecipesStore((state) => state.removeRecipe);
  const setActiveIndexAction = useRecipesStore((state) => state.setActiveIndex);
  const scrollToRecipeAction = useRecipesStore((state) => state.scrollToRecipe);
  const clearErrorAction = useRecipesStore((state) => state.clearError);
  const setRemovingRecipeIdAction = useRecipesStore((state) => state.setRemovingRecipeId);

  // Wrapper para generateRecipes con lógica adicional
  const generateRecipes = useCallback(
    async (ingredients: string[], servings: number) => {
      await generateRecipesAction(ingredients, servings);
    },
    [generateRecipesAction]
  );

  // Wrapper para removeRecipe con lógica de timeout
  const removeRecipe = useCallback(
    (recipeId: string) => {
      console.log("🗑️ Removing recipe:", recipeId);
      setRemovingRecipeIdAction(recipeId);

      setTimeout(() => {
        removeRecipeAction(recipeId);
        setRemovingRecipeIdAction(null);

        // Actualizar sessionStorage
        const updatedRecipes = recipes.filter(
          (recipe) => recipe.id !== recipeId
        );
        sessionStorage.setItem(
          "currentRecipes",
          JSON.stringify(updatedRecipes)
        );
      }, 500);
    },
    [removeRecipeAction, setRemovingRecipeIdAction, recipes]
  );

  // Wrapper para scrollToRecipe
  const scrollToRecipe = useCallback(
    (index: number) => {
      scrollToRecipeAction(index);
    },
    [scrollToRecipeAction]
  );

  // Cargar recetas desde sessionStorage al montar
  useEffect(() => {
    const loadFromSessionStorage = () => {
      const savedRecipes = sessionStorage.getItem("currentRecipes");
      if (savedRecipes) {
        try {
          const parsedRecipes = JSON.parse(savedRecipes);
          console.log(
            "📦 Loading recipes from sessionStorage:",
            parsedRecipes.length
          );
          // Usar el store para cargar las recetas
          useRecipesStore.getState().setRecipes(parsedRecipes);
          useRecipesStore.getState().setHasLoadedRecipes(true);
          useRecipesStore.getState().setLoading(false);
          return true;
        } catch (error) {
          console.error("Error parsing saved recipes:", error);
        }
      }
      return false;
    };

    // Solo cargar desde sessionStorage si no hay parámetros específicos
    const urlParams = new URLSearchParams(window.location.search);
    const ingredientsParam = urlParams.get("ingredients");
    const servingsParam = urlParams.get("servings");
    const forceGenerate = urlParams.get("force") === "true";

    const hasSpecificParams =
      ingredientsParam || servingsParam || forceGenerate;

    if (!hasSpecificParams) {
      const loaded = loadFromSessionStorage();
      if (loaded) return;
    }

    // Si no hay recetas en sessionStorage o hay parámetros específicos, generar nuevas
    if (autoGenerate && ingredients.length > 0) {
      generateRecipes(ingredients, servings);
    } else if (hasSpecificParams) {
      const ingredientsToUse = ingredientsParam
        ? ingredientsParam.split(",")
        : ingredients;
      const servingsToUse = servingsParam ? parseInt(servingsParam) : servings;
      generateRecipes(ingredientsToUse, servingsToUse);
    } else {
      useRecipesStore.getState().setLoading(false);
    }
  }, [autoGenerate, ingredients, servings, generateRecipes]);

  return {
    recipes,
    loading,
    error,
    hasLoadedRecipes,
    removingRecipeId,
    activeIndex,
    generateRecipes,
    removeRecipe,
    setActiveIndex: setActiveIndexAction,
    scrollToRecipe,
    clearError: clearErrorAction,
  };
};

export default useRecipesTransition;
