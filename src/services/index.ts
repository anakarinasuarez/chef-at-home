// Export all services
export { 
  registerUser, 
  loginUser, 
  getUserById 
} from "./authService";

export { 
  createRecipe,
  getPublicRecipes,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  generateRecipe,
  generateMultipleRecipes,
  saveRecipe,
  getSavedRecipes
} from "./recipeService";

// Export functional services
export { 
  generateRecipeWithOpenAI, 
  isOpenAIServiceAvailable 
} from "./openaiRecipeService";

export { 
  generateRecipeWithGemini, 
  generateMultipleRecipesWithGemini,
  isGeminiServiceAvailable 
} from "./geminiService";

export { 
  generateRecipeImageWithOpenAI, 
  isOpenAIImageServiceAvailable,
  getAvailableImageModels 
} from "./openaiImageService";
