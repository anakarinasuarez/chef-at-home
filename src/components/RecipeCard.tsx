"use client";

import { useRouter } from "next/navigation";
import { BiTime, BiUser, BiStar, BiBookmark } from "react-icons/bi";
import { colors, typography } from "@/design-system";

interface RecipeCardProps {
  recipe: {
    id?: string;
    title: string;
    servings: number;
    cookingTime: string;
    difficulty: string;
    image?: string;
    source: string;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // Generar un ID único si no existe
    const recipeId = recipe.id || Date.now().toString();

    // Guardar los datos de la receta en localStorage para la página de detalle
    localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(recipe));

    router.push(`/recipes/${recipeId}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se active el click de la tarjeta
    // Aquí irá la lógica para guardar la receta
    console.log("Saving recipe:", recipe.title);
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
        {/* Title - Subtitle size */}
        <h3
          className="mb-4"
          style={{
            color: colors.interface.text.primary,
            fontSize: typography.styles["subtitle"].fontSize,
            fontWeight: typography.styles["subtitle"].fontWeight,
            lineHeight: typography.styles["subtitle"].lineHeight,
            letterSpacing: typography.styles["subtitle"].letterSpacing,
          }}
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
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: colors.interface.background.tertiary }}
            >
              <span style={{ color: colors.interface.text.secondary }}>
                No image
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Save Button - Below image, aligned to the right */}
      <div className="p-6 flex justify-end">
        <button
          onClick={handleSaveClick}
          className="px-6 py-3 rounded-lg transition-all duration-200"
          style={{
            backgroundColor: colors.brand.primary[500],
            color: colors.base.white,
            fontSize: typography.styles["button"].fontSize,
            fontWeight: typography.styles["button"].fontWeight,
            lineHeight: typography.styles["button"].lineHeight,
            letterSpacing: typography.styles["button"].letterSpacing,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.brand.primary[600];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.brand.primary[500];
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
