import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedRecipes } from "@/hooks";
import { useNotification } from "@/contexts/NotificationContext";

interface UseRecipeCardActionsProps {
  recipe: any;
  variant: "save" | "my-recipes";
  onRemoveFromList?: (recipeId: string) => void;
}

export const useRecipeCardActions = ({
  recipe,
  variant,
  onRemoveFromList,
}: UseRecipeCardActionsProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { isRecipeSaved, toggleSaveRecipe } = useSavedRecipes();
  const { showNotification } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const recipeId = recipe.id || Date.now().toString();

  // Verificar directamente si la receta está guardada en lugar de usar el hook
  let isSaved = false;
  if (user) {
    const savedRecipesKey = `savedRecipes_${user.id}`;
    const savedRecipes = localStorage.getItem(savedRecipesKey);
    if (savedRecipes) {
      try {
        const parsedSavedRecipes = JSON.parse(savedRecipes);
        isSaved = parsedSavedRecipes.some((r: any) => r.id === recipeId);
      } catch (error) {
        console.error("Error parsing saved recipes:", error);
      }
    }
  }

  const handleCardClick = () => {
    // Guardar los datos de la receta en localStorage para la página de detalle
    localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(recipe));

    // Si es variant "my-recipes", pasar el parámetro from=my-recipes
    if (variant === "my-recipes") {
      router.push(`/recipes/${recipeId}?from=my-recipes`);
    } else {
      router.push(`/recipes/${recipeId}`);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
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
      const success = toggleSaveRecipe({
        ...recipe,
        difficulty: recipe.difficulty || "medium",
      });

      if (success) {
        // Mostrar notificación
        const message = isSaved
          ? "Recipe removed from favorites"
          : "Recipe saved to favorites";
        showNotification(message, isSaved ? "info" : "success");

        // Si se guardó la receta desde Generated Recipes, eliminar de la lista
        if (!isSaved && variant === "save" && onRemoveFromList) {
          console.log("🗑️ Removing recipe from list:", recipeId);
          onRemoveFromList(recipeId); // Esta función ya maneja la redirección
        } else if (!isSaved) {
          // Si se guardó desde otro lugar (no Generated Recipes), redirigir normalmente
          setTimeout(() => {
            router.push("/my-recipes");
          }, 1000);
        }
      } else {
        showNotification("Error saving recipe", "error");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      showNotification("Error saving recipe", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    recipeId,
    isSaved,
    isSaving,
    handleCardClick,
    handleSaveClick,
  };
};
