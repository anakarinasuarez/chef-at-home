import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAppActions } from "@/stores/appStore";
import { useNotification } from "@/contexts/NotificationContext";

interface UseRecipeCardActionsProps {
  recipe: any;
  variant: "save" | "my-recipes";
  onRemoveFromList?: (recipeId: string) => void;
}

export const useRecipeCardActionsZustand = ({
  recipe,
  variant,
  onRemoveFromList,
}: UseRecipeCardActionsProps) => {
  const router = useRouter();
  const user = useUser();
  const { isRecipeSaved, saveRecipe, unsaveRecipe } = useAppActions();
  const { showNotification } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const recipeId = recipe.id || Date.now().toString();

  // Verificar directamente si la receta está guardada usando Zustand
  const isSaved = isRecipeSaved(recipeId);

  const handleCardClick = useCallback(() => {
    // Guardar los datos de la receta en localStorage para la página de detalle
    localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(recipe));

    // Si es variant "my-recipes", pasar el parámetro from=my-recipes
    if (variant === "my-recipes") {
      router.push(`/recipes/${recipeId}?from=my-recipes`);
    } else {
      router.push(`/recipes/${recipeId}`);
    }
  }, [recipe, recipeId, variant, router]);

  const handleSaveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Evitar que se active el click de la tarjeta

      if (!user) {
        router.push("/auth/login");
        return;
      }

      console.log("💾 Save clicked for recipe:", recipeId);
      console.log("💾 Variant:", variant);
      console.log("💾 onRemoveFromList function:", !!onRemoveFromList);

      setIsSaving(true);

      try {
        if (isSaved) {
          unsaveRecipe(recipeId);
          showNotification("Recipe removed from favorites", "info");
        } else {
          saveRecipe(recipeId);
          showNotification("Recipe saved to favorites", "success");

          // Si se guardó la receta desde Generated Recipes, eliminar de la lista
          if (variant === "save" && onRemoveFromList) {
            console.log("🗑️ Removing recipe from list:", recipeId);
            onRemoveFromList(recipeId); // Esta función ya maneja la redirección
          } else {
            // Si se guardó desde otro lugar (no Generated Recipes), redirigir normalmente
            setTimeout(() => {
              router.push("/my-recipes");
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error saving recipe:", error);
        showNotification("Error saving recipe", "error");
      } finally {
        setIsSaving(false);
      }
    },
    [
      user,
      recipeId,
      variant,
      isSaved,
      saveRecipe,
      unsaveRecipe,
      showNotification,
      onRemoveFromList,
      router,
    ]
  );

  return {
    recipeId,
    isSaved,
    isSaving,
    handleCardClick,
    handleSaveClick,
  };
};
