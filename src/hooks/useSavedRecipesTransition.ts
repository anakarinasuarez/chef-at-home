"use client";

import { useCallback } from "react";
import { useSavedRecipesStore } from "@/stores/savedRecipesStore";
import { useAuthUnified } from "@/hooks/useAuthUnified";

// Interface para recetas guardadas (compatible con el sistema actual)
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

interface UseSavedRecipesTransitionReturn {
  savedRecipes: FrontendRecipe[];
  loading: boolean;
  error: string | null;
  removingRecipeId: string | null;
  saveRecipe: (recipe: FrontendRecipe) => boolean;
  removeRecipe: (recipeId: string) => boolean;
  updateRecipe: (recipeId: string, updatedRecipe: FrontendRecipe) => boolean;
  loadSavedRecipes: () => void;
  clearError: () => void;
  setRemovingRecipeId: (id: string | null) => void;
}

/**
 * Hook de transición que proporciona la misma interfaz que useSavedRecipes
 * pero usando el nuevo savedRecipesStore de Zustand.
 *
 * Esto permite migración gradual sin romper la funcionalidad existente.
 */
export const useSavedRecipesTransition =
  (): UseSavedRecipesTransitionReturn => {
    const { user } = useAuthUnified();

    // Obtener estado del store de Zustand
    const savedRecipes = useSavedRecipesStore((state) => state.savedRecipes);
    const isLoading = useSavedRecipesStore((state) => state.isLoading);
    const error = useSavedRecipesStore((state) => state.error);
    const removingRecipeId = useSavedRecipesStore(
      (state) => state.removingRecipeId
    );

    // Obtener acciones individuales del store de Zustand para evitar recreación de objetos
    const loadSavedRecipesAction = useSavedRecipesStore(
      (state) => state.loadSavedRecipes
    );
    const saveRecipeAction = useSavedRecipesStore((state) => state.saveRecipe);
    const removeRecipeAction = useSavedRecipesStore(
      (state) => state.removeRecipe
    );
    const setErrorAction = useSavedRecipesStore((state) => state.setError);
    const clearErrorAction = useSavedRecipesStore((state) => state.clearError);
    const setRemovingRecipeIdAction = useSavedRecipesStore(
      (state) => state.setRemovingRecipeId
    );

    // Wrapper para loadSavedRecipes que maneja el userId automáticamente
    const loadSavedRecipes = useCallback(() => {
      if (user?.id) {
        loadSavedRecipesAction(user.id);
      }
    }, [user?.id, loadSavedRecipesAction]);

    // Wrapper para saveRecipe que maneja el userId automáticamente
    const saveRecipe = useCallback(
      (recipe: FrontendRecipe): boolean => {
        if (!user?.id) {
          setErrorAction("Usuario no autenticado");
          return false;
        }
        return saveRecipeAction(recipe, user.id);
      },
      [user?.id, saveRecipeAction, setErrorAction]
    );

    // Wrapper para removeRecipe que maneja el userId automáticamente
    const removeRecipe = useCallback(
      (recipeId: string): boolean => {
        if (!user?.id) {
          setErrorAction("Usuario no autenticado");
          return false;
        }
        return removeRecipeAction(recipeId, user.id);
      },
      [user?.id, removeRecipeAction, setErrorAction]
    );

    // Wrapper para updateRecipe que maneja el userId automáticamente
    const updateRecipe = useCallback(
      (recipeId: string, updatedRecipe: FrontendRecipe): boolean => {
        if (!user?.id) {
          setErrorAction("Usuario no autenticado");
          return false;
        }
        
        // Primero remover la receta existente
        const removeSuccess = removeRecipeAction(recipeId, user.id);
        if (!removeSuccess) {
          setErrorAction("Error al remover receta existente");
          return false;
        }
        
        // Luego agregar la receta actualizada
        const addSuccess = saveRecipeAction(updatedRecipe, user.id);
        if (!addSuccess) {
          setErrorAction("Error al guardar receta actualizada");
          return false;
        }
        
        return true;
      },
      [user?.id, removeRecipeAction, saveRecipeAction, setErrorAction]
    );

    return {
      savedRecipes,
      loading: isLoading,
      error,
      removingRecipeId,
      saveRecipe,
      removeRecipe,
      updateRecipe,
      loadSavedRecipes,
      clearError: clearErrorAction,
      setRemovingRecipeId: setRemovingRecipeIdAction,
    };
  };

export default useSavedRecipesTransition;
