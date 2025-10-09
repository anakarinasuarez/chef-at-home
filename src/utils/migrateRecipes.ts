/**
 * Migration script to clean up old recipes without userId
 * Run this once to migrate existing data
 */

export const migrateRecipesToUserSpecific = (): void => {
  try {
    console.log('🔄 Starting aggressive recipe migration...');

    const allKeys = Object.keys(localStorage);
    console.log('🔍 All localStorage keys:', allKeys);

    // Find all recipe-related keys
    const recipeKeys = allKeys.filter(
      key =>
        key.startsWith('recipe-') ||
        key.includes('recipe') ||
        key.startsWith('savedRecipes') ||
        key.includes('currentRecipes')
    );

    console.log(`📦 Found ${recipeKeys.length} recipe-related keys:`, recipeKeys);

    // Remove ALL recipe-related keys (they will be recreated with proper userId)
    recipeKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed recipe key: ${key}`);
    });

    // Also clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    const sessionRecipeKeys = sessionKeys.filter(
      key => key.includes('recipe') || key.includes('currentRecipes')
    );

    sessionRecipeKeys.forEach(key => {
      sessionStorage.removeItem(key);
      console.log(`🗑️ Removed session recipe key: ${key}`);
    });

    console.log('✅ Aggressive recipe migration completed');
    console.log('🧹 All recipe data cleared - users will start fresh');
  } catch (error) {
    console.error('❌ Error during recipe migration:', error);
  }
};

// Auto-run migration on import
if (typeof window !== 'undefined') {
  migrateRecipesToUserSpecific();
}
