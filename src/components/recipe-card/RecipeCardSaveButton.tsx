import React from "react";
import { colors, typography } from "@/design-system";

interface RecipeCardSaveButtonProps {
  isSaved: boolean;
  isSaving: boolean;
  isRemoving: boolean;
  onSaveClick: (e: React.MouseEvent) => void;
}

export default function RecipeCardSaveButton({
  isSaved,
  isSaving,
  isRemoving,
  onSaveClick,
}: RecipeCardSaveButtonProps) {
  return (
    <button
      onClick={onSaveClick}
      disabled={isSaving || isRemoving}
      className="px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
      style={{
        backgroundColor: isRemoving
          ? colors.brand.primary[600]
          : isSaved
          ? colors.interface.background.tertiary
          : colors.brand.primary[500],
        color: isRemoving
          ? colors.base.white
          : isSaved
          ? colors.brand.primary[500]
          : colors.base.white,
        fontSize: typography.styles["button"].fontSize,
        fontWeight: typography.styles["button"].fontWeight,
        lineHeight: typography.styles["button"].lineHeight,
        letterSpacing: typography.styles["button"].letterSpacing,
        border:
          isSaved && !isRemoving
            ? `2px solid ${colors.brand.primary[500]}`
            : "none",
      }}
      onMouseEnter={(e) => {
        if (!isSaved && !isRemoving) {
          e.currentTarget.style.backgroundColor = colors.brand.primary[600];
        }
      }}
      onMouseLeave={(e) => {
        if (!isSaved && !isRemoving) {
          e.currentTarget.style.backgroundColor = colors.brand.primary[500];
        }
      }}
    >
      {isRemoving ? (
        <span className="text-lg animate-pulse">✓</span>
      ) : isSaving ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : isSaved ? (
        <span className="text-lg">✓</span>
      ) : (
        <span className="text-lg">+</span>
      )}
      {isRemoving
        ? "Saved!"
        : isSaving
        ? "Saving..."
        : isSaved
        ? "Saved"
        : "Save"}
    </button>
  );
}
