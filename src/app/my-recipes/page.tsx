"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { colors, typography } from "@/design-system";
import Nav from "@/components/Nav";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedRecipes } from "@/hooks";
import { MdFavorite, MdDelete, MdVisibility } from "react-icons/md";

export default function MyRecipesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { savedRecipes, loading, removeRecipe } = useSavedRecipes();

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

  const handleViewRecipe = (recipe: any) => {
    // Navegar a la página de detalle de la receta
    router.push(`/recipes/${recipe.id}`);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    // Confirmar antes de eliminar
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      removeRecipe(recipeId);
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

      <main className="px-8 lg:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-4"
            style={{
              fontSize: typography.styles["title-1"].fontSize,
              fontWeight: typography.styles["title-1"].fontWeight,
              color: colors.interface.text.primary,
            }}
          >
            My Saved Recipes
          </h1>
          <p
            style={{
              fontSize: typography.styles["body-large"].fontSize,
              color: colors.interface.text.secondary,
            }}
          >
            Your collection of favorite recipes
          </p>
        </div>

        {/* Contenido */}
        {savedRecipes.length === 0 ? (
          <div className="text-center py-16">
            <MdFavorite
              className="mx-auto mb-4 text-6xl opacity-50"
              style={{ color: colors.brand.primary[500] }}
            />
            <h2
              className="mb-4"
              style={{
                fontSize: typography.styles["title-2"].fontSize,
                fontWeight: typography.styles["title-2"].fontWeight,
                color: colors.interface.text.primary,
              }}
            >
              No saved recipes yet
            </h2>
            <p
              className="mb-8"
              style={{
                fontSize: typography.styles["body"].fontSize,
                color: colors.interface.text.secondary,
              }}
            >
              Start creating recipes and save your favorites to see them here
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: colors.brand.primary[500],
                color: colors.interface.background.primary,
                fontSize: typography.styles["body"].fontSize,
                fontWeight: 600,
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
              Create Your First Recipe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-background-secondary rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: colors.interface.background.secondary,
                }}
              >
                {/* Imagen de la receta */}
                {recipe.image && (
                  <div className="mb-4">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Información de la receta */}
                <div className="mb-4">
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: typography.styles["title-3"].fontSize,
                      fontWeight: typography.styles["title-3"].fontWeight,
                      color: colors.interface.text.primary,
                    }}
                  >
                    {recipe.title}
                  </h3>
                  <p
                    className="mb-3 line-clamp-3"
                    style={{
                      fontSize: typography.styles["body"].fontSize,
                      color: colors.interface.text.secondary,
                    }}
                  >
                    {recipe.description}
                  </p>

                  {/* Metadatos */}
                  <div className="flex items-center gap-4 text-sm">
                    <span
                      style={{
                        color: colors.interface.text.secondary,
                      }}
                    >
                      ⏱️ {recipe.cookTime} min
                    </span>
                    <span
                      style={{
                        color: colors.interface.text.secondary,
                      }}
                    >
                      👥 {recipe.servings} servings
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewRecipe(recipe)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: colors.brand.primary[500],
                      color: colors.interface.background.primary,
                      fontSize: typography.styles["body"].fontSize,
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
                    <MdVisibility className="text-lg" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: colors.interface.background.tertiary,
                      color: colors.interface.text.secondary,
                      fontSize: typography.styles["body"].fontSize,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#EF4444";
                      e.currentTarget.style.color =
                        colors.interface.background.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.interface.background.tertiary;
                      e.currentTarget.style.color =
                        colors.interface.text.secondary;
                    }}
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
