import { useCallback, useEffect } from "react";
import {
  useAppStore,
  useRecipes,
  useSavedRecipes,
  useUser,
  useAppActions,
} from "@/stores/appStore";

// Types matching the existing useSavedRecipes
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

interface UseSavedRecipesReturn {
  savedRecipes: FrontendRecipe[];
  loading: boolean;
  saveRecipe: (recipe: FrontendRecipe) => boolean;
  removeRecipe: (recipeId: string) => boolean;
  isRecipeSaved: (recipeId: string) => boolean;
  toggleSaveRecipe: (recipe: FrontendRecipe) => boolean;
  updateRecipe: (
    recipeId: string,
    updatedData: Partial<FrontendRecipe>
  ) => boolean;
  loadSavedRecipes: () => void;
}

export const useSavedRecipesZustand = (): UseSavedRecipesReturn => {
  const user = useUser();
  const savedRecipeIds = useSavedRecipes();
  const {
    saveRecipe: saveRecipeId,
    unsaveRecipe: unsaveRecipeId,
    isRecipeSaved: isRecipeIdSaved,
  } = useAppActions();

  // Convert saved recipe IDs to full recipe objects
  const savedRecipes: FrontendRecipe[] = savedRecipeIds
    .map((id) => {
      const recipeData = localStorage.getItem(`recipe-${id}`);
      if (recipeData) {
        try {
          return JSON.parse(recipeData);
        } catch (error) {
          console.error("Error parsing saved recipe:", error);
          return null;
        }
      }
      return null;
    })
    .filter(Boolean) as FrontendRecipe[];

  const saveRecipe = useCallback(
    (recipe: FrontendRecipe): boolean => {
      if (!user) return false;

      try {
        const recipeToSave = {
          ...recipe,
          id: recipe.id || Date.now().toString(),
          savedAt: new Date().toISOString(),
        };

        // Save to Zustand store
        saveRecipeId(recipeToSave.id);

        // Save to localStorage for compatibility
        localStorage.setItem(
          `savedRecipes_${user.id}`,
          JSON.stringify([...savedRecipes, recipeToSave])
        );

        // Also save in localStorage for detail page access
        localStorage.setItem(
          `recipe-${recipeToSave.id}`,
          JSON.stringify(recipeToSave)
        );

        return true;
      } catch (error) {
        console.error("Error saving recipe:", error);
        return false;
      }
    },
    [user, savedRecipes, saveRecipeId]
  );

  const removeRecipe = useCallback(
    (recipeId: string): boolean => {
      if (!user) return false;

      try {
        // Remove from Zustand store
        unsaveRecipeId(recipeId);

        // Update localStorage for compatibility
        const updatedRecipes = savedRecipes.filter(
          (recipe) => recipe.id !== recipeId
        );
        localStorage.setItem(
          `savedRecipes_${user.id}`,
          JSON.stringify(updatedRecipes)
        );

        return true;
      } catch (error) {
        console.error("Error removing recipe:", error);
        return false;
      }
    },
    [user, savedRecipes, unsaveRecipeId]
  );

  const isRecipeSaved = useCallback(
    (recipeId: string): boolean => {
      return isRecipeIdSaved(recipeId);
    },
    [isRecipeIdSaved]
  );

  const toggleSaveRecipe = useCallback(
    (recipe: FrontendRecipe): boolean => {
      const recipeId = recipe.id || Date.now().toString();

      if (isRecipeSaved(recipeId)) {
        return removeRecipe(recipeId);
      } else {
        return saveRecipe({ ...recipe, id: recipeId });
      }
    },
    [isRecipeSaved, removeRecipe, saveRecipe]
  );

  const updateRecipe = useCallback(
    (recipeId: string, updatedData: Partial<FrontendRecipe>): boolean => {
      if (!user) return false;

      try {
        const recipeIndex = savedRecipes.findIndex(
          (recipe) => recipe.id === recipeId
        );

        if (recipeIndex === -1) {
          console.error("Recipe not found for update:", recipeId);
          return false;
        }

        const updatedRecipe = {
          ...savedRecipes[recipeIndex],
          ...updatedData,
          id: recipeId, // Preserve original ID
        };

        // Update localStorage for compatibility
        const updatedRecipes = [...savedRecipes];
        updatedRecipes[recipeIndex] = updatedRecipe;
        localStorage.setItem(
          `savedRecipes_${user.id}`,
          JSON.stringify(updatedRecipes)
        );

        // Update recipe detail storage
        localStorage.setItem(
          `recipe-${recipeId}`,
          JSON.stringify(updatedRecipe)
        );

        return true;
      } catch (error) {
        console.error("Error updating recipe:", error);
        return false;
      }
    },
    [user, savedRecipes]
  );

  const loadSavedRecipes = useCallback(() => {
    if (!user) return;

    try {
      const saved = localStorage.getItem(`savedRecipes_${user.id}`);
      if (saved) {
        const parsedRecipes = JSON.parse(saved);
        // Update Zustand store with saved recipe IDs
        parsedRecipes.forEach((recipe: FrontendRecipe) => {
          if (recipe.id && !isRecipeSaved(recipe.id)) {
            saveRecipeId(recipe.id);
          }
        });
      }
    } catch (error) {
      console.error("Error loading saved recipes:", error);
    }
  }, [user, isRecipeSaved, saveRecipeId]);

  // Load saved recipes on mount
  useEffect(() => {
    loadSavedRecipes();
  }, [loadSavedRecipes]);

  return {
    savedRecipes,
    loading: false, // Zustand handles loading state
    saveRecipe,
    removeRecipe,
    isRecipeSaved,
    toggleSaveRecipe,
    updateRecipe,
    loadSavedRecipes,
  };
};
