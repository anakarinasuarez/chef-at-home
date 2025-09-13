import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState<FrontendRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar recetas guardadas
  const loadSavedRecipes = () => {
    if (!user) {
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem(`savedRecipes_${user.id}`);
      if (saved) {
        setSavedRecipes(JSON.parse(saved));
      } else {
        setSavedRecipes([]);
      }
    } catch (error) {
      console.error("Error loading saved recipes:", error);
      setSavedRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Guardar una receta
  const saveRecipe = (recipe: FrontendRecipe): boolean => {
    if (!user) return false;

    try {
      const recipeToSave = {
        ...recipe,
        id: recipe.id || Date.now().toString(),
        savedAt: new Date().toISOString(),
      };

      const updatedRecipes = [...savedRecipes, recipeToSave];
      setSavedRecipes(updatedRecipes);
      localStorage.setItem(
        `savedRecipes_${user.id}`,
        JSON.stringify(updatedRecipes)
      );

      // También guardar en localStorage para que la página de detalle pueda acceder
      // Solo si no existe ya una entrada con este ID
      const existingKey = `recipe-${recipeToSave.id}`;
      if (!localStorage.getItem(existingKey)) {
        localStorage.setItem(existingKey, JSON.stringify(recipeToSave));
      }

      return true;
    } catch (error) {
      console.error("Error saving recipe:", error);
      return false;
    }
  };

  // Remover una receta guardada
  const removeRecipe = (recipeId: string): boolean => {
    if (!user) return false;

    try {
      const updatedRecipes = savedRecipes.filter(
        (recipe) => recipe.id !== recipeId
      );
      setSavedRecipes(updatedRecipes);
      localStorage.setItem(
        `savedRecipes_${user.id}`,
        JSON.stringify(updatedRecipes)
      );
      return true;
    } catch (error) {
      console.error("Error removing recipe:", error);
      return false;
    }
  };

  // Verificar si una receta está guardada
  const isRecipeSaved = (recipeId: string): boolean => {
    return savedRecipes.some((recipe) => recipe.id === recipeId);
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
  }, [user]);

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
