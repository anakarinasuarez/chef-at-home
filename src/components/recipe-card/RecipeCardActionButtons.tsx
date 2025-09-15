import React from "react";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { BiShare } from "react-icons/bi";
import { colors } from "@/design-system";

interface RecipeCardActionButtonsProps {
  recipe: any;
  onEdit?: (recipe: any) => void;
  onDelete?: (recipeId: string) => void;
  onShare?: (recipe: any) => void;
}

export default function RecipeCardActionButtons({
  recipe,
  onEdit,
  onDelete,
  onShare,
}: RecipeCardActionButtonsProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(recipe.id || "");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(recipe);
        }}
        className="p-3 rounded-lg transition-colors border flex items-center justify-center"
        style={{
          backgroundColor: "transparent",
          color: colors.brand.primary[500],
          borderColor: colors.brand.primary[500],
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.brand.primary[500];
          e.currentTarget.style.color = colors.interface.background.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = colors.brand.primary[500];
        }}
        title="Edit recipe"
      >
        <FaPencil
          className="text-lg"
          style={{ color: colors.brand.primary[500] }}
        />
      </button>
      <button
        onClick={handleDeleteClick}
        className="p-3 rounded-lg transition-colors border flex items-center justify-center"
        style={{
          backgroundColor: "transparent",
          color: colors.brand.primary[500],
          borderColor: colors.brand.primary[500],
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#EF4444";
          e.currentTarget.style.color = colors.interface.background.primary;
          e.currentTarget.style.borderColor = "#EF4444";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = colors.brand.primary[500];
          e.currentTarget.style.borderColor = colors.brand.primary[500];
        }}
        title="Delete recipe"
      >
        <MdDelete
          className="text-lg"
          style={{ color: colors.brand.primary[500] }}
        />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShare?.(recipe);
        }}
        className="p-3 rounded-lg transition-colors border flex items-center justify-center"
        style={{
          backgroundColor: "transparent",
          color: colors.brand.primary[500],
          borderColor: colors.brand.primary[500],
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            colors.interface.background.tertiary;
          e.currentTarget.style.color = colors.interface.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = colors.brand.primary[500];
        }}
        title="Share recipe"
      >
        <BiShare
          className="text-lg"
          style={{ color: colors.brand.primary[500] }}
        />
      </button>
    </div>
  );
}
