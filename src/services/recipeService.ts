import { prisma } from "@/lib/prisma";
import {
  CreateRecipeData,
  RecipeResponse,
  RecipeServiceResponse,
} from "@/types";
import { colors } from "@/design-system";
import GeminiService from "./geminiService";
import { openaiRecipeService } from "./openaiRecipeService";
import { openaiImageService } from "./openaiImageService";

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
  difficulty?: "easy" | "medium" | "hard";
}

class RecipeService {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  /**
   * Convierte una receta de Prisma a RecipeResponse
   */
  private static convertPrismaRecipeToResponse(
    recipe: unknown
  ): RecipeResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = recipe as unknown as any;
    return {
      ...r,
      description: r.description ?? undefined,
      cookingTime: r.cookingTime ?? undefined,
      difficulty:
        (r.difficulty as "Easy" | "Medium" | "Hard" | undefined) ?? undefined,
      servings: r.servings ?? undefined,
      imageUrl: r.imageUrl ?? undefined,
    };
  }

  /**
   * Crea una nueva receta
   */
  static async createRecipe(data: CreateRecipeData): Promise<{
    success: boolean;
    recipe?: RecipeResponse;
    error?: string;
  }> {
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
          difficulty: data.difficulty,
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
        recipe: this.convertPrismaRecipeToResponse(recipe),
      };
    } catch (error) {
      console.error("Error creating recipe:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Obtiene todas las recetas públicas
   */
  static async getPublicRecipes(): Promise<{
    success: boolean;
    recipes?: RecipeResponse[];
    error?: string;
  }> {
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
          this.convertPrismaRecipeToResponse(recipe)
        ),
      };
    } catch (error) {
      console.error("Error getting public recipes:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Obtiene las recetas de un usuario específico
   */
  static async getUserRecipes(userId: string): Promise<{
    success: boolean;
    recipes?: RecipeResponse[];
    error?: string;
  }> {
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
          this.convertPrismaRecipeToResponse(recipe)
        ),
      };
    } catch (error) {
      console.error("Error getting user recipes:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Obtiene una receta por ID
   */
  static async getRecipeById(recipeId: string): Promise<{
    success: boolean;
    recipe?: RecipeResponse;
    error?: string;
  }> {
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
        recipe: this.convertPrismaRecipeToResponse(recipe),
      };
    } catch (error) {
      console.error("Error getting recipe by ID:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Actualiza una receta existente
   */
  static async updateRecipe(
    recipeId: string,
    userId: string,
    data: Partial<CreateRecipeData>
  ): Promise<{
    success: boolean;
    recipe?: RecipeResponse;
    error?: string;
  }> {
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
        recipe: this.convertPrismaRecipeToResponse(recipe),
      };
    } catch (error) {
      console.error("Error updating recipe:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Elimina una receta
   */
  static async deleteRecipe(
    recipeId: string,
    userId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
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
  }

  async generateRecipe(
    ingredients: string[],
    servings: number,
    cuisine: string = "international",
    difficulty: string = "medium"
  ): Promise<any> {
    try {
      // Primero intentar con OpenAI GPT-4
      if (openaiRecipeService.isServiceAvailable) {
        console.log("🎯 Using OpenAI GPT-4 for recipe generation");
        const openaiResponse = await openaiRecipeService.generateRecipe({
          ingredients,
          servings,
          cuisine,
          difficulty,
          count: 1,
        });

        if (openaiResponse.recipes && openaiResponse.recipes.length > 0) {
          const recipe = openaiResponse.recipes[0];
          const image = await this.getRecipeImage(recipe.title, ingredients);

          return {
            ...recipe,
            image,
            source: "openai-gpt4",
          };
        }
      }

      // Fallback a Gemini si OpenAI no está disponible
      console.log("🔄 Falling back to Gemini for recipe generation");
      const recipe = await this.geminiService.generateRecipe(
        ingredients,
        servings,
        cuisine,
        difficulty
      );
      const image = await this.getRecipeImage(recipe.title, ingredients);

      return {
        ...recipe,
        image,
        source: "gemini-fallback",
      };
    } catch (error) {
      console.error("Error generating recipe:", error);
      // Fallback to template
      return this.generateCustomRecipe(ingredients, servings);
    }
  }

  async generateMultipleRecipes(
    ingredients: string[],
    servings: number,
    count: number = 4
  ): Promise<any[]> {
    try {
      // Primero intentar con OpenAI GPT-4
      if (openaiRecipeService.isServiceAvailable) {
        console.log("🎯 Using OpenAI GPT-4 for multiple recipe generation");
        const openaiResponse = await openaiRecipeService.generateRecipe({
          ingredients,
          servings,
          count,
        });

        if (openaiResponse.recipes && openaiResponse.recipes.length > 0) {
          // Add images to each recipe
          const recipesWithImages = await Promise.all(
            openaiResponse.recipes.map(async (recipe) => {
              try {
                const image = await this.getRecipeImage(
                  recipe.title,
                  ingredients
                );
                return { ...recipe, image, source: "openai-gpt4" };
              } catch (error) {
                console.error("Error getting image for recipe:", error);
                return { ...recipe, image: null, source: "openai-gpt4" };
              }
            })
          );

          return recipesWithImages;
        }
      }

      // Fallback a Gemini si OpenAI no está disponible
      console.log("🔄 Falling back to Gemini for multiple recipe generation");
      const recipes = await this.geminiService.generateMultipleRecipes(
        ingredients,
        servings,
        count
      );

      // Add images to each recipe
      const recipesWithImages = await Promise.all(
        recipes.map(async (recipe) => {
          try {
            const image = await this.getRecipeImage(recipe.title, ingredients);
            return { ...recipe, image, source: "gemini-fallback" };
          } catch (error) {
            console.error("Error getting image for recipe:", error);
            return { ...recipe, image: null, source: "gemini-fallback" };
          }
        })
      );

      return recipesWithImages;
    } catch (error) {
      console.error("Error generating multiple recipes:", error);
      // Fallback to multiple templates
      return this.generateMultipleCustomRecipes(ingredients, servings, count);
    }
  }

  async getRecipeImage(
    recipeTitle: string,
    ingredients: string[]
  ): Promise<string | null> {
    try {
      // Primero intentar con OpenAI DALL-E
      const openaiImage = await openaiImageService.generateRecipeImage({
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
  }

  private generateCustomRecipe(ingredients: string[], servings: number): any {
    const cuisines = [
      "Italian",
      "Mexican",
      "Asian",
      "Mediterranean",
      "American",
    ];
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
      difficulty: "Medium",
      cuisine: randomCuisine,
      servings: servings,
      source: "template",
    };
  }

  private generateMultipleCustomRecipes(
    ingredients: string[],
    servings: number,
    count: number
  ): any[] {
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
      const randomCuisine =
        cuisines[Math.floor(Math.random() * cuisines.length)];
      const randomDifficulty = ["Easy", "Medium", "Hard"][
        Math.floor(Math.random() * 3)
      ];

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
        difficulty: randomDifficulty,
        cuisine: randomCuisine,
        servings: servings,
        source: "template",
      });
    }

    return recipes;
  }

  /**
   * Save recipe to user's collection
   */
  static async saveRecipe(userId: string, recipe: Recipe): Promise<void> {
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
  }

  /**
   * Get user's saved recipes
   */
  static async getSavedRecipes(userId: string): Promise<Recipe[]> {
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
  }
}

export default RecipeService;
