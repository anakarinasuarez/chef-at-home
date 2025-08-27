export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  servingAmount: number;
  duration: number; // en minutos
  imageUrl: string;
  steps: string[];
  isSaved?: boolean;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onSave: (recipeId: string) => void;
  onView: (recipeId: string) => void;
}
