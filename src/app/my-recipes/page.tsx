"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import Nav from "@/components/Nav";
import { colors, typography } from "@/design-system";
import { useAuthUnified } from "@/hooks";
import { useSavedRecipesTransition, useToast } from "@/hooks";

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
import { SuspenseWrapper } from "@/components/lazy/SuspenseWrapper";
import {
  LazyRecipeCard,
  LazyDeleteConfirmationModal,
} from "@/components/lazy/LazyComponents";

export default function MyRecipesPage() {
  const { user, isLoading } = useAuthUnified();
  const router = useRouter();
  const { savedRecipes, loading, removeRecipe } = useSavedRecipesTransition();
  const { showSuccess } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<FrontendRecipe | null>(
    null
  );

  // Detectar scroll automáticamente para actualizar el punto activo
  useEffect(() => {
    if (savedRecipes.length === 0) return;

    const container = document.querySelector(".overflow-x-auto") as HTMLElement;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;

      // Encontrar qué receta está más visible
      let mostVisibleIndex = 0;
      let maxVisibility = 0;

      Array.from(container.children).forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const childLeft = childRect.left;
        const childRight = childRect.right;

        // Calcular qué tan visible está la receta
        const visibleLeft = Math.max(containerLeft, childLeft);
        const visibleRight = Math.min(
          containerLeft + container.offsetWidth,
          childRight
        );
        const visibility = Math.max(0, visibleRight - visibleLeft);

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = index;
        }
      });

      setActiveIndex(mostVisibleIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [savedRecipes.length]);

  // Si no está logueado, redirigir al login
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleDeleteClick = (recipe: FrontendRecipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete && recipeToDelete.id) {
      const success = removeRecipe(recipeToDelete.id);
      if (success) {
        showSuccess("Recipe deleted successfully!");
      }
    }
    setShowDeleteModal(false);
    setRecipeToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRecipeToDelete(null);
  };

  const scrollToRecipe = (index: number) => {
    const container = document.querySelector(".overflow-x-auto") as HTMLElement;
    if (container) {
      const recipeCard = container.children[index] as HTMLElement;
      if (recipeCard) {
        recipeCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
        setActiveIndex(index);
      }
    }
  };

  if (loading) {
    return (
      <div
        className="h-screen overflow-hidden text-white"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user.name} currentPage="my-recipes" />
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading your recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={user.name} currentPage="my-recipes" />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20 h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={handleBackToHome}
            className="w-12 h-12 rounded-2xl transition-colors border-2 flex items-center justify-center"
            style={{
              backgroundColor: colors.interface.background.secondary,
              color: colors.base.white,
              borderColor: colors.interface.background.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.interface.background.tertiary;
              e.currentTarget.style.borderColor =
                colors.interface.background.tertiary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.interface.background.secondary;
              e.currentTarget.style.borderColor =
                colors.interface.background.secondary;
            }}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: colors.interface.text.primary }}
            >
              My Saved Recipes
            </h1>
            <p
              className="mt-1"
              style={{ color: colors.interface.text.secondary }}
            >
              {savedRecipes.length} recipes saved by you
            </p>
          </div>
        </div>

        {/* Contenido */}
        {savedRecipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: colors.interface.text.primary }}
            >
              No saved recipes yet
            </h2>
            <p
              className="mb-6"
              style={{ color: colors.interface.text.secondary }}
            >
              Start creating recipes and save your favorites to see them here
            </p>
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 rounded-lg transition-colors border"
              style={{
                backgroundColor: "transparent",
                color: colors.brand.primary[500],
                borderColor: colors.brand.primary[500],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[500];
                e.currentTarget.style.color = colors.base.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.brand.primary[500];
              }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="relative flex-1 flex flex-col">
            {/* Scroll Container */}
            <div className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide flex-1 items-center pt-3 pb-1.5">
              {savedRecipes.map((recipe) => (
                <div key={recipe.id} className="flex-shrink-0 w-80">
                  <SuspenseWrapper minHeight="400px">
                    <LazyRecipeCard
                      recipe={recipe}
                      variant="my-recipes"
                      onEdit={(recipe) => {
                        // Guardar los datos de la receta en localStorage para editarlos
                        const editData = {
                          title: recipe.title,
                          ingredients: recipe.ingredients || [],
                          servings: recipe.servings,
                          cookingTime: recipe.cookingTime,
                          difficulty: recipe.difficulty || "medium",
                          cuisine: "international",
                          instructions: recipe.instructions || [],
                          isEditing: true,
                          originalId: recipe.id,
                        };

                        localStorage.setItem(
                          "editRecipeData",
                          JSON.stringify(editData)
                        );
                        router.push("/create?edit=true");
                      }}
                      onDelete={(recipeId) => {
                        const recipe = savedRecipes.find(
                          (r) => r.id === recipeId
                        );
                        if (recipe) {
                          handleDeleteClick(recipe);
                        }
                      }}
                      onShare={(recipe) => {
                        if (navigator.share) {
                          navigator.share({
                            title: recipe.title,
                            text: `Check out this recipe: ${recipe.title}`,
                            url:
                              typeof window !== "undefined"
                                ? window.location.href
                                : "",
                          });
                        } else {
                          navigator.clipboard.writeText(
                            typeof window !== "undefined"
                              ? window.location.href
                              : ""
                          );
                          showSuccess("Recipe link copied to clipboard!");
                        }
                      }}
                    />
                  </SuspenseWrapper>
                </div>
              ))}
            </div>

            {/* Scroll Indicator - Clickable Navigation */}
            <div className="flex justify-center mt-2">
              <div className="flex gap-2">
                {savedRecipes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToRecipe(index)}
                    className="w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor:
                        index === activeIndex
                          ? colors.brand.primary[500]
                          : colors.interface.background.tertiary,
                      opacity: index === activeIndex ? 1 : 0.5,
                    }}
                    title={`Go to recipe ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <SuspenseWrapper minHeight="200px">
          <LazyDeleteConfirmationModal
            isOpen={showDeleteModal}
            title={recipeToDelete?.title || ""}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </SuspenseWrapper>
      </div>
    </div>
  );
}
