import { prisma } from "@/lib/prisma";
import {
  CreateRecipeData,
  RecipeResponse,
  RecipeServiceResponse,
} from "@/types";

export class RecipeService {
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
}
