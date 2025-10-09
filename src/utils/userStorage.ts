/**
 * User-specific storage utilities
 * Handles separation of data by user ID
 */

export class UserStorageManager {
  /**
   * Clear all recipes from other users when switching users
   */
  static clearOtherUsersRecipes(currentUserId: string): void {
    try {
      const allKeys = Object.keys(localStorage);
      const recipeKeys = allKeys.filter(key => key.startsWith('recipe-'));

      // Remove recipes that don't belong to current user
      recipeKeys.forEach(key => {
        if (!key.includes(`-${currentUserId}-`)) {
          localStorage.removeItem(key);
          console.log(`🗑️ Removed recipe from other user: ${key}`);
        }
      });

      console.log(`🧹 Cleaned up recipes for user: ${currentUserId}`);
    } catch (error) {
      console.error('Error clearing other users recipes:', error);
    }
  }

  /**
   * Get all recipe keys for a specific user
   */
  static getUserRecipeKeys(userId: string): string[] {
    try {
      const allKeys = Object.keys(localStorage);
      return allKeys.filter(key => key.startsWith(`recipe-${userId}-`));
    } catch (error) {
      console.error('Error getting user recipe keys:', error);
      return [];
    }
  }

  /**
   * Get recipe count for a specific user
   */
  static getUserRecipeCount(userId: string): number {
    return this.getUserRecipeKeys(userId).length;
  }
}
