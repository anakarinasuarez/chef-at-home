"use client";

import { colors, typography } from "@/design-system";

interface ImagePlaceholderProps {
  title: string;
  cuisine?: string;
  className?: string;
  ingredients?: string[];
}

export default function ImagePlaceholder({
  title,
  cuisine = "International",
  className = "",
  ingredients = [],
}: ImagePlaceholderProps) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center rounded-lg ${className}`}
      style={{
        backgroundColor: colors.interface.background.secondary,
      }}
    >
      {/* Icon based on cuisine */}
      <div className="mb-3" style={{ color: colors.brand.primary[500] }}>
        <span className="text-6xl">
          {cuisine === "Italian" && "🍝"}
          {cuisine === "Mexican" && "🌮"}
          {cuisine === "Asian" && "🍜"}
          {cuisine === "French" && "🥖"}
          {cuisine === "Indian" && "🍛"}
          {cuisine === "Mediterranean" && "🐟"}
          {cuisine === "Thai" && "🥘"}
          {cuisine === "International" && "🍽️"}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-semibold text-center px-4 mb-2 line-clamp-3"
        style={{
          color: colors.interface.text.primary,
          fontSize: typography.styles["subtitle"].fontSize,
          fontWeight: typography.styles["subtitle"].fontWeight,
        }}
      >
        {title}
      </h3>

      {/* Cuisine */}
      <p
        className="text-base text-center px-4"
        style={{ color: colors.interface.text.secondary }}
      >
        {cuisine} Cuisine
      </p>
    </div>
  );
}
