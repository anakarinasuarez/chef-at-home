import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { colors } from "@/design-system";

interface RecipesPageHeaderProps {
  recipesCount: number;
  onBackToHome: () => void;
}

export default function RecipesPageHeader({
  recipesCount,
  onBackToHome,
}: RecipesPageHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <button
        onClick={onBackToHome}
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
        <p className="mt-1" style={{ color: colors.interface.text.secondary }}>
          {recipesCount} recipes generated for you
        </p>
      </div>
    </div>
  );
}
