import { z } from "zod";

// Esquema para ingredientes
export const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, "Ingredient name is required")
    .max(100, "Ingredient name must be less than 100 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .max(50, "Amount must be less than 50 characters"),
  unit: z
    .string()
    .max(20, "Unit must be less than 20 characters")
    .optional(),
});

// Esquema para pasos de preparación
export const stepSchema = z.object({
  step: z
    .number()
    .int()
    .positive("Step number must be positive"),
  instruction: z
    .string()
    .min(1, "Instruction is required")
    .max(1000, "Instruction must be less than 1000 characters"),
});

// Esquema para información nutricional
export const nutritionSchema = z.object({
  calories: z
    .number()
    .int()
    .min(0, "Calories cannot be negative")
    .max(10000, "Calories must be less than 10000")
    .optional(),
  protein: z
    .number()
    .min(0, "Protein cannot be negative")
    .max(1000, "Protein must be less than 1000g")
    .optional(),
  carbs: z
    .number()
    .min(0, "Carbs cannot be negative")
    .max(1000, "Carbs must be less than 1000g")
    .optional(),
  fat: z
    .number()
    .min(0, "Fat cannot be negative")
    .max(1000, "Fat must be less than 1000g")
    .optional(),
});

// Esquema para crear/editar receta
export const recipeSchema = z.object({
  title: z
    .string()
    .min(1, "Recipe title is required")
    .min(3, "Recipe title must be at least 3 characters")
    .max(200, "Recipe title must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  servings: z
    .number()
    .int()
    .min(1, "Servings must be at least 1")
    .max(50, "Servings must be less than 50"),
  cookingTime: z
    .string()
    .min(1, "Cooking time is required")
    .max(50, "Cooking time must be less than 50 characters"),
  difficulty: z
    .enum(["easy", "medium", "hard"], {
      errorMap: () => ({ message: "Difficulty must be easy, medium, or hard" }),
    })
    .default("medium"),
  cuisine: z
    .string()
    .max(50, "Cuisine must be less than 50 characters")
    .optional(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required")
    .max(50, "Maximum 50 ingredients allowed"),
  instructions: z
    .array(stepSchema)
    .min(1, "At least one instruction is required")
    .max(20, "Maximum 20 instructions allowed"),
  nutrition: nutritionSchema.optional(),
  tags: z
    .array(z.string().max(30, "Tag must be less than 30 characters"))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional(),
  source: z
    .string()
    .max(100, "Source must be less than 100 characters")
    .optional(),
});

// Esquema para generar recetas (más flexible)
export const generateRecipeSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .min(10, "Prompt must be at least 10 characters")
    .max(500, "Prompt must be less than 500 characters"),
  cuisine: z
    .string()
    .max(50, "Cuisine must be less than 50 characters")
    .optional(),
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .optional(),
  servings: z
    .number()
    .int()
    .min(1, "Servings must be at least 1")
    .max(20, "Servings must be less than 20")
    .optional(),
  cookingTime: z
    .string()
    .max(50, "Cooking time must be less than 50 characters")
    .optional(),
  dietaryRestrictions: z
    .array(z.string().max(50, "Dietary restriction must be less than 50 characters"))
    .max(5, "Maximum 5 dietary restrictions allowed")
    .optional(),
});

// Esquema para búsqueda de recetas
export const searchRecipeSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query must be less than 100 characters"),
  cuisine: z
    .string()
    .max(50, "Cuisine must be less than 50 characters")
    .optional(),
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .optional(),
  maxCookingTime: z
    .number()
    .int()
    .min(1, "Max cooking time must be at least 1 minute")
    .max(480, "Max cooking time must be less than 8 hours")
    .optional(),
  tags: z
    .array(z.string().max(30, "Tag must be less than 30 characters"))
    .max(5, "Maximum 5 tags allowed")
    .optional(),
});

// Esquema para actualizar receta (parcial)
export const updateRecipeSchema = recipeSchema.partial().extend({
  id: z.string().min(1, "Recipe ID is required"),
});

// Tipos TypeScript inferidos
export type Recipe = z.infer<typeof recipeSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Nutrition = z.infer<typeof nutritionSchema>;
export type GenerateRecipeInput = z.infer<typeof generateRecipeSchema>;
export type SearchRecipeInput = z.infer<typeof searchRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
