import React from "react";
import { BiTime, BiUser } from "react-icons/bi";
import { colors, typography } from "@/design-system";

interface RecipeCardInfoProps {
  title: string;
  servings: number;
  cookingTime: string;
}

export default function RecipeCardInfo({
  title,
  servings,
  cookingTime,
}: RecipeCardInfoProps) {
  return (
    <div className="p-6">
      {/* Title */}
      <h3
        className="mb-4 line-clamp-2"
        style={{
          color: colors.interface.text.primary,
          fontSize: typography.styles["subtitle"].fontSize,
          fontWeight: typography.styles["subtitle"].fontWeight,
          lineHeight: typography.styles["subtitle"].lineHeight,
          letterSpacing: typography.styles["subtitle"].letterSpacing,
          minHeight: "3rem",
          maxHeight: "3rem",
        }}
        title={title}
      >
        {title}
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
            for {servings} people
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
            duration {cookingTime}
          </span>
        </div>
      </div>
    </div>
  );
}
