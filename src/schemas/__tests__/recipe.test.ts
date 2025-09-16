import { describe, it, expect } from "vitest";
import {
  ingredientSchema,
  stepSchema,
  nutritionSchema,
  recipeSchema,
  generateRecipeSchema,
  searchRecipeSchema,
  updateRecipeSchema,
} from "../recipe";

describe("recipe schemas", () => {
  describe("ingredientSchema", () => {
    it("validates correct ingredient data", () => {
      const validData = {
        name: "Chicken breast",
        amount: "500g",
        unit: "grams",
      };

      const result = ingredientSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("validates ingredient without unit", () => {
      const validData = {
        name: "Salt",
        amount: "1 tsp",
      };

      const result = ingredientSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects empty name", () => {
      const invalidData = {
        name: "",
        amount: "500g",
        unit: "grams",
      };

      const result = ingredientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Ingredient name is required"
        );
      }
    });

    it("rejects name longer than 100 characters", () => {
      const invalidData = {
        name: "a".repeat(101),
        amount: "500g",
        unit: "grams",
      };

      const result = ingredientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Ingredient name must be less than 100 characters"
        );
      }
    });

    it("rejects empty amount", () => {
      const invalidData = {
        name: "Chicken breast",
        amount: "",
        unit: "grams",
      };

      const result = ingredientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Amount is required");
      }
    });

    it("rejects amount longer than 50 characters", () => {
      const invalidData = {
        name: "Chicken breast",
        amount: "a".repeat(51),
        unit: "grams",
      };

      const result = ingredientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Amount must be less than 50 characters"
        );
      }
    });

    it("rejects unit longer than 20 characters", () => {
      const invalidData = {
        name: "Chicken breast",
        amount: "500g",
        unit: "a".repeat(21),
      };

      const result = ingredientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Unit must be less than 20 characters"
        );
      }
    });
  });

  describe("stepSchema", () => {
    it("validates correct step data", () => {
      const validData = {
        step: 1,
        instruction: "Heat oil in a large pan over medium heat",
      };

      const result = stepSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects zero step number", () => {
      const invalidData = {
        step: 0,
        instruction: "Heat oil in a large pan over medium heat",
      };

      const result = stepSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Step number must be positive"
        );
      }
    });

    it("rejects negative step number", () => {
      const invalidData = {
        step: -1,
        instruction: "Heat oil in a large pan over medium heat",
      };

      const result = stepSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Step number must be positive"
        );
      }
    });

    it("rejects empty instruction", () => {
      const invalidData = {
        step: 1,
        instruction: "",
      };

      const result = stepSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Instruction is required");
      }
    });

    it("rejects instruction longer than 1000 characters", () => {
      const invalidData = {
        step: 1,
        instruction: "a".repeat(1001),
      };

      const result = stepSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Instruction must be less than 1000 characters"
        );
      }
    });
  });

  describe("nutritionSchema", () => {
    it("validates correct nutrition data", () => {
      const validData = {
        calories: 350,
        protein: 25.5,
        carbs: 15.2,
        fat: 12.8,
      };

      const result = nutritionSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("validates partial nutrition data", () => {
      const validData = {
        calories: 350,
      };

      const result = nutritionSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects negative calories", () => {
      const invalidData = {
        calories: -10,
      };

      const result = nutritionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Calories cannot be negative"
        );
      }
    });

    it("rejects calories over 10000", () => {
      const invalidData = {
        calories: 10001,
      };

      const result = nutritionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Calories must be less than 10000"
        );
      }
    });

    it("rejects negative protein", () => {
      const invalidData = {
        protein: -5,
      };

      const result = nutritionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Protein cannot be negative"
        );
      }
    });
  });

  describe("recipeSchema", () => {
    const validRecipeData = {
      title: "Chicken Rice Bowl",
      description: "A delicious and healthy meal",
      servings: 4,
      cookingTime: "30 minutes",
      difficulty: "medium" as const,
      cuisine: "international",
      ingredients: [
        {
          name: "Chicken breast",
          amount: "500g",
          unit: "grams",
        },
        {
          name: "Rice",
          amount: "2 cups",
          unit: "cups",
        },
      ],
      instructions: [
        {
          step: 1,
          instruction: "Cook the rice according to package instructions",
        },
        {
          step: 2,
          instruction: "Season and cook the chicken breast",
        },
      ],
      nutrition: {
        calories: 350,
        protein: 25.5,
      },
      tags: ["healthy", "quick"],
      image: "https://example.com/image.jpg",
      source: "Chef at Home",
    };

    it("validates correct recipe data", () => {
      const result = recipeSchema.safeParse(validRecipeData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validRecipeData);
      }
    });

    it("validates recipe with minimal required fields", () => {
      const minimalData = {
        title: "Simple Recipe",
        servings: 2,
        cookingTime: "15 minutes",
        ingredients: [
          {
            name: "Salt",
            amount: "1 tsp",
          },
        ],
        instructions: [
          {
            step: 1,
            instruction: "Add salt to taste",
          },
        ],
      };

      const result = recipeSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Simple Recipe");
        expect(result.data.difficulty).toBe("medium"); // default value
      }
    });

    it("rejects empty title", () => {
      const invalidData = {
        ...validRecipeData,
        title: "",
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Recipe title is required");
      }
    });

    it("rejects title shorter than 3 characters", () => {
      const invalidData = {
        ...validRecipeData,
        title: "AB",
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Recipe title must be at least 3 characters"
        );
      }
    });

    it("rejects title longer than 200 characters", () => {
      const invalidData = {
        ...validRecipeData,
        title: "a".repeat(201),
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Recipe title must be less than 200 characters"
        );
      }
    });

    it("rejects zero servings", () => {
      const invalidData = {
        ...validRecipeData,
        servings: 0,
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Servings must be at least 1"
        );
      }
    });

    it("rejects servings over 50", () => {
      const invalidData = {
        ...validRecipeData,
        servings: 51,
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Servings must be less than 50"
        );
      }
    });

    it("rejects invalid difficulty", () => {
      const invalidData = {
        ...validRecipeData,
        difficulty: "very-hard" as any,
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Difficulty must be easy, medium, or hard"
        );
      }
    });

    it("rejects empty ingredients array", () => {
      const invalidData = {
        ...validRecipeData,
        ingredients: [],
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "At least one ingredient is required"
        );
      }
    });

    it("rejects too many ingredients", () => {
      const invalidData = {
        ...validRecipeData,
        ingredients: Array.from({ length: 51 }, (_, i) => ({
          name: `Ingredient ${i + 1}`,
          amount: "1",
        })),
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Maximum 50 ingredients allowed"
        );
      }
    });

    it("rejects empty instructions array", () => {
      const invalidData = {
        ...validRecipeData,
        instructions: [],
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "At least one instruction is required"
        );
      }
    });

    it("rejects too many instructions", () => {
      const invalidData = {
        ...validRecipeData,
        instructions: Array.from({ length: 21 }, (_, i) => ({
          step: i + 1,
          instruction: `Step ${i + 1}`,
        })),
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Maximum 20 instructions allowed"
        );
      }
    });

    it("rejects invalid image URL", () => {
      const invalidData = {
        ...validRecipeData,
        image: "not-a-url",
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Image must be a valid URL"
        );
      }
    });

    it("rejects too many tags", () => {
      const invalidData = {
        ...validRecipeData,
        tags: Array.from({ length: 11 }, (_, i) => `tag${i + 1}`),
      };

      const result = recipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Maximum 10 tags allowed");
      }
    });
  });

  describe("generateRecipeSchema", () => {
    it("validates correct generate recipe data", () => {
      const validData = {
        prompt: "Create a healthy chicken recipe",
        cuisine: "italian",
        difficulty: "easy" as const,
        servings: 4,
        cookingTime: "30 minutes",
        dietaryRestrictions: ["gluten-free", "dairy-free"],
      };

      const result = generateRecipeSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("validates minimal generate recipe data", () => {
      const minimalData = {
        prompt: "Create a simple recipe",
      };

      const result = generateRecipeSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(minimalData);
      }
    });

    it("rejects empty prompt", () => {
      const invalidData = {
        prompt: "",
      };

      const result = generateRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Prompt is required");
      }
    });

    it("rejects prompt shorter than 10 characters", () => {
      const invalidData = {
        prompt: "short",
      };

      const result = generateRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Prompt must be at least 10 characters"
        );
      }
    });

    it("rejects prompt longer than 500 characters", () => {
      const invalidData = {
        prompt: "a".repeat(501),
      };

      const result = generateRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Prompt must be less than 500 characters"
        );
      }
    });

    it("rejects too many dietary restrictions", () => {
      const invalidData = {
        prompt: "Create a healthy recipe",
        dietaryRestrictions: Array.from(
          { length: 6 },
          (_, i) => `restriction${i + 1}`
        ),
      };

      const result = generateRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Maximum 5 dietary restrictions allowed"
        );
      }
    });
  });

  describe("searchRecipeSchema", () => {
    it("validates correct search recipe data", () => {
      const validData = {
        query: "chicken pasta",
        cuisine: "italian",
        difficulty: "medium" as const,
        maxCookingTime: 60,
        tags: ["quick", "healthy"],
      };

      const result = searchRecipeSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("validates minimal search recipe data", () => {
      const minimalData = {
        query: "pasta",
      };

      const result = searchRecipeSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(minimalData);
      }
    });

    it("rejects empty query", () => {
      const invalidData = {
        query: "",
      };

      const result = searchRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Search query is required");
      }
    });

    it("rejects query longer than 100 characters", () => {
      const invalidData = {
        query: "a".repeat(101),
      };

      const result = searchRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Search query must be less than 100 characters"
        );
      }
    });

    it("rejects maxCookingTime over 480 minutes", () => {
      const invalidData = {
        query: "slow cooker",
        maxCookingTime: 481,
      };

      const result = searchRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Max cooking time must be less than 8 hours"
        );
      }
    });

    it("rejects too many tags", () => {
      const invalidData = {
        query: "recipe",
        tags: Array.from({ length: 6 }, (_, i) => `tag${i + 1}`),
      };

      const result = searchRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Maximum 5 tags allowed");
      }
    });
  });

  describe("updateRecipeSchema", () => {
    it("validates correct update recipe data", () => {
      const validData = {
        id: "recipe-123",
        title: "Updated Recipe Title",
        servings: 6,
      };

      const result = updateRecipeSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects empty id", () => {
      const invalidData = {
        id: "",
        title: "Updated Recipe Title",
      };

      const result = updateRecipeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Recipe ID is required");
      }
    });

    it("validates empty update data", () => {
      const validData = {
        id: "recipe-123",
      };

      const result = updateRecipeSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });
});
