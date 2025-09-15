import React from "react";
import { colors } from "@/design-system";

interface RecipesEmptyStateProps {
  error: string | null;
  onBackToHome: () => void;
}

export default function RecipesEmptyState({
  error,
  onBackToHome,
}: RecipesEmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🍽️</div>
      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: colors.interface.text.primary }}
      >
        {error ? "Error generating recipes" : "No recipes found"}
      </h2>
      <p className="mb-6" style={{ color: colors.interface.text.secondary }}>
        {error ||
          "We couldn't generate recipes at the moment. Please try again."}
      </p>
      <div className="flex justify-center">
        <button
          onClick={onBackToHome}
          className="px-8 py-3 rounded-lg transition-colors border"
          style={{
            backgroundColor: "transparent",
            color: colors.brand.primary[500],
            borderColor: colors.brand.primary[500],
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.brand.primary[500];
            e.currentTarget.style.color = colors.base.white;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.brand.primary[500];
          }}
        >
          Return home
        </button>
      </div>
    </div>
  );
}
