"use client";

import { useState, memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiUser, BiStar, BiBookmark } from "react-icons/bi";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { BiShare } from "react-icons/bi";
import { colors, typography } from "@/design-system";
import { useAuthUnified } from "@/hooks";
import Button from "@/components/Button";
import { useSavedRecipesTransition, useToast } from "@/hooks";
import ImagePlaceholder from "./ImagePlaceholder";
import OptimizedImage from "./OptimizedImage";
import { ErrorBoundaryAdvanced } from "./ErrorBoundaryAdvanced";

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

function RecipeCard({
  recipe,
  variant = "save",
  onEdit,
  onDelete,
  onShare,
  onRemoveFromList,
  isRemoving = false,
}: RecipeCardProps) {
  const router = useRouter();
  const { user } = useAuthUnified();
  const { savedRecipes, saveRecipe, removeRecipe } =
    useSavedRecipesTransition();
  const { showSuccess, showError } = useToast();
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

  console.log("🔍 RecipeCard DEBUG:", {
    recipeId,
    variant,
    isSaved,
    recipeTitle: recipe.title,
    userId: user?.id,
  });

  // Memoizar el handler de click de la tarjeta
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

  // Memoizar el handler de save
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
              onRemoveFromList(recipeId); // Esta función ya maneja la redirección
            } else {
              // Si se guardó desde otro lugar (no Generated Recipes), redirigir normalmente
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

  // Memoizar el handler de delete
  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(recipe.id || "");
    },
    [onDelete, recipe.id]
  );

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
              <OptimizedImage
                src={recipe.image}
                alt={recipe.title}
                width={400}
                height={192}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={() => setImageError(true)}
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            <Button
              variant={isSaved ? "secondary" : "primary"}
              onClick={() => handleSaveClick({} as React.MouseEvent)}
              disabled={isSaving || isRemoving}
              className="px-6 py-3 flex items-center gap-2"
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
            </Button>
          ) : (
            // Edit, Delete, Share Buttons for My Recipes (Icon only)
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e?.stopPropagation();
                  onEdit?.(recipe);
                }}
                className="p-3 flex items-center justify-center"
              >
                <FaPencil className="text-lg" data-testid="fa-pencil" />
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => e && handleDeleteClick(e)}
                className="p-3 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500"
              >
                <MdDelete className="text-lg" data-testid="md-delete" />
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e?.stopPropagation();
                  onShare?.(recipe);
                }}
                className="p-3 flex items-center justify-center"
              >
                <BiShare className="text-lg" data-testid="bi-share" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundaryAdvanced>
  );
}

// Exportar el componente memoizado para evitar re-renders innecesarios
export default memo(RecipeCard);
