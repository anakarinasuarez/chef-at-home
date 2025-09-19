"use client";

import { useCallback, useEffect } from "react";
import { useRecipesGenerationStore } from "@/stores/recipesGenerationStore";

interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookingTime: string;
  image?: string;
  source: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}

interface UseRecipesGenerationTransitionReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  hasLoadedRecipes: boolean;
  generateRecipes: () => Promise<void>;
  clearCache: () => Promise<void>;
}

export const useRecipesGenerationTransition = (): UseRecipesGenerationTransitionReturn => {
  // Obtener estado del store
  const recipes = useRecipesGenerationStore((state) => state.recipes);
  const loading = useRecipesGenerationStore((state) => state.isLoading);
  const error = useRecipesGenerationStore((state) => state.error);
  const hasLoadedRecipes = useRecipesGenerationStore((state) => state.hasLoadedRecipes);

  // Obtener acciones del store
  const generateRecipesAction = useRecipesGenerationStore((state) => state.generateRecipes);
  const clearCacheAction = useRecipesGenerationStore((state) => state.clearCache);

  // Wrapper para generateRecipes
  const generateRecipes = useCallback(
    async () => {
      await generateRecipesAction();
    },
    [generateRecipesAction]
  );

  // Wrapper para clearCache
  const clearCache = useCallback(
    async () => {
      await clearCacheAction();
    },
    [clearCacheAction]
  );

  // Generate recipes with AI when component mounts
  useEffect(() => {
    console.log("🚀 useEffect triggered - hasLoadedRecipes:", hasLoadedRecipes);
    generateRecipes();
  }, [generateRecipes, hasLoadedRecipes]);

  return {
    recipes,
    loading,
    error,
    hasLoadedRecipes,
    generateRecipes,
    clearCache,
  };
};

export default useRecipesGenerationTransition;
