"use client";

import React from "react";
import { colors } from "@/design-system";
import { useRecipeCardActionsZustand } from "@/hooks/useRecipeCardActionsZustand";
import RecipeCardInfo from "@/components/recipe-card/RecipeCardInfo";
import RecipeCardImage from "@/components/recipe-card/RecipeCardImage";
import RecipeCardSaveButton from "@/components/recipe-card/RecipeCardSaveButton";
import RecipeCardActionButtons from "@/components/recipe-card/RecipeCardActionButtons";

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

export default function RecipeCardZustand({
  recipe,
  variant = "save",
  onEdit,
  onDelete,
  onShare,
  onRemoveFromList,
  isRemoving = false,
}: RecipeCardProps) {
  const { isSaved, isSaving, handleCardClick, handleSaveClick } =
    useRecipeCardActionsZustand({
      recipe,
      variant,
      onRemoveFromList,
    });

  console.log("🔍 RecipeCard Zustand DEBUG:", {
    recipeId: recipe.id || Date.now().toString(),
    variant,
    isSaved,
    recipeTitle: recipe.title,
  });

  return (
    <div
      onClick={handleCardClick}
      className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
      style={{
        backgroundColor: colors.interface.background.secondary,
        boxShadow: `0 10px 25px ${colors.app.recipeCard.shadow}`,
      }}
    >
      {/* Recipe Info - Above image */}
      <RecipeCardInfo
        title={recipe.title}
        servings={recipe.servings}
        cookingTime={recipe.cookingTime}
      />

      {/* Recipe Image - Below info with padding */}
      <RecipeCardImage
        image={recipe.image}
        title={recipe.title}
        source={recipe.source}
      />

      {/* Action Buttons - Bottom right */}
      <div className="p-6 flex justify-end">
        {variant === "save" ? (
          // Save Button for Generated Recipes
          <RecipeCardSaveButton
            isSaved={isSaved}
            isSaving={isSaving}
            isRemoving={isRemoving}
            onSaveClick={handleSaveClick}
          />
        ) : (
          // Edit, Delete, Share Buttons for My Recipes (Icon only)
          <RecipeCardActionButtons
            recipe={recipe}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
          />
        )}
      </div>
    </div>
  );
}
