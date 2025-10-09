'use client';

import { useEffect } from 'react';

/**
 * Component that runs aggressive cleanup on client-side
 * This ensures all old recipe data is removed
 */
export const RecipeCleanup = () => {
  useEffect(() => {
    const cleanupRecipes = () => {
      try {
        console.log('🧹 Running aggressive recipe cleanup...');

        // Clear localStorage
        const allKeys = Object.keys(localStorage);
        const recipeKeys = allKeys.filter(
          key =>
            key.startsWith('recipe-') ||
            key.includes('recipe') ||
            key.startsWith('savedRecipes') ||
            key.includes('currentRecipes')
        );

        recipeKeys.forEach(key => {
          localStorage.removeItem(key);
          console.log(`🗑️ Cleaned localStorage key: ${key}`);
        });

        // Clear sessionStorage
        const sessionKeys = Object.keys(sessionStorage);
        const sessionRecipeKeys = sessionKeys.filter(
          key => key.includes('recipe') || key.includes('currentRecipes')
        );

        sessionRecipeKeys.forEach(key => {
          sessionStorage.removeItem(key);
          console.log(`🗑️ Cleaned sessionStorage key: ${key}`);
        });

        console.log('✅ Aggressive cleanup completed');
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      }
    };

    // Run cleanup immediately
    cleanupRecipes();

    // Also run cleanup when window loads (in case of race conditions)
    const handleLoad = () => {
      setTimeout(cleanupRecipes, 100);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return null; // This component doesn't render anything
};
