/**
 * Manual cleanup script for debugging
 * Run this in browser console to clean all recipe data
 */

export const manualCleanup = () => {
  console.log('🧹 Manual cleanup started...');

  // Clear localStorage
  const allKeys = Object.keys(localStorage);
  console.log('📦 All localStorage keys:', allKeys);

  const recipeKeys = allKeys.filter(
    key =>
      key.startsWith('recipe-') ||
      key.includes('recipe') ||
      key.startsWith('savedRecipes') ||
      key.includes('currentRecipes') ||
      key.includes('auth') ||
      key.includes('user')
  );

  console.log('🗑️ Keys to remove:', recipeKeys);

  recipeKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed: ${key}`);
  });

  // Clear sessionStorage
  const sessionKeys = Object.keys(sessionStorage);
  const sessionRecipeKeys = sessionKeys.filter(
    key => key.includes('recipe') || key.includes('currentRecipes')
  );

  sessionRecipeKeys.forEach(key => {
    sessionStorage.removeItem(key);
    console.log(`✅ Removed session: ${key}`);
  });

  console.log('🎉 Manual cleanup completed!');
  console.log('🔄 Please refresh the page');
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).manualCleanup = manualCleanup;
  console.log('🛠️ Manual cleanup available as window.manualCleanup()');
}
