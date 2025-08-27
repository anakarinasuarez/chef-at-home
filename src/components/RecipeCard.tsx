"use client";

import Image from "next/image";
import { Heart, Clock, Users } from "lucide-react";
import { RecipeCardProps } from "@/types/recipe";
import { colors } from "@/lib/colors";

export default function RecipeCard({
  recipe,
  onSave,
  onView,
}: RecipeCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl flex flex-col h-full"
      style={{ backgroundColor: "#1D1C1E" }}
      onClick={() => onView(recipe.id)}
    >
      {/* Recipe Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Recipe Title */}
        <h3 className="text-base font-bold text-white mb-6 leading-tight">
          {recipe.title}
        </h3>

        {/* Recipe Details */}
        <div className="space-y-2 text-gray-300 text-sm mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-medium">
              for {recipe.servingAmount} people
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">
              duration {recipe.duration} minutes
            </span>
          </div>
        </div>

        {/* Recipe Image */}
        <div className="relative h-48 w-full mb-6 flex-shrink-0">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* Save Button - Push to bottom */}
        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(recipe.id);
            }}
            className="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ml-auto"
            style={{
              backgroundColor: recipe.isSaved ? colors.primary.main : "#1D1C1E",
              borderColor: colors.primary.main,
              border: `1px solid ${colors.primary.main}`,
              color: recipe.isSaved ? colors.background : colors.primary.main,
              width: "fit-content",
              minWidth: "80px",
            }}
            onMouseEnter={(e) => {
              if (!recipe.isSaved) {
                e.currentTarget.style.backgroundColor = colors.primary.main;
                e.currentTarget.style.color = colors.background;
              }
            }}
            onMouseLeave={(e) => {
              if (!recipe.isSaved) {
                e.currentTarget.style.backgroundColor = "#1D1C1E";
                e.currentTarget.style.color = colors.primary.main;
              }
            }}
          >
            <Heart
              className={`w-4 h-4 ${recipe.isSaved ? "fill-current" : ""}`}
            />
            {recipe.isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
