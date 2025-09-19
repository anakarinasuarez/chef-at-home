import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UnifiedRecipe, convertToUnifiedRecipe } from "@/types/recipe";
import { useErrorHandler } from "./useErrorHandler";

interface UseRecipesOptions {
  autoGenerate?: boolean;
  ingredients?: string[];
  servings?: number;
}

interface UseRecipesReturn {
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

export const useRecipes = (
  options: UseRecipesOptions = {}
): UseRecipesReturn => {
  const { autoGenerate = false, ingredients = [], servings = 4 } = options;
  const router = useRouter();
  const { errorState, handleError, clearError } = useErrorHandler();

  const [recipes, setRecipes] = useState<UnifiedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);
  const [removingRecipeId, setRemovingRecipeId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Función para generar recetas
  const generateRecipes = useCallback(
    async (ingredients: string[], servings: number) => {
      setLoading(true);
      clearError();

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
        const unifiedRecipes = data.recipes.map((recipe: any) =>
          convertToUnifiedRecipe(recipe)
        );

        setRecipes(unifiedRecipes);
        setHasLoadedRecipes(true);

        // Guardar en sessionStorage
        sessionStorage.setItem(
          "currentRecipes",
          JSON.stringify(unifiedRecipes)
        );
      } catch (error) {
        console.error("Error generating recipes:", error);
        handleError(
          error instanceof Error ? error : "Failed to generate recipes"
        );
      } finally {
        setLoading(false);
      }
    },
    [clearError, handleError]
  );

  // Función para remover receta
  const removeRecipe = useCallback(
    (recipeId: string) => {
      console.log("🗑️ Removing recipe:", recipeId);
      setRemovingRecipeId(recipeId);

      setTimeout(() => {
        const updatedRecipes = recipes.filter(
          (recipe) => recipe.id !== recipeId
        );
        setRecipes(updatedRecipes);
        setRemovingRecipeId(null);

        // Actualizar sessionStorage
        sessionStorage.setItem(
          "currentRecipes",
          JSON.stringify(updatedRecipes)
        );
      }, 500);
    },
    [recipes]
  );

  // Función para scroll a receta
  const scrollToRecipe = useCallback((index: number) => {
    const element = document.getElementById(`recipe-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveIndex(index);
    }
  }, []);

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
          setRecipes(parsedRecipes);
          setHasLoadedRecipes(true);
          setLoading(false);
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
      setLoading(false);
    }
  }, [autoGenerate, ingredients, servings, generateRecipes]);

  return {
    recipes,
    loading,
    error: errorState.errorMessage,
    hasLoadedRecipes,
    removingRecipeId,
    activeIndex,
    generateRecipes,
    removeRecipe,
    setActiveIndex,
    scrollToRecipe,
    clearError,
  };
};
