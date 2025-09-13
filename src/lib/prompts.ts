// Unified prompts for recipe and image generation across all AI models

export interface RecipePromptParams {
  ingredients: string[];
  servings: number;
  cuisine?: string;
}

export interface ImagePromptParams {
  recipeName: string;
  ingredients: string[];
  cuisine?: string;
  style?: "photorealistic" | "artistic" | "minimalist" | "gourmet";
}

// Unified recipe generation prompt
export const buildUnifiedRecipePrompt = (
  params: RecipePromptParams
): string => {
  const { ingredients, servings, cuisine = "international" } = params;

  return `You are a world-class professional chef with deep expertise in ${cuisine} cuisine. 
Create a unique, realistic recipe using these main ingredients: ${ingredients.join(", ")}.

🎯 CORE REQUIREMENTS:
- Recipe must be ORIGINAL and practical for home cooking
- Use authentic ${cuisine} cooking methods, flavors, and traditions
- Suggest complementary ingredients that pair well with the main ones
- Adjust portions to serve exactly ${servings} people
- Provide precise ingredient quantities and realistic cooking times
- Use accessible ingredients available in most grocery stores
- Instructions must be clear, professional, and step-by-step

📋 RECIPE STRUCTURE:
- Title: Creative, descriptive name inspired by ${cuisine}
- Description: Appealing explanation of flavors and inspiration
- Ingredients: List with name, quantity, and unit
- OptionalIngredients: Small set of suggested extras with explanation
- Instructions: Detailed, numbered cooking steps with timings
- Timing: Prep, cooking, and total time
- Cuisine: ${cuisine}
- Servings: ${servings}

🌟 QUALITY STANDARDS:
- Maintain authentic seasoning and spice combinations
- Keep instructions clear and realistic for home cooks
- Ensure the final dish feels both special and achievable

Return ONLY valid JSON in this format:
{
  "title": "Creative ${cuisine} Recipe Name",
  "description": "Compelling description of the dish",
  "ingredients": [
    {"name": "ingredient name", "quantity": "100", "unit": "g"}
  ],
  "optionalIngredients": [
    {"name": "optional ingredient", "reason": "why it improves the dish"}
  ],
  "instructions": [
    "Step 1...",
    "Step 2..."
  ],
  "prepTime": "XX minutes",
  "cookingTime": "XX minutes",
  "totalTime": "XX minutes",
  "cuisine": "${cuisine}",
  "servings": ${servings}
}`;
};

// Unified image generation prompt
export const buildUnifiedImagePrompt = (params: ImagePromptParams): string => {
  const { recipeName, ingredients, cuisine, style = "photorealistic" } = params;

  const mainIngredients = ingredients.slice(0, 3).join(", ");
  const cuisineText = cuisine ? `, ${cuisine} cuisine` : "";

  let stylePrompt = "";
  switch (style) {
    case "photorealistic":
      stylePrompt =
        "ultra-realistic food photography, professional studio lighting, 8K resolution, hyper-detailed, restaurant quality presentation, natural textures, authentic colors, mouth-watering appearance, perfect plating, natural lighting, realistic shadows, fresh ingredients, appetizing aroma, delicious appearance, high-end restaurant quality";
      break;
    case "artistic":
      stylePrompt =
        "artistic food illustration, watercolor style, elegant composition, soft lighting, artistic interpretation";
      break;
    case "minimalist":
      stylePrompt =
        "minimalist food presentation, clean background, simple composition, modern plating, elegant simplicity";
      break;
    case "gourmet":
      stylePrompt =
        "gourmet restaurant presentation, fine dining, elegant plating, sophisticated styling, luxury food photography";
      break;
  }

  return `A stunning, mouth-watering ${recipeName} dish featuring ${mainIngredients}${cuisineText}. ${stylePrompt}, natural food photography, authentic home cooking, realistic lighting, natural colors, home kitchen setting, warm lighting, natural shadows, fresh ingredients, appetizing presentation, food styling, professional food photography, high-end restaurant quality, natural textures, authentic colors, detailed ingredients, appetizing aroma, delicious appearance, perfect plating, natural lighting, realistic shadows, fresh ingredients, natural colors, authentic presentation, culinary artistry, gastronomic excellence`;
};

// System prompts for different AI models
export const getSystemPrompt = (model: "openai" | "gemini"): string => {
  const basePrompt =
    "You are a world-class professional chef and culinary expert with extensive knowledge of international cuisines, cooking techniques, and food science. You create exceptional, authentic recipes that are both delicious and practical for home cooking.";

  switch (model) {
    case "openai":
      return `${basePrompt} Always respond with valid JSON format and ensure all recipes are unique and creative.`;
    case "gemini":
      return `${basePrompt} Focus on authentic cultural cooking methods and provide detailed, step-by-step instructions. Always respond with valid JSON format.`;
    default:
      return basePrompt;
  }
};

// Fallback recipe prompt for when AI services are unavailable
export const buildFallbackRecipePrompt = (
  params: RecipePromptParams
): string => {
  const { ingredients, servings, cuisine = "international" } = params;

  return `Create a simple, delicious ${cuisine} recipe using: ${ingredients.join(
    ", "
  )}. 
Serve ${servings} people. Include basic ingredients and simple cooking instructions.`;
};
