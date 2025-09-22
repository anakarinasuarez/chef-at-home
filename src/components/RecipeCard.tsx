"use client";

import { memo } from "react";
import { colors } from "@/design-system";
import { ErrorBoundaryAdvanced } from "./ErrorBoundaryAdvanced";
import { useRecipeCard } from "@/hooks/useRecipeCard";
import { RecipeInfo } from "./recipe/RecipeInfo";
import { RecipeImage } from "./recipe/RecipeImage";
import { RecipeActions } from "./recipe/RecipeActions";

interface RecipeCardProps {
  recipe: {
    id?: string;
    title: string;
    servings: number;
    cookingTime: string;
    image?: string;
    source: string;
    difficulty?: string;
  };
  variant?: "save" | "my-recipes";
  onEdit?: (recipe: any) => void;
  onDelete?: (recipeId: string) => void;
  onShare?: (recipe: any) => void;
  onRemoveFromList?: (recipeId: string) => void;
  isRemoving?: boolean;
}

/**
 * Componente RecipeCard refactorizado siguiendo el principio SRP
 * Ahora solo se encarga de la composición y el layout
 * La lógica de negocio está en el hook useRecipeCard
 * Los sub-componentes manejan responsabilidades específicas
 */
function RecipeCard({
  recipe,
  variant = "save",
  onEdit,
  onDelete,
  onShare,
  onRemoveFromList,
  isRemoving = false,
}: RecipeCardProps) {
  // Usar el hook personalizado para toda la lógica de negocio
  const {
    isSaving,
    imageError,
    recipeId,
    isSaved,
    handleCardClick,
    handleSaveClick,
    handleImageError,
  } = useRecipeCard({
    recipe,
    variant,
    onRemoveFromList,
  });

  console.log("🔍 RecipeCard DEBUG:", {
    recipeId,
    variant,
    isSaved,
    recipeTitle: recipe.title,
  });

  return (
    <ErrorBoundaryAdvanced
      level="component"
      errorBoundaryName="RecipeCard"
      allowRetry={true}
      showDetails={process.env.NODE_ENV === "development"}
    >
      <div
        onClick={handleCardClick}
        className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
        style={{
          backgroundColor: colors.interface.background.secondary,
          boxShadow: `0 10px 25px ${colors.app.recipeCard.shadow}`,
        }}
      >
        {/* Recipe Info - Above image */}
        <RecipeInfo recipe={recipe} />

        {/* Recipe Image - Below info with padding */}
        <RecipeImage
          recipe={recipe}
          imageError={imageError}
          onImageError={handleImageError}
        />

        {/* Action Buttons - Bottom right */}
        <RecipeActions
          variant={variant}
          recipe={recipe}
          isSaved={isSaved}
          isSaving={isSaving}
          isRemoving={isRemoving}
          onSaveClick={handleSaveClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
        />
      </div>
    </ErrorBoundaryAdvanced>
  );
}

// Exportar el componente memoizado para evitar re-renders innecesarios
export default memo(RecipeCard);
