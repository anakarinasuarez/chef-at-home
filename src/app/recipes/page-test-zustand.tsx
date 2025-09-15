"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthZustand } from "@/hooks";
import Nav from "@/components/Nav";
import { colors } from "@/design-system";
import { useRecipesGenerationZustand } from "@/hooks/useRecipesGenerationZustand";
import { useRecipesNavigationZustand } from "@/hooks/useRecipesNavigationZustand";
import { useRemovingRecipeId, useAppActions } from "@/stores/appStore";
import RecipesPageHeader from "@/components/pages/RecipesPageHeader";
import RecipesScrollContainer from "@/components/pages/RecipesScrollContainer";
import RecipesScrollIndicator from "@/components/pages/RecipesScrollIndicator";
import RecipesEmptyState from "@/components/pages/RecipesEmptyState";
import RecipesLoadingState from "@/components/pages/RecipesLoadingState";
import RecipeCardZustand from "@/components/RecipeCard-zustand";

interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookingTime: string;
  image?: string;
  source: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}

export default function RecipesPageTestZustand() {
  const { user } = useAuthZustand();
  const router = useRouter();
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const removingRecipeId = useRemovingRecipeId();
  const { setRemovingRecipeId } = useAppActions();

  const {
    recipes,
    loading,
    error,
    hasLoadedRecipes,
    generateRecipes,
    clearCache,
  } = useRecipesGenerationZustand();

  const { activeIndex, scrollToRecipe } = useRecipesNavigationZustand(
    recipes.length
  );

  // Debug: Log recipes state changes
  useEffect(() => {
    console.log(
      "🔧 DEBUG Zustand: Recipes state changed:",
      recipes.length,
      "recipes"
    );
    if (recipes.length > 0) {
      console.log("🔧 DEBUG Zustand: First recipe:", recipes[0]);
    }
  }, [recipes]);

  const handleSaveRecipe = (recipeId: string) => {
    setSavedRecipes((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(recipeId)) {
        newSaved.delete(recipeId);
      } else {
        newSaved.add(recipeId);
      }
      return newSaved;
    });
  };

  const handleRemoveFromList = (recipeId: string) => {
    console.log(
      "🗑️ Zustand: handleRemoveFromList called with recipeId:",
      recipeId
    );
    console.log("🗑️ Zustand: Current recipes count:", recipes.length);

    // Marcar la receta como removiendo para animación
    setRemovingRecipeId(recipeId);

    // Esperar un poco para que se vea la animación, luego eliminar
    setTimeout(() => {
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
      console.log("🗑️ Zustand: Updated recipes count:", updatedRecipes.length);

      // Actualizar sessionStorage con las recetas restantes
      sessionStorage.setItem("currentRecipes", JSON.stringify(updatedRecipes));

      // NO redirigir automáticamente - mantener al usuario en Generated Recipes
      console.log(
        "✅ Zustand: Recipe removed from Generated Recipes, staying on current page"
      );
    }, 600); // Tiempo para la animación de desvanecimiento
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  // Loading state
  if (loading) {
    return <RecipesLoadingState userName={user.name} />;
  }

  return (
    <div
      className="h-screen overflow-hidden"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={user.name} currentPage="generated" />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20 h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <RecipesPageHeader
          recipesCount={recipes.length}
          onBackToHome={handleBackToHome}
        />

        {/* Recipes Horizontal Scroll */}
        {recipes.length > 0 && (
          <div className="relative flex-1 flex flex-col">
            {/* Scroll Container - Usando RecipeCardZustand */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide items-center flex-1 pt-3 pb-1.5">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className={`flex-shrink-0 w-80 transition-all duration-600 ease-in-out ${
                    removingRecipeId === recipe.id
                      ? "opacity-0 scale-95 transform translate-x-4"
                      : "opacity-100 scale-100 transform translate-x-0"
                  }`}
                >
                  <RecipeCardZustand
                    recipe={recipe}
                    variant="save"
                    onRemoveFromList={handleRemoveFromList}
                    isRemoving={removingRecipeId === recipe.id}
                  />
                </div>
              ))}
            </div>

            {/* Scroll Indicator - Clickable Navigation */}
            <RecipesScrollIndicator
              recipesCount={recipes.length}
              activeIndex={activeIndex}
              onScrollToRecipe={scrollToRecipe}
            />
          </div>
        )}

        {/* Empty State */}
        {recipes.length === 0 && !loading && (
          <RecipesEmptyState error={error} onBackToHome={handleBackToHome} />
        )}
      </div>
    </div>
  );
}
