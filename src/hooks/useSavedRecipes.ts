import { useState, useEffect, useCallback } from "react";
import { useAuthUnified } from "@/hooks";
import { StorageManager, STORAGE_KEYS } from "@/utils";

// Tipo flexible para recetas en el frontend
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

export const useSavedRecipes = () => {
  const { user } = useAuthUnified();
  const [savedRecipes, setSavedRecipes] = useState<FrontendRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar recetas guardadas
  const loadSavedRecipes = useCallback(() => {
    if (!user) {
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    const savedRecipes = StorageManager.getJSON<FrontendRecipe[]>(
      STORAGE_KEYS.SAVED_RECIPES(user.id)
    );

    setSavedRecipes(savedRecipes || []);
    setLoading(false);
  }, [user]);

  // Guardar una receta
  const saveRecipe = (recipe: FrontendRecipe): boolean => {
    if (!user) return false;

    const recipeToSave = {
      ...recipe,
      id: recipe.id || Date.now().toString(),
      savedAt: new Date().toISOString(),
    };

    const updatedRecipes = [...savedRecipes, recipeToSave];
    setSavedRecipes(updatedRecipes);

    const success = StorageManager.setJSON(
      STORAGE_KEYS.SAVED_RECIPES(user.id),
      updatedRecipes
    );

    // También guardar en localStorage para que la página de detalle pueda acceder
    // Solo si no existe ya una entrada con este ID
    if (!StorageManager.getItem(STORAGE_KEYS.RECIPE_CACHE(recipeToSave.id))) {
      StorageManager.setJSON(
        STORAGE_KEYS.RECIPE_CACHE(recipeToSave.id),
        recipeToSave
      );
    }

    return success;
  };

  // Remover una receta guardada
  const removeRecipe = (recipeId: string): boolean => {
    if (!user) return false;

    const updatedRecipes = savedRecipes.filter(
      (recipe) => recipe.id !== recipeId
    );
    setSavedRecipes(updatedRecipes);

    return StorageManager.setJSON(
      STORAGE_KEYS.SAVED_RECIPES(user.id),
      updatedRecipes
    );
  };

  // Verificar si una receta está guardada
  const isRecipeSaved = (recipeId: string): boolean => {
    const isSaved = savedRecipes.some((recipe) => recipe.id === recipeId);
    console.log("🔍 isRecipeSaved check:", {
      recipeId,
      isSaved,
      savedRecipesCount: savedRecipes.length,
      savedRecipeIds: savedRecipes.map((r) => r.id),
    });
    return isSaved;
  };

  // Toggle guardar/remover receta
  const toggleSaveRecipe = (recipe: FrontendRecipe): boolean => {
    const recipeId = recipe.id || Date.now().toString();

    if (isRecipeSaved(recipeId)) {
      return removeRecipe(recipeId);
    } else {
      return saveRecipe({ ...recipe, id: recipeId });
    }
  };

  // Actualizar una receta existente
  const updateRecipe = (
    recipeId: string,
    updatedData: Partial<FrontendRecipe>
  ): boolean => {
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
        id: recipeId, // Mantener el ID original
      };

      const updatedRecipes = [...savedRecipes];
      updatedRecipes[recipeIndex] = updatedRecipe;

      setSavedRecipes(updatedRecipes);
      localStorage.setItem(
        `savedRecipes_${user.id}`,
        JSON.stringify(updatedRecipes)
      );

      // También actualizar en localStorage para que la página de detalle pueda acceder
      localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(updatedRecipe));

      return true;
    } catch (error) {
      console.error("Error updating recipe:", error);
      return false;
    }
  };

  // Cargar recetas al montar el componente
  useEffect(() => {
    loadSavedRecipes();
  }, [user?.id, loadSavedRecipes]); // Solo depende del ID del usuario, no del objeto completo

  return {
    savedRecipes,
    loading,
    saveRecipe,
    removeRecipe,
    isRecipeSaved,
    toggleSaveRecipe,
    updateRecipe,
    loadSavedRecipes,
  };
};
