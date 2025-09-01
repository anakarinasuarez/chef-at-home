"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import Nav from "@/components/Nav";
import { colors, typography } from "@/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedRecipes } from "@/hooks";
import RecipeCard from "@/components/RecipeCard";

export default function MyRecipesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { savedRecipes, loading, removeRecipe } = useSavedRecipes();
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Mostrar spinner de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div
        className="min-h-screen text-white flex items-center justify-center"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Si no está logueado, redirigir al login
  if (!user) {
    router.push("/auth/login");
    return null;
  }

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

  if (loading) {
    return (
      <div
        className="min-h-screen text-white"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user.name} currentPage="my-recipes" />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
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
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={user.name} currentPage="my-recipes" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBackToHome}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: colors.interface.background.secondary,
              color: colors.interface.text.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.interface.state.hover;
              e.currentTarget.style.color = colors.interface.text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.interface.background.secondary;
              e.currentTarget.style.color = colors.interface.text.secondary;
            }}
          >
            <IoIosArrowBack className="text-2xl" />
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
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: colors.brand.primary[500],
                color: colors.base.white,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[500];
              }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Scroll Container */}
            <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-6 scrollbar-hide h-[460px]">
              {savedRecipes.map((recipe) => (
                <div key={recipe.id} className="flex-shrink-0 w-80">
                  <RecipeCard
                    recipe={recipe}
                    variant="my-recipes"
                    onEdit={(recipe) => {
                      const recipeId = recipe.id || Date.now().toString();
                      router.push(`/recipes/${recipeId}`);
                    }}
                    onDelete={(recipeId) => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this recipe?"
                        )
                      ) {
                        const success = removeRecipe(recipeId);
                        if (success) {
                          // La notificación se maneja en el hook
                        }
                      }
                    }}
                    onShare={(recipe) => {
                      if (navigator.share) {
                        navigator.share({
                          title: recipe.title,
                          text: `Check out this recipe: ${recipe.title}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Recipe link copied to clipboard!");
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Scroll Indicator - Clickable Navigation */}
            <div className="flex justify-center mt-4">
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
      </div>
    </div>
  );
}
