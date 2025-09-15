import React from "react";
import RecipeCard from "@/components/RecipeCard";

interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookingTime: string;
  image?: string;
  source: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}

interface RecipesScrollContainerProps {
  recipes: Recipe[];
  removingRecipeId: string | null;
  onRemoveFromList: (recipeId: string) => void;
}

export default function RecipesScrollContainer({
  recipes,
  removingRecipeId,
  onRemoveFromList,
}: RecipesScrollContainerProps) {
  return (
    <div className="flex gap-6 overflow-x-auto scrollbar-hide items-center flex-1 pt-3 pb-1.5">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className={`flex-shrink-0 w-80 transition-all duration-600 ease-in-out ${
            removingRecipeId === recipe.id
              ? "opacity-0 scale-95 transform translate-x-4"
              : "opacity-100 scale-100 transform translate-x-0"
          }`}
        >
          <RecipeCard
            recipe={recipe}
            variant="save"
            onRemoveFromList={onRemoveFromList}
            isRemoving={removingRecipeId === recipe.id}
          />
        </div>
      ))}
    </div>
  );
}
