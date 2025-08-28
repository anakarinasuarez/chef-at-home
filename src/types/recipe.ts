// Tipos para recetas
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string; // JSON string
  instructions: string; // JSON string
  cookingTime?: number; // en minutos
  difficulty?: "Easy" | "Medium" | "Hard";
  servings?: number;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  cookingTime?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  servings?: number;
  imageUrl?: string;
  isPublic?: boolean;
  userId: string;
}

export interface RecipeResponse {
  id: string;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  cookingTime?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  servings?: number;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RecipeServiceResponse {
  success: boolean;
  recipe?: RecipeResponse;
  recipes?: RecipeResponse[];
  error?: string;
}
