/**
 * Utilidades para generación de recetas fallback - Enfoque funcional
 * Divide la lógica compleja de fallback en funciones más pequeñas
 */

import { ParsedRecipe } from "../geminiService";

// Tipos para las funciones utilitarias
interface CuisineStyle {
  cuisine: string;
  style: string;
  method: string;
}

interface FallbackRecipeData {
  title: string;
  description: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  instructions: string[];
  prepTime: string;
  cookingTime: string;
  totalTime: string;
  servings: number;
  cuisine: string;
  source: string;
  id: string;
}

/**
 * Obtiene estilos de cocina aleatorios
 * Función pura que retorna datos de estilos de cocina
 */
export const getCuisineStyles = (): CuisineStyle[] => [
  { cuisine: "Italian", style: "Rustic", method: "Sautéed" },
  { cuisine: "Mexican", style: "Spicy", method: "Grilled" },
  { cuisine: "Asian", style: "Fusion", method: "Stir-fried" },
  { cuisine: "Mediterranean", style: "Fresh", method: "Roasted" },
  { cuisine: "French", style: "Classic", method: "Braised" },
  { cuisine: "Indian", style: "Aromatic", method: "Curried" },
  { cuisine: "Thai", style: "Balanced", method: "Steamed" },
  { cuisine: "Spanish", style: "Traditional", method: "Pan-seared" },
];

/**
 * Selecciona un estilo de cocina aleatorio
 * Función pura que selecciona un estilo basado en random
 */
export const selectRandomCuisineStyle = (): CuisineStyle => {
  const styles = getCuisineStyles();
  return styles[Math.floor(Math.random() * styles.length)];
};

/**
 * Genera métodos de cocción únicos
 * Función pura que retorna métodos de cocción
 */
export const getCookingMethods = (): string[] => [
  "Braised",
  "Grilled",
  "Sautéed",
  "Roasted",
  "Steamed",
  "Fried",
  "Baked",
  "Smoked",
];

/**
 * Selecciona un método de cocción aleatorio
 * Función pura que selecciona un método basado en random
 */
export const selectRandomCookingMethod = (): string => {
  const methods = getCookingMethods();
  return methods[Math.floor(Math.random() * methods.length)];
};

/**
 * Genera ingredientes estructurados para la receta
 * Función pura que transforma ingredientes simples en estructura compleja
 */
export const generateStructuredIngredients = (
  ingredients: string[],
  servings: number
): Array<{ name: string; quantity: string; unit: string }> => {
  return ingredients.map((ingredient, index) => {
    const baseQuantity = Math.max(1, Math.ceil(servings / 2));
    const quantity = baseQuantity + (index % 3); // Variar cantidades

    const units = ["cups", "tbsp", "tsp", "pieces", "cloves", "slices"];
    const unit = units[index % units.length];

    return {
      name: ingredient,
      quantity: quantity.toString(),
      unit,
    };
  });
};

/**
 * Genera instrucciones de cocina
 * Función pura que genera instrucciones basadas en ingredientes y método
 */
export const generateCookingInstructions = (
  ingredients: string[],
  method: string,
  cuisine: string
): string[] => {
  const mainIngredient = ingredients[0] || "ingredients";

  return [
    `Prepare and clean ${mainIngredient} thoroughly`,
    `Heat a large pan over medium-high heat`,
    `Add ${ingredients.slice(0, 2).join(" and ")} to the pan`,
    `${method.toLowerCase()} for 5-7 minutes until golden`,
    `Add remaining ingredients and season to taste`,
    `Cook for an additional 10-15 minutes`,
    `Serve hot with your favorite ${cuisine.toLowerCase()} accompaniments`,
  ];
};

/**
 * Genera tiempos de cocción
 * Función pura que calcula tiempos basados en ingredientes y porciones
 */
export const generateCookingTimes = (servings: number) => {
  const baseTime = Math.max(15, servings * 3);
  const prepTime = Math.max(10, Math.floor(baseTime * 0.4));
  const cookingTime = Math.max(20, Math.floor(baseTime * 0.6));
  const totalTime = prepTime + cookingTime;

  return {
    prepTime: `${prepTime} minutes`,
    cookingTime: `${cookingTime} minutes`,
    totalTime: `${totalTime} minutes`,
  };
};

/**
 * Genera el título de la receta
 * Función pura que crea un título basado en ingredientes y estilo
 */
export const generateRecipeTitle = (
  ingredients: string[],
  style: CuisineStyle
): string => {
  const mainIngredient = ingredients[0] || "Special";
  const adjectives = ["Delicious", "Savory", "Aromatic", "Flavorful", "Hearty"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  return `${adjective} ${style.cuisine} ${mainIngredient} ${style.method}`;
};

/**
 * Genera la descripción de la receta
 * Función pura que crea una descripción basada en ingredientes y estilo
 */
export const generateRecipeDescription = (
  ingredients: string[],
  style: CuisineStyle
): string => {
  const mainIngredient = ingredients[0] || "ingredients";
  return `A ${style.style.toLowerCase()} ${style.cuisine.toLowerCase()} dish featuring ${mainIngredient}, prepared using traditional ${style.method.toLowerCase()} techniques. Perfect for any occasion.`;
};

/**
 * Genera un ID único para la receta
 * Función pura que genera un ID único
 */
export const generateUniqueRecipeId = (): string => {
  return `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
};

/**
 * Construye una receta fallback completa
 * Función pura que combina todas las utilidades para crear una receta
 */
export const buildFallbackRecipe = (
  ingredients: string[],
  servings: number
): FallbackRecipeData => {
  const style = selectRandomCuisineStyle();
  const method = selectRandomCookingMethod();
  const times = generateCookingTimes(servings);

  return {
    title: generateRecipeTitle(ingredients, style),
    description: generateRecipeDescription(ingredients, style),
    ingredients: generateStructuredIngredients(ingredients, servings),
    instructions: generateCookingInstructions(
      ingredients,
      method,
      style.cuisine
    ),
    prepTime: times.prepTime,
    cookingTime: times.cookingTime,
    totalTime: times.totalTime,
    servings,
    cuisine: style.cuisine.toLowerCase(),
    source: "gemini-fallback",
    id: generateUniqueRecipeId(),
  };
};
