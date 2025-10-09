import { z } from 'zod';

// Esquema para la generación de recetas
export const generateRecipeRequestSchema = z.object({
  ingredients: z
    .array(z.string().min(1, 'Ingredient cannot be empty').max(100, 'Ingredient name too long'))
    .min(1, 'At least one ingredient is required')
    .max(20, 'Maximum 20 ingredients allowed'),
  servings: z
    .number()
    .int()
    .min(1, 'Servings must be at least 1')
    .max(20, 'Servings must be less than 20')
    .default(2),
  cuisine: z.string().max(50, 'Cuisine must be less than 50 characters').default('international'),
  count: z
    .number()
    .int()
    .min(1, 'Count must be at least 1')
    .max(5, 'Maximum 5 recipes can be generated at once')
    .default(1),
  title: z.string().max(200, 'Title must be less than 200 characters').optional(),
  userId: z.string().min(1, 'User ID is required for session tracking').optional(),
});

// Esquema para la respuesta de generación de recetas
export const generateRecipeResponseSchema = z.object({
  recipes: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          quantity: z.union([z.string(), z.number()]),
          unit: z.string().optional(),
        })
      ),
      instructions: z.array(z.string()),
      cookingTime: z.string(),
      prepTime: z.string().optional(),
      totalTime: z.string().optional(),
      cuisine: z.string().optional(),
      servings: z.number(),
      source: z.string(),
      image: z.string().optional(),
      imageSource: z.string().optional(),
    })
  ),
  count: z.number().int().min(0),
  source: z.string(),
});

// Tipos TypeScript inferidos
export type GenerateRecipeRequest = z.infer<typeof generateRecipeRequestSchema>;
export type GenerateRecipeResponse = z.infer<typeof generateRecipeResponseSchema>;
