/**
 * Utilidades centralizadas para validación y limpieza de recetas
 * Evita duplicación de lógica de validación
 */

export interface Ingredient {
  name: string;
  quantity: string | number;
  unit: string;
}

export interface RecipeData {
  title?: string;
  description?: string;
  ingredients?: Ingredient[] | string[];
  instructions?: string[];
  cookingTime?: string;
  prepTime?: string;
  totalTime?: string;
  cuisine?: string;
  servings?: number;
  image?: string;
  source?: string;
}

export class RecipeValidator {
  /**
   * Limpia el formato de tiempo (ej: "30 min" -> "30 minutes")
   */
  static cleanTimeFormat(time: string | undefined): string {
    if (!time) return "30 minutes";

    const timeStr = time.toString().toLowerCase();

    // Si ya contiene "minutes", devolverlo tal como está
    if (timeStr.includes("minutes") || timeStr.includes("mins")) {
      return timeStr.replace(/mins?/g, "minutes");
    }

    // Si contiene solo números, asumir que son minutos
    const minutes = parseInt(timeStr.replace(/\D/g, ""));
    if (!isNaN(minutes)) {
      return `${minutes} minutes`;
    }

    return "30 minutes";
  }

  /**
   * Valida y limpia una receta
   */
  static validateAndCleanRecipe(
    recipe: RecipeData,
    originalIngredients: string[],
    servings: number
  ): RecipeData {
    const cleanedRecipe: RecipeData = {
      title: recipe.title || "Delicious Recipe",
      description:
        recipe.description || "A flavorful dish made with fresh ingredients",
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      cookingTime: recipe.cookingTime || "30 minutes",
      prepTime: recipe.prepTime || "15 minutes",
      totalTime: recipe.totalTime || "45 minutes",
      cuisine: recipe.cuisine || "International",
      servings: recipe.servings || servings,
      image: recipe.image,
      source: recipe.source || "ai-generated",
    };

    // Validar estructura de ingredientes
    cleanedRecipe.ingredients = this.validateIngredients(
      cleanedRecipe.ingredients as Ingredient[] | string[],
      originalIngredients
    );

    // Validar instrucciones
    cleanedRecipe.instructions = this.validateInstructions(
      cleanedRecipe.instructions as string[]
    );

    // Limpiar formatos de tiempo
    cleanedRecipe.cookingTime = this.cleanTimeFormat(cleanedRecipe.cookingTime);
    cleanedRecipe.prepTime = this.cleanTimeFormat(cleanedRecipe.prepTime);
    cleanedRecipe.totalTime = this.cleanTimeFormat(cleanedRecipe.totalTime);

    return cleanedRecipe;
  }

  /**
   * Valida y normaliza la estructura de ingredientes
   */
  private static validateIngredients(
    ingredients: Ingredient[] | string[],
    originalIngredients: string[]
  ): Ingredient[] {
    let normalizedIngredients: Ingredient[];

    if (Array.isArray(ingredients)) {
      normalizedIngredients = ingredients.map((ing: Ingredient | string) => {
        if (typeof ing === "string") {
          return {
            name: ing,
            quantity: "1",
            unit: "piece",
          };
        }
        return {
          name: ing.name || ing.toString(),
          quantity: ing.quantity || "1",
          unit: ing.unit || "piece",
        };
      });
    } else {
      normalizedIngredients = originalIngredients.map((ing) => ({
        name: ing,
        quantity: "1",
        unit: "piece",
      }));
    }

    // Asegurar que todos los ingredientes originales estén incluidos
    const includedIngredients = normalizedIngredients.map((ing) =>
      ing.name.toLowerCase()
    );

    originalIngredients.forEach((originalIng) => {
      if (
        !includedIngredients.some(
          (included: string) =>
            included.includes(originalIng.toLowerCase()) ||
            originalIng.toLowerCase().includes(included)
        )
      ) {
        normalizedIngredients.push({
          name: originalIng,
          quantity: "1",
          unit: "piece",
        });
      }
    });

    return normalizedIngredients;
  }

  /**
   * Valida y normaliza las instrucciones
   */
  private static validateInstructions(instructions: string[]): string[] {
    if (!Array.isArray(instructions) || instructions.length === 0) {
      return [
        "Prepare all ingredients",
        "Cook according to your preference",
        "Serve hot and enjoy!",
      ];
    }

    return instructions.filter(
      (instruction) =>
        typeof instruction === "string" && instruction.trim().length > 0
    );
  }

  /**
   * Valida si una receta tiene todos los campos requeridos
   */
  static isValidRecipe(recipe: RecipeData): boolean {
    return !!(
      recipe.title &&
      recipe.title.trim().length > 0 &&
      recipe.ingredients &&
      Array.isArray(recipe.ingredients) &&
      recipe.ingredients.length > 0 &&
      recipe.instructions &&
      Array.isArray(recipe.instructions) &&
      recipe.instructions.length > 0
    );
  }

  /**
   * Genera una receta de fallback si la validación falla
   */
  static generateFallbackRecipe(
    originalIngredients: string[],
    servings: number,
    customTitle?: string
  ): RecipeData {
    return {
      title: customTitle || "Simple Recipe",
      description: "A delicious dish made with your ingredients",
      ingredients: originalIngredients.map((ing) => ({
        name: ing,
        quantity: "1",
        unit: "piece",
      })),
      instructions: [
        "Prepare all ingredients",
        "Cook according to your preference",
        "Season to taste",
        "Serve hot and enjoy!",
      ],
      cookingTime: "30 minutes",
      prepTime: "15 minutes",
      totalTime: "45 minutes",
      cuisine: "International",
      servings,
      source: "fallback",
    };
  }
}
