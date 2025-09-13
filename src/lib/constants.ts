// API Endpoints
export const API_ENDPOINTS = {
  RECIPES: {
    GENERATE: "/api/recipes/generate",
    BY_ID: (id: string) => `/api/recipes/${id}`,
    PUBLIC: "/api/recipes/public",
    USER: "/api/recipes/user",
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  IMAGES: {
    GENERATE: "/api/images/generate",
    PLATE: "/api/images/plate",
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  CURRENT_RECIPES: "currentRecipes",
  SAVED_RECIPES: (userId: string) => `savedRecipes_${userId}`,
  RECIPE_CACHE: (recipeId: string) => `recipe-${recipeId}`,
  USER_TOKEN: "userToken",
  USER_DATA: "userData",
} as const;

// Default Values
export const DEFAULTS = {
  RECIPE_COUNT: 4,
  SERVINGS: 4,
  COOKING_TIME: "30 minutes",
  PREP_TIME: "15 minutes",
  TOTAL_TIME: "45 minutes",
  CUISINE: "international",
  IMAGE_STYLE: "photorealistic" as const,
} as const;

// Animation Durations
export const ANIMATIONS = {
  RECIPE_REMOVE: 500,
  NOTIFICATION_DURATION: 3000,
  PAGE_TRANSITION: 300,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to continue.",
  RECIPE_NOT_FOUND: "Recipe not found.",
  GENERATION_FAILED: "Failed to generate recipes. Please try again.",
  SAVE_FAILED: "Failed to save recipe. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  RECIPE_SAVED: "Recipe saved to favorites!",
  RECIPE_REMOVED: "Recipe removed from favorites",
  RECIPE_DELETED: "Recipe deleted successfully",
  RECIPE_SHARED: "Recipe shared successfully",
} as const;

// Image Styles
export const IMAGE_STYLES = {
  PHOTOREALISTIC: "photorealistic",
  ARTISTIC: "artistic",
  MINIMALIST: "minimalist",
  GOURMET: "gourmet",
} as const;

// Cuisine Types
export const CUISINE_TYPES = [
  "international",
  "italian",
  "mexican",
  "asian",
  "mediterranean",
  "american",
  "french",
  "indian",
  "thai",
] as const;

// Recipe Sources
export const RECIPE_SOURCES = {
  AI_GENERATED: "ai-generated",
  USER_CREATED: "user-created",
  FALLBACK: "fallback",
} as const;
