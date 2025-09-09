"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Nav from "@/components/Nav";
import RecipeCard from "@/components/RecipeCard";
import { FiArrowLeft } from "react-icons/fi";
import { colors } from "@/design-system";
import { UniversalCacheManager } from "@/lib/universal-cache";

interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookingTime: string;
  difficulty: string;
  image?: string;
  source: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}

export default function RecipesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Generate recipes with AI when component mounts
  useEffect(() => {
    const generateRecipes = async () => {
      // Initialize cache manager
      await UniversalCacheManager.initialize();

      setLoading(true);
      setError(null);

      try {
        // Get ingredients from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const ingredientsParam = urlParams.get("ingredients");
        const servingsParam = urlParams.get("servings");

        let ingredients = ["pasta", "basil", "olive oil", "garlic", "tomatoes"]; // fallback
        let servings = 4; // fallback

        // Check if we have cached recipes using UniversalCacheManager
        try {
          console.log(
            "🔍 Checking cache for ingredients:",
            ingredients,
            "servings:",
            servings
          );
          const cachedRecipes = await UniversalCacheManager.getCachedRecipes(
            ingredients,
            servings
          );

          if (cachedRecipes && cachedRecipes.length > 0) {
            console.log(
              "📦 Using cached recipes from UniversalCacheManager:",
              cachedRecipes.length,
              "recipes"
            );
            setRecipes(cachedRecipes);
            setLoading(false);
            return;
          } else {
            console.log("❌ No cached recipes found for these ingredients");
          }
        } catch (error) {
          console.log("❌ Error checking cache:", error);
        }

        if (ingredientsParam) {
          try {
            ingredients = JSON.parse(decodeURIComponent(ingredientsParam));
            console.log("📝 Using ingredients from URL:", ingredients);
          } catch (e) {
            console.log("Could not parse ingredients from URL");
          }
        } else {
          console.log("📝 No ingredients in URL, using fallback:", ingredients);
        }

        if (servingsParam) {
          servings = parseInt(servingsParam) || 4;
          console.log("📝 Using servings from URL:", servings);
        } else {
          console.log("📝 No servings in URL, using fallback:", servings);
        }

        console.log(
          "🎯 Final ingredients for generation:",
          ingredients,
          "servings:",
          servings
        );

        // Generate recipes using our new API route
        const response = await fetch("/api/recipes/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients: ingredients,
            servings: servings,
            cuisine: "international",
            difficulty: "medium",
            count: 4,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to generate recipes: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Recipes generated successfully:", data);

        // Convert API response to Recipe format
        const aiRecipes = data.recipes.map((aiRecipe: any, index: number) => ({
          id:
            Date.now().toString() +
            Math.random().toString(36).substr(2, 9) +
            index,
          title: aiRecipe.title || `Recipe ${index + 1}`,
          servings: aiRecipe.servings || servings,
          cookingTime: aiRecipe.cookingTime || "30 minutes",
          difficulty: aiRecipe.difficulty || "Medium",
          image: aiRecipe.image || null,
          source: aiRecipe.source || "gemini",
          ingredients: aiRecipe.ingredients || [],
          instructions: aiRecipe.instructions || [],
        }));

        console.log("Processed recipes:", aiRecipes);
        setRecipes(aiRecipes);

        // Cache the recipes using UniversalCacheManager
        try {
          console.log(
            "💾 Caching recipes with ingredients:",
            ingredients,
            "servings:",
            servings
          );
          await UniversalCacheManager.cacheRecipes(
            ingredients,
            servings,
            aiRecipes
          );
          console.log(
            "✅ Recipes cached successfully using UniversalCacheManager"
          );
        } catch (error) {
          console.error("❌ Error caching recipes:", error);
        }
      } catch (error) {
        console.error("Error generating recipes:", error);
        setError("Failed to generate recipes. Please try again.");

        // Fallback recipes if API fails
        const fallbackRecipes = [
          {
            id: "fallback-1",
            title: "Simple Pasta with Herbs",
            servings: 4,
            cookingTime: "20 minutes",
            difficulty: "Easy",
            image:
              "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            source: "fallback",
            ingredients: [
              { name: "Pasta", quantity: 400, unit: "g" },
              { name: "Olive Oil", quantity: 3, unit: "tbsp" },
              { name: "Garlic", quantity: 3, unit: "cloves" },
              { name: "Fresh Herbs", quantity: 1, unit: "cup" },
            ],
            instructions: [
              "Cook pasta according to package instructions",
              "Heat olive oil and sauté garlic",
              "Add herbs and toss with pasta",
              "Serve immediately",
            ],
          },
        ];
        setRecipes(fallbackRecipes);
      } finally {
        setLoading(false);
      }
    };

    generateRecipes();
  }, []);

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

  const handleBackToHome = () => {
    router.push("/");
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

  // Detectar scroll automáticamente para actualizar el punto activo
  useEffect(() => {
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
  }, [recipes.length]);

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div
        className="h-screen overflow-hidden text-white"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user.name} currentPage="generated" />
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Generating your recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={user.name} currentPage="generated" />

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
            <FiArrowLeft className="text-xl" />
          </button>
          <div className="flex-1">
            <h1
              className="text-3xl font-bold"
              style={{ color: colors.interface.text.primary }}
            >
              Generated Recipes
            </h1>
            <p
              className="mt-1"
              style={{ color: colors.interface.text.secondary }}
            >
              {recipes.length} recipes generated for you
            </p>
          </div>
        </div>

        {/* Recipes Horizontal Scroll */}
        {recipes.length > 0 && (
          <div className="relative flex-1 flex flex-col">
            {/* Scroll Container */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide items-center flex-1 pt-3 pb-1.5">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="flex-shrink-0 w-80">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>

            {/* Scroll Indicator - Clickable Navigation */}
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
        {recipes.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: colors.interface.text.primary }}
            >
              {error ? "Error generating recipes" : "No recipes found"}
            </h2>
            <p
              className="mb-6"
              style={{ color: colors.interface.text.secondary }}
            >
              {error ||
                "We couldn't generate recipes at the moment. Please try again."}
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
        )}
      </div>
    </div>
  );
}
