"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Nav from "@/components/Nav";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FiArrowLeft } from "react-icons/fi";
import { colors } from "@/design-system";
import { useRecipes } from "@/hooks/useRecipes";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";

export default function RecipesPageImproved() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    recipes,
    loading,
    error,
    hasLoadedRecipes,
    removingRecipeId,
    activeIndex,
    removeRecipe,
    setActiveIndex,
    scrollToRecipe,
    clearError,
  } = useRecipes();

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleRemoveFromList = (recipeId: string) => {
    removeRecipe(recipeId);
  };

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav currentPage="generated" userName={user.name} />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleBackToHome}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: colors.interface.text.secondary }}
            >
              <FiArrowLeft size={24} />
            </button>
            <h1
              className="text-3xl font-bold"
              style={{ color: colors.interface.text.primary }}
            >
              Generated Recipes
            </h1>
          </div>

          {/* Content */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <ErrorMessage
              error={error}
              onRetry={clearError}
              onDismiss={handleBackToHome}
            />
          )}

          {!loading && !error && recipes.length > 0 && (
            <div className="space-y-8">
              {/* Recipe Cards */}
              <div className="grid gap-6">
                {recipes.map((recipe, index) => (
                  <div
                    key={recipe.id}
                    id={`recipe-${index}`}
                    className={`transition-all duration-500 ${
                      removingRecipeId === recipe.id
                        ? "opacity-0 scale-95 transform translate-x-full"
                        : "opacity-100 scale-100 transform translate-x-0"
                    }`}
                  >
                    <RecipeCard
                      recipe={recipe}
                      variant="save"
                      onRemoveFromList={handleRemoveFromList}
                      isRemoving={removingRecipeId === recipe.id}
                    />
                  </div>
                ))}
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center mt-2">
                <div className="flex gap-2">
                  {recipes.map((_, index) => (
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

          {/* Empty State */}
          {!loading && !error && recipes.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: colors.interface.text.primary }}
              >
                No recipes found
              </h2>
              <p
                className="mb-6"
                style={{ color: colors.interface.text.secondary }}
              >
                We couldn't generate recipes at the moment. Please try again.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleBackToHome}
                  className="px-8 py-3 rounded-lg transition-colors border"
                  style={{
                    backgroundColor: "transparent",
                    color: colors.brand.primary[500],
                    borderColor: colors.brand.primary[500],
                  }}
                >
                  Return home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
