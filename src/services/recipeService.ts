import { prisma } from "@/lib/prisma";
import {
  CreateRecipeData,
  RecipeResponse,
  RecipeServiceResponse,
} from "@/types";
import { colors } from "@/design-system";
import {
  generateRecipeWithGemini,
  generateMultipleRecipesWithGemini,
} from "./geminiService";
import {
  generateRecipeWithOpenAI,
  isOpenAIServiceAvailable,
} from "./openaiRecipeService";
import {
  generateRecipeImageWithOpenAI,
  isOpenAIImageServiceAvailable,
} from "./openaiImageService";

export interface Recipe {
  id: string;
  title: string;
  servings: number;
  duration: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

export interface RecipeGenerationRequest {
  ingredients: string[];
  servings: number;
  cuisine?: string;
}

// Convert Prisma recipe to RecipeResponse
const convertPrismaRecipeToResponse = (recipe: unknown): RecipeResponse => {
  const r = recipe as Record<string, unknown>;
  return {
    id: r.id as string,
    title: r.title as string,
    description: (r.description as string) ?? undefined,
    ingredients: r.ingredients as string,
    instructions: r.instructions as string,
    cookingTime: (r.cookingTime as number) ?? undefined,
    servings: (r.servings as number) ?? undefined,
    imageUrl: (r.imageUrl as string) ?? undefined,
    isPublic: r.isPublic as boolean,
    createdAt: r.createdAt as Date,
    updatedAt: r.updatedAt as Date,
    user: r.user as { id: string; name: string; email: string } | undefined,
  };
};

// Create a new recipe
export const createRecipe = async (
  data: CreateRecipeData
): Promise<{
  success: boolean;
  recipe?: RecipeResponse;
  error?: string;
}> => {
  try {
    // Validaciones básicas
    if (
      !data.title ||
      !data.ingredients ||
      !data.instructions ||
      !data.userId
    ) {
      return {
        success: false,
        error: "Title, ingredients, instructions and userId are required",
      };
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Crear la receta
    const recipe = await prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        instructions: data.instructions,
        cookingTime: data.cookingTime,
        servings: data.servings,
        imageUrl: data.imageUrl,
        isPublic: data.isPublic ?? true,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      recipe: convertPrismaRecipeToResponse(recipe),
    };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Get all public recipes
export const getPublicRecipes = async (): Promise<{
  success: boolean;
  recipes?: RecipeResponse[];
  error?: string;
}> => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      recipes: recipes.map((recipe: unknown) =>
        convertPrismaRecipeToResponse(recipe)
      ),
    };
  } catch (error) {
    console.error("Error getting public recipes:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Get recipes for a specific user
export const getUserRecipes = async (
  userId: string
): Promise<{
  success: boolean;
  recipes?: RecipeResponse[];
  error?: string;
}> => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      recipes: recipes.map((recipe: unknown) =>
        convertPrismaRecipeToResponse(recipe)
      ),
    };
  } catch (error) {
    console.error("Error getting user recipes:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Get recipe by ID
export const getRecipeById = async (
  recipeId: string
): Promise<{
  success: boolean;
  recipe?: RecipeResponse;
  error?: string;
}> => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!recipe) {
      return {
        success: false,
        error: "Recipe not found",
      };
    }

    return {
      success: true,
      recipe: convertPrismaRecipeToResponse(recipe),
    };
  } catch (error) {
    console.error("Error getting recipe by ID:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Update an existing recipe
export const updateRecipe = async (
  recipeId: string,
  userId: string,
  data: Partial<CreateRecipeData>
): Promise<{
  success: boolean;
  recipe?: RecipeResponse;
  error?: string;
}> => {
  try {
    // Verificar que la receta existe y pertenece al usuario
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!existingRecipe) {
      return {
        success: false,
        error: "Recipe not found",
      };
    }

    if (existingRecipe.userId !== userId) {
      return {
        success: false,
        error: "Unauthorized to update this recipe",
      };
    }

    // Actualizar la receta
    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      recipe: convertPrismaRecipeToResponse(recipe),
    };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Delete a recipe
export const deleteRecipe = async (
  recipeId: string,
  userId: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Verificar que la receta existe y pertenece al usuario
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!existingRecipe) {
      return {
        success: false,
        error: "Recipe not found",
      };
    }

    if (existingRecipe.userId !== userId) {
      return {
        success: false,
        error: "Unauthorized to delete this recipe",
      };
    }

    // Eliminar la receta
    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Generate recipe image
export const getRecipeImage = async (
  recipeTitle: string,
  ingredients: string[]
): Promise<string | null> => {
  try {
    // Primero intentar con OpenAI DALL-E
    const openaiImage = await generateRecipeImageWithOpenAI({
      recipeName: recipeTitle,
      ingredients,
      cuisine: "International",
      style: "photorealistic",
    });

    if (openaiImage && openaiImage !== "/images/plate.png") {
      return openaiImage;
    }

    // Si OpenAI falla, usar imagen por defecto
    return "/images/plate.png";
  } catch (error) {
    console.error("Error getting recipe image:", error);
    return "/images/plate.png";
  }
};

// Definir tipo para receta personalizada
export interface CustomRecipe {
  title: string;
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  instructions: string[];
  prepTime: string;
  cookingTime: string;
  totalTime: string;
  servings: number;
  cuisine: string;
  image?: string | null;
  source: string;
}

// Generate custom recipe fallback
export const generateCustomRecipe = (
  ingredients: string[],
  servings: number
): CustomRecipe => {
  const cuisines = ["Italian", "Mexican", "Asian", "Mediterranean", "American"];
  const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];

  return {
    title: `${randomCuisine} ${ingredients[0]} Special`,
    ingredients: ingredients.map((ing) => ({
      name: ing,
      quantity: Math.ceil(servings / 2),
      unit: "pieces",
    })),
    instructions: [
      `Clean and prepare ${ingredients.join(" and ")}`,
      "Cook with your favorite spices",
      "Serve hot and enjoy!",
    ],
    cookingTime: "25 minutes",
    prepTime: "10 minutes",
    totalTime: "35 minutes",
    cuisine: randomCuisine,
    servings: servings,
    source: "template",
  };
};

// Generate multiple custom recipes fallback
export const generateMultipleCustomRecipes = (
  ingredients: string[],
  servings: number,
  count: number
): CustomRecipe[] => {
  const recipes = [];
  const cuisines = [
    "Italian",
    "Mexican",
    "Asian",
    "Mediterranean",
    "American",
    "French",
    "Indian",
    "Thai",
  ];

  for (let i = 0; i < count; i++) {
    const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];

    recipes.push({
      title: `${randomCuisine} ${ingredients[0]} ${i + 1}`,
      ingredients: ingredients.map((ing) => ({
        name: ing,
        quantity: Math.ceil(servings / 2) + i,
        unit: "pieces",
      })),
      instructions: [
        `Prepare ${ingredients.join(" and ")}`,
        "Cook with authentic spices",
        "Garnish and serve",
      ],
      cookingTime: `${20 + i * 5} minutes`,
      prepTime: "10 minutes",
      totalTime: `${30 + i * 5} minutes`,
      cuisine: randomCuisine,
      servings: servings,
      source: "template",
    });
  }

  return recipes;
};

// Importar utilidades de generación
import {
  generateWithOpenAI,
  generateWithGemini,
  addImageToRecipe,
  generateFallbackRecipe,
  RecipeGenerationParams,
} from "./utils/recipeGenerationUtils";

// Generate single recipe - Refactorizada usando funciones utilitarias
export const generateRecipe = async (
  ingredients: string[],
  servings: number,
  cuisine: string = "international"
): Promise<CustomRecipe | null> => {
  const params: RecipeGenerationParams = {
    ingredients,
    servings,
    cuisine,
  };

  try {
    // Intentar con OpenAI primero
    const openaiResult = await generateWithOpenAI(params);
    if (openaiResult.success && openaiResult.recipe) {
      return (await addImageToRecipe(
        openaiResult.recipe as any,
        ingredients,
        "openai-gpt4"
      )) as any;
    }

    // Fallback a Gemini
    const geminiResult = await generateWithGemini(params);
    if (geminiResult.success && geminiResult.recipe) {
      return (await addImageToRecipe(
        geminiResult.recipe as any,
        ingredients,
        "gemini-fallback"
      )) as any;
    }

    // Fallback final a template
    return (await generateFallbackRecipe(params)) as any;
  } catch (error) {
    console.error("Error generating recipe:", error);
    return (await generateFallbackRecipe(params)) as any;
  }
};

// Importar utilidades adicionales para generación múltiple
import {
  generateMultipleWithOpenAI,
  generateMultipleWithGemini,
  generateMultipleFallbackRecipes,
} from "./utils/recipeGenerationUtils";

// Generate multiple recipes - Refactorizada usando funciones utilitarias
export const generateMultipleRecipes = async (
  ingredients: string[],
  servings: number,
  count: number = 4
): Promise<CustomRecipe[]> => {
  const params: RecipeGenerationParams & { count: number } = {
    ingredients,
    servings,
    cuisine: "international",
    count,
  };

  try {
    // Intentar con OpenAI primero
    try {
      return (await generateMultipleWithOpenAI(params)) as any;
    } catch (openaiError) {
      console.log("OpenAI failed, trying Gemini:", openaiError);
    }

    // Fallback a Gemini
    try {
      return (await generateMultipleWithGemini(params)) as any;
    } catch (geminiError) {
      console.log("Gemini failed, using fallback:", geminiError);
    }

    // Fallback final a templates
    return (await generateMultipleFallbackRecipes(params)) as any;
  } catch (error) {
    console.error("Error generating multiple recipes:", error);
    return (await generateMultipleFallbackRecipes(params)) as any;
  }
};

// Save recipe to user's collection
export const saveRecipe = async (
  userId: string,
  recipe: Recipe
): Promise<void> => {
  try {
    // Here you would save to your database
    // For now, we'll just log it
    console.log("Saving recipe:", { userId, recipe });

    // TODO: Implement database save
    // await prisma.savedRecipe.create({
    //   data: {
    //     userId,
    //     recipeId: recipe.id,
    //     title: recipe.title,
    //     // ... other fields
    //   }
    // });
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw new Error("Failed to save recipe");
  }
};

// Get user's saved recipes
export const getSavedRecipes = async (userId: string): Promise<Recipe[]> => {
  try {
    // TODO: Implement database query
    // const savedRecipes = await prisma.savedRecipe.findMany({
    //   where: { userId },
    //   include: { recipe: true }
    // });

    // For now, return empty array
    return [];
  } catch (error) {
    console.error("Error getting saved recipes:", error);
    throw new Error("Failed to get saved recipes");
  }
};
