/**
 * Utility functions for ingredient processing and deduplication
 */

export interface Ingredient {
  name: string;
  quantity: number | string;
  unit: string;
}

/**
 * Removes duplicate ingredients by name (case-insensitive)
 * If duplicates are found, combines their quantities
 */
export function deduplicateIngredients(ingredients: Ingredient[]): Ingredient[] {
  const ingredientMap = new Map<string, Ingredient>();

  for (const ingredient of ingredients) {
    const normalizedName = ingredient.name.toLowerCase().trim();

    if (ingredientMap.has(normalizedName)) {
      // Combine quantities if ingredient already exists
      const existing = ingredientMap.get(normalizedName)!;
      const existingQuantity =
        typeof existing.quantity === 'number'
          ? existing.quantity
          : parseFloat(existing.quantity) || 0;
      const newQuantity =
        typeof ingredient.quantity === 'number'
          ? ingredient.quantity
          : parseFloat(ingredient.quantity) || 0;

      ingredientMap.set(normalizedName, {
        ...existing,
        quantity: existingQuantity + newQuantity,
        // Keep the unit from the first occurrence
      });
    } else {
      // Add new ingredient
      ingredientMap.set(normalizedName, {
        ...ingredient,
        name: ingredient.name.trim(), // Clean up whitespace
      });
    }
  }

  return Array.from(ingredientMap.values());
}

/**
 * Removes duplicate ingredients by name (case-insensitive) - returns with numeric quantities
 * If duplicates are found, combines their quantities
 */
export function deduplicateIngredientsNumeric(
  ingredients: Array<{ name: string; quantity: number; unit: string }>
): Array<{ name: string; quantity: number; unit: string }> {
  const ingredientMap = new Map<string, { name: string; quantity: number; unit: string }>();

  for (const ingredient of ingredients) {
    const normalizedName = ingredient.name.toLowerCase().trim();

    if (ingredientMap.has(normalizedName)) {
      // Combine quantities if ingredient already exists
      const existing = ingredientMap.get(normalizedName)!;

      ingredientMap.set(normalizedName, {
        ...existing,
        quantity: existing.quantity + ingredient.quantity,
        // Keep the unit from the first occurrence
      });
    } else {
      // Add new ingredient
      ingredientMap.set(normalizedName, {
        ...ingredient,
        name: ingredient.name.trim(), // Clean up whitespace
      });
    }
  }

  return Array.from(ingredientMap.values());
}

/**
 * Normalizes ingredient names for better comparison
 */
export function normalizeIngredientName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, ''); // Remove special characters except spaces
}

/**
 * Checks if two ingredients are the same (case-insensitive)
 */
export function areIngredientsSame(ingredient1: Ingredient, ingredient2: Ingredient): boolean {
  return normalizeIngredientName(ingredient1.name) === normalizeIngredientName(ingredient2.name);
}

/**
 * Filters out ingredients that are already present in the main ingredients list
 */
export function filterDuplicateIngredients(
  mainIngredients: Ingredient[],
  additionalIngredients: Ingredient[]
): Ingredient[] {
  const mainNames = new Set(mainIngredients.map(ing => normalizeIngredientName(ing.name)));

  return additionalIngredients.filter(ing => !mainNames.has(normalizeIngredientName(ing.name)));
}
