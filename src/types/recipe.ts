// Tipos unificados para recetas - Frontend y Backend
export interface UnifiedRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
  prepTime: string;
  cookingTime: string;
  totalTime: string;
  servings: number;
  cuisine: string;
  image?: string;
  stepImages?: string[];
  source: string;
  optionalIngredients?: Array<{
    name: string;
    reason: string;
  }>;
}

// Tipo para la base de datos (Prisma)
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string; // JSON string
  instructions: string; // JSON string
  cookingTime?: number; // en minutos
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

// Funciones de conversión entre tipos
export const convertToUnifiedRecipe = (
  recipe: Record<string, unknown>
): UnifiedRecipe => {
  return {
    id: (recipe.id as string) || Date.now().toString(),
    title: (recipe.title as string) || "Untitled Recipe",
    description: (recipe.description as string) || "",
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string"
      ? JSON.parse(recipe.ingredients)
      : [],
    instructions: Array.isArray(recipe.instructions)
      ? recipe.instructions
      : typeof recipe.instructions === "string"
      ? JSON.parse(recipe.instructions)
      : [],
    prepTime: (recipe.prepTime as string) || "15 minutes",
    cookingTime: (recipe.cookingTime as string) || "30 minutes",
    totalTime: (recipe.totalTime as string) || "45 minutes",
    servings: (recipe.servings as number) || 4,
    cuisine: (recipe.cuisine as string) || "international",
    image: (recipe.image as string) || (recipe.imageUrl as string),
    stepImages: Array.isArray(recipe.stepImages)
      ? (recipe.stepImages as string[])
      : undefined,
    source: (recipe.source as string) || "ai-generated",
    optionalIngredients:
      (recipe.optionalIngredients as Array<{ name: string; reason: string }>) ||
      [],
  };
};

export const convertFromUnifiedRecipe = (
  unifiedRecipe: UnifiedRecipe
): Recipe => {
  return {
    id: unifiedRecipe.id,
    title: unifiedRecipe.title,
    description: unifiedRecipe.description,
    ingredients: JSON.stringify(unifiedRecipe.ingredients),
    instructions: JSON.stringify(unifiedRecipe.instructions),
    cookingTime: parseInt(unifiedRecipe.cookingTime.replace(/\D/g, "")) || 30,
    servings: unifiedRecipe.servings,
    imageUrl: unifiedRecipe.image,
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "current-user", // Esto se debe pasar desde el contexto
  };
};
