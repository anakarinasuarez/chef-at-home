// Export all services
export { AuthService } from "./authService";
export { default as RecipeService } from "./recipeService";

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
