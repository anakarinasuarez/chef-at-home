"use client";

import { colors, typography } from "@/design-system";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface IngredientsCardProps {
  ingredients: Ingredient[];
  servings: number;
  imageHeight?: number; // Altura de la imagen para establecer altura mínima
}

export default function IngredientsCard({
  ingredients,
  servings,
  imageHeight = 500,
}: IngredientsCardProps) {
  return (
    <div
      className="rounded-2xl pb-6 px-6 shadow-lg w-full overflow-hidden"
      style={{
        backgroundColor: colors.interface.background.secondary,
        minHeight: `${imageHeight}px`, // Altura mínima igual a la imagen
        height: "fit-content", // Se expande si hay más contenido
      }}
    >
      {/* Header con título y selector de porciones */}
      <div className="flex items-center justify-between mb-6 pt-6">
        <h2
          className="text-2xl font-bold"
          style={{ color: colors.interface.text.primary }}
        >
          Ingredients
        </h2>
        <div
          className="px-3 py-1.5 rounded-full flex items-center gap-1.5 ml-4"
          style={{
            backgroundColor: colors.interface.background.tertiary,
            border: "none",
            color: colors.interface.text.primary,
          }}
        >
          <span
            className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: colors.interface.background.secondary,
              color: colors.interface.text.primary,
            }}
          >
            {servings}
          </span>
          <span
            className="text-xs font-medium whitespace-nowrap"
            style={{ color: colors.interface.text.primary }}
          >
            Serving amount
          </span>
        </div>
      </div>

      {/* Lista de ingredientes con scroll si es necesario */}
      <div
        className="space-y-3 ingredients-scroll"
        style={{
          maxHeight: `calc(${imageHeight}px - 100px)`, // Altura máxima = altura imagen - header (reducido por menos padding)
          overflowY: "auto", // Scroll vertical si hay muchos ingredientes
        }}
      >
        {ingredients && ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.brand.primary[500] }}
                ></div>
                <span
                  className="text-lg truncate"
                  style={{
                    color: colors.interface.text.primary,
                    fontSize: typography.styles["body"].fontSize,
                    fontWeight: typography.styles["body"].fontWeight,
                    lineHeight: typography.styles["body"].lineHeight,
                  }}
                  title={ingredient.name} // Tooltip para nombres largos
                >
                  {ingredient.name}
                </span>
              </div>
              <span
                className="font-medium flex-shrink-0 ml-2"
                style={{ color: colors.interface.text.secondary }}
              >
                {ingredient.quantity}
                {ingredient.unit}
              </span>
            </div>
          ))
        ) : (
          <p
            className="text-gray-400"
            style={{ color: colors.interface.text.secondary }}
          >
            No ingredients available
          </p>
        )}
      </div>
    </div>
  );
}
