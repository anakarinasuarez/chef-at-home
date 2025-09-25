import { convertToUnifiedRecipe } from "@/types/recipe";
import { UnifiedRecipe } from "@/types/recipe";

export interface GenerateRecipesRequest {
  ingredients: string[];
  servings: number;
  count?: number;
}

export interface GenerateRecipesResponse {
  success: boolean;
  recipes?: UnifiedRecipe[];
  error?: string;
}

/**
 * Servicio para generar recetas usando la API
 * Maneja toda la lógica de negocio relacionada con la generación de recetas
 */
export class RecipeGenerationService {
  private static instance: RecipeGenerationService;

  private constructor() {}

  public static getInstance(): RecipeGenerationService {
    if (!RecipeGenerationService.instance) {
      RecipeGenerationService.instance = new RecipeGenerationService();
    }
    return RecipeGenerationService.instance;
  }

  /**
   * Genera recetas basadas en ingredientes y número de porciones
   */
  public async generateRecipes(
    request: GenerateRecipesRequest
  ): Promise<GenerateRecipesResponse> {
    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: request.ingredients,
          servings: request.servings,
          count: request.count || 4,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Number of recipes received:", data.recipes?.length || 0);

      if (!data.recipes || data.recipes.length === 0) {
        throw new Error("No recipes generated");
      }

      // Convertir a UnifiedRecipe
      const unifiedRecipes = data.recipes.map((recipe: unknown) =>
        convertToUnifiedRecipe(recipe as Record<string, unknown>)
      );

      return {
        success: true,
        recipes: unifiedRecipes,
      };
    } catch (error) {
      console.error("Error generating recipes:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate recipes",
      };
    }
  }

  /**
   * Guarda las recetas generadas en sessionStorage
   */
  public saveRecipesToSession(recipes: UnifiedRecipe[]): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentRecipes", JSON.stringify(recipes));
    }
  }

  /**
   * Recupera las recetas generadas desde sessionStorage
   */
  public getRecipesFromSession(): UnifiedRecipe[] {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = sessionStorage.getItem("currentRecipes");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error parsing stored recipes:", error);
      return [];
    }
  }

  /**
   * Limpia las recetas del sessionStorage
   */
  public clearRecipesFromSession(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("currentRecipes");
    }
  }
}

// Exportar instancia singleton
export const recipeGenerationService = RecipeGenerationService.getInstance();
