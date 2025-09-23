import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthUnified } from "@/hooks";
import { useSavedRecipesTransition, useToastTransition } from "@/hooks";
import { RecipeCardData } from "@/types";

interface UseRecipeCardProps {
  recipe: RecipeCardData;
  variant?: "save" | "my-recipes";
  onRemoveFromList?: (recipeId: string) => void;
}

interface UseRecipeCardReturn {
  // Estado
  isSaving: boolean;
  imageError: boolean;
  recipeId: string;
  isSaved: boolean;

  // Acciones
  handleCardClick: () => void;
  handleSaveClick: (e: React.MouseEvent) => void;
  handleImageError: () => void;
}

/**
 * Hook personalizado que maneja toda la lógica de negocio del RecipeCard
 * Separando la lógica de la presentación (SRP)
 */
export const useRecipeCard = ({
  recipe,
  variant = "save",
  onRemoveFromList,
}: UseRecipeCardProps): UseRecipeCardReturn => {
  const router = useRouter();
  const { user } = useAuthUnified();
  const { savedRecipes, saveRecipe, removeRecipe } =
    useSavedRecipesTransition();
  const { showSuccess, showError } = useToastTransition();

  // Estado local
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoizar el ID de la receta para evitar recálculos
  const recipeId = useMemo(
    () => recipe.id || Date.now().toString(),
    [recipe.id]
  );

  // Memoizar la verificación de si la receta está guardada
  const isSaved = useMemo(() => {
    if (!user) return false;
    return savedRecipes.some((r) => r.id === recipeId);
  }, [user, recipeId, savedRecipes]);

  // Handler para click en la tarjeta (navegación)
  const handleCardClick = useCallback(() => {
    // Guardar los datos de la receta en localStorage para la página de detalle
    localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(recipe));

    // Si es variant "my-recipes", pasar el parámetro from=my-recipes
    if (variant === "my-recipes") {
      router.push(`/recipes/${recipeId}?from=my-recipes`);
    } else {
      router.push(`/recipes/${recipeId}`);
    }
  }, [recipeId, recipe, variant, router]);

  // Handler para guardar/eliminar receta
  const handleSaveClick = useCallback(
    (e: React.MouseEvent) => {
      e?.stopPropagation?.(); // Evitar que se active el click de la tarjeta

      if (!user) {
        router.push("/auth/login");
        return;
      }

      console.log("💾 Save clicked for recipe:", recipeId);
      console.log("💾 Variant:", variant);
      console.log("💾 onRemoveFromList function:", !!onRemoveFromList);

      setIsSaving(true);

      try {
        let success = false;

        if (isSaved) {
          // Si ya está guardada, la removemos
          success = removeRecipe(recipeId);
          if (success) {
            showSuccess("Recipe removed from favorites");
          }
        } else {
          // Si no está guardada, la guardamos
          success = saveRecipe({
            ...recipe,
            difficulty: recipe.difficulty || "medium",
          });

          if (success) {
            showSuccess("Recipe saved to favorites");

            // Si se guardó la receta desde Generated Recipes, eliminar de la lista
            if (variant === "save" && onRemoveFromList) {
              console.log("🗑️ Removing recipe from list:", recipeId);
              onRemoveFromList(recipeId);
            } else {
              // Si se guardó desde otro lugar, redirigir normalmente
              setTimeout(() => {
                router.push("/my-recipes");
              }, 1000);
            }
          }
        }

        if (!success) {
          showError("Error saving recipe");
        }
      } catch (error) {
        console.error("Error saving recipe:", error);
        showError("Error saving recipe");
      } finally {
        setIsSaving(false);
      }
    },
    [
      user,
      router,
      recipeId,
      variant,
      onRemoveFromList,
      recipe,
      saveRecipe,
      removeRecipe,
      isSaved,
      showSuccess,
      showError,
    ]
  );

  // Handler para errores de imagen
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return {
    // Estado
    isSaving,
    imageError,
    recipeId,
    isSaved,

    // Acciones
    handleCardClick,
    handleSaveClick,
    handleImageError,
  };
};
