import React from "react";
import { colors } from "@/design-system";

interface RecipesScrollIndicatorProps {
  recipesCount: number;
  activeIndex: number;
  onScrollToRecipe: (index: number) => void;
}

export default function RecipesScrollIndicator({
  recipesCount,
  activeIndex,
  onScrollToRecipe,
}: RecipesScrollIndicatorProps) {
  return (
    <div className="flex justify-center mt-2">
      <div className="flex gap-2">
        {Array.from({ length: recipesCount }, (_, index) => (
          <button
            key={index}
            onClick={() => onScrollToRecipe(index)}
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
  );
}
