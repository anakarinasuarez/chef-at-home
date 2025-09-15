"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiUser, BiStar, BiBookmark } from "react-icons/bi";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { BiShare } from "react-icons/bi";
import { colors, typography } from "@/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedRecipes, useToast } from "@/hooks";
import ImagePlaceholder from "./ImagePlaceholder";

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

export default function RecipeCard({
  recipe,
  variant = "save",
  onEdit,
  onDelete,
  onShare,
  onRemoveFromList,
  isRemoving = false,
}: RecipeCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isRecipeSaved, toggleSaveRecipe } = useSavedRecipes();
  const { showSuccess, showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  console.log("🔍 RecipeCard DEBUG:", {
    recipeId,
    variant,
    isSaved,
    recipeTitle: recipe.title,
    userId: user?.id,
  });

  const handleCardClick = () => {
    // Usar el mismo ID que se usa para verificar si está guardada

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
        if (isSaved) {
          showSuccess("Recipe removed from favorites");
        } else {
          showSuccess("Recipe saved to favorites");
        }

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
        showError("Error saving recipe");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      showError("Error saving recipe");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(recipe.id || "");
  };

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
      <div className="p-6">
        {/* Title */}
        <h3
          className="mb-4 line-clamp-2"
          style={{
            color: colors.interface.text.primary,
            fontSize: typography.styles["subtitle"].fontSize,
            fontWeight: typography.styles["subtitle"].fontWeight,
            lineHeight: typography.styles["subtitle"].lineHeight,
            letterSpacing: typography.styles["subtitle"].letterSpacing,
            minHeight: "3rem",
            maxHeight: "3rem",
          }}
          title={recipe.title}
        >
          {recipe.title}
        </h3>

        {/* Recipe metadata - Two lines below title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BiUser style={{ color: colors.brand.primary[500] }} />
            <span
              style={{
                color: colors.interface.text.secondary,
                fontSize: typography.styles["caption"].fontSize,
                fontWeight: typography.styles["caption"].fontWeight,
                lineHeight: typography.styles["caption"].lineHeight,
                letterSpacing: typography.styles["caption"].letterSpacing,
              }}
            >
              for {recipe.servings} people
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BiTime style={{ color: colors.brand.primary[500] }} />
            <span
              style={{
                color: colors.interface.text.secondary,
                fontSize: typography.styles["caption"].fontSize,
                fontWeight: typography.styles["caption"].fontWeight,
                lineHeight: typography.styles["caption"].lineHeight,
                letterSpacing: typography.styles["caption"].letterSpacing,
              }}
            >
              duration {recipe.cookingTime}
            </span>
          </div>
        </div>
      </div>

      {/* Recipe Image - Below info with padding */}
      <div className="px-6">
        <div className="relative h-48 overflow-hidden rounded-lg">
          {recipe.image && !imageError ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <ImagePlaceholder
              title={recipe.title}
              cuisine={
                recipe.source === "fallback-enhanced"
                  ? "Italian"
                  : "International"
              }
              className="h-48"
              ingredients={[]}
            />
          )}
        </div>
      </div>

      {/* Action Buttons - Bottom right */}
      <div className="p-6 flex justify-end">
        {variant === "save" ? (
          // Save Button for Generated Recipes
          <button
            onClick={handleSaveClick}
            disabled={isSaving || isRemoving}
            className="px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            style={{
              backgroundColor: isRemoving
                ? colors.brand.primary[600]
                : isSaved
                ? colors.interface.background.tertiary
                : colors.brand.primary[500],
              color: isRemoving
                ? colors.base.white
                : isSaved
                ? colors.brand.primary[500]
                : colors.base.white,
              fontSize: typography.styles["button"].fontSize,
              fontWeight: typography.styles["button"].fontWeight,
              lineHeight: typography.styles["button"].lineHeight,
              letterSpacing: typography.styles["button"].letterSpacing,
              border:
                isSaved && !isRemoving
                  ? `2px solid ${colors.brand.primary[500]}`
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (!isSaved && !isRemoving) {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[600];
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaved && !isRemoving) {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[500];
              }
            }}
          >
            {isRemoving ? (
              <span className="text-lg animate-pulse">✓</span>
            ) : isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : isSaved ? (
              <span className="text-lg">✓</span>
            ) : (
              <span className="text-lg">+</span>
            )}
            {isRemoving
              ? "Saved!"
              : isSaving
              ? "Saving..."
              : isSaved
              ? "Saved"
              : "Save"}
          </button>
        ) : (
          // Edit, Delete, Share Buttons for My Recipes (Icon only)
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(recipe);
              }}
              className="p-3 rounded-lg transition-colors border flex items-center justify-center"
              style={{
                backgroundColor: "transparent",
                color: colors.brand.primary[500],
                borderColor: colors.brand.primary[500],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[500];
                e.currentTarget.style.color =
                  colors.interface.background.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.brand.primary[500];
              }}
              title="Edit recipe"
            >
              <FaPencil
                className="text-lg"
                style={{ color: colors.brand.primary[500] }}
              />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-3 rounded-lg transition-colors border flex items-center justify-center"
              style={{
                backgroundColor: "transparent",
                color: colors.brand.primary[500],
                borderColor: colors.brand.primary[500],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#EF4444";
                e.currentTarget.style.color =
                  colors.interface.background.primary;
                e.currentTarget.style.borderColor = "#EF4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.brand.primary[500];
                e.currentTarget.style.borderColor = colors.brand.primary[500];
              }}
              title="Delete recipe"
            >
              <MdDelete
                className="text-lg"
                style={{ color: colors.brand.primary[500] }}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(recipe);
              }}
              className="p-3 rounded-lg transition-colors border flex items-center justify-center"
              style={{
                backgroundColor: "transparent",
                color: colors.brand.primary[500],
                borderColor: colors.brand.primary[500],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.interface.background.tertiary;
                e.currentTarget.style.color = colors.interface.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.brand.primary[500];
              }}
              title="Share recipe"
            >
              <BiShare
                className="text-lg"
                style={{ color: colors.brand.primary[500] }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
