import OpenAI from "openai";
import { UniversalCacheManager } from "@/lib/universal-cache";

export interface RecipeImageRequest {
  recipeName: string;
  ingredients: string[];
  cuisine?: string;
  style?: "photorealistic" | "artistic" | "minimalist" | "gourmet";
}

// Create OpenAI client
const createOpenAIClient = (): OpenAI | null => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      console.log("✅ OpenAI client created");
      return new OpenAI({ apiKey });
    } else {
      console.warn("⚠️ OPENAI_API_KEY not found, service unavailable");
      return null;
    }
  } catch (error) {
    console.error("❌ Error creating OpenAI client:", error);
    return null;
  }
};

// Check if service is available
export const isOpenAIImageServiceAvailable = (): boolean => {
  return !!process.env.OPENAI_API_KEY;
};

// Build prompt for image generation
const buildImagePrompt = (request: RecipeImageRequest): string => {
  const {
    recipeName,
    ingredients,
    cuisine,
    style = "photorealistic",
  } = request;

  const mainIngredients = ingredients.slice(0, 3).join(", ");
  const cuisineText = cuisine ? `, ${cuisine} cuisine` : "";

  let stylePrompt = "";
  switch (style) {
    case "photorealistic":
      stylePrompt =
        "ultra-realistic food photography, professional studio lighting, 8K resolution, hyper-detailed, restaurant quality presentation, natural textures, authentic colors, mouth-watering appearance, perfect plating, natural lighting, realistic shadows, fresh ingredients, appetizing aroma, delicious appearance, high-end restaurant quality";
      break;
    case "artistic":
      stylePrompt = "artistic food illustration, watercolor style, elegant";
      break;
    case "minimalist":
      stylePrompt = "minimalist food presentation, clean background, simple";
      break;
    case "gourmet":
      stylePrompt =
        "gourmet restaurant presentation, fine dining, elegant plating";
      break;
  }

  return `A mouth-watering ${recipeName} dish featuring ${mainIngredients}${cuisineText}. ${stylePrompt}, natural food photography, authentic home cooking, realistic lighting, natural colors, home kitchen setting, warm lighting, natural shadows, fresh ingredients, appetizing presentation, food styling, professional food photography, high-end restaurant quality, natural textures, authentic colors, detailed ingredients, appetizing aroma, delicious appearance, perfect plating, natural lighting, realistic shadows, fresh ingredients, natural colors, authentic presentation`;
};

// Generate recipe image using OpenAI
export const generateRecipeImageWithOpenAI = async (
  request: RecipeImageRequest
): Promise<string | null> => {
  const openai = createOpenAIClient();
  
  if (!openai) {
    console.warn("OpenAI service not available");
    return null;
  }

  try {
    // Check if image is already cached using UniversalCacheManager
    try {
      const cachedImage = await UniversalCacheManager.getCachedImage(
        request.recipeName,
        request.ingredients
      );

      if (cachedImage) {
        console.log(`📦 Using cached image for: ${request.recipeName}`);
        return cachedImage;
      }
    } catch (error) {
      console.log("No cached image found, generating new one");
    }

    const prompt = buildImagePrompt(request);

    console.log(`🎨 Generating image with DALL-E for: ${request.recipeName}`);
    console.log(`📝 Prompt: ${prompt}`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    });

    console.log(`📊 Response received:`, JSON.stringify(response, null, 2));

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;
      console.log(`✅ DALL-E image generated for: ${request.recipeName}`);
      console.log(`🔗 Image URL: ${imageUrl}`);

      // Cache the image URL using UniversalCacheManager
      if (imageUrl) {
        try {
          await UniversalCacheManager.cacheImage(
            request.recipeName,
            request.ingredients,
            imageUrl
          );
          console.log(`💾 Image cached for: ${request.recipeName}`);
        } catch (error) {
          console.error("Error caching image:", error);
        }
      }

      return imageUrl || null;
    }

    console.log(`❌ No image data in response`);
    return null;
  } catch (error) {
    console.error("Error generating image with DALL-E:", error);
    return null;
  }
};

// Get available models
export const getAvailableImageModels = (): string[] => {
  return ["dall-e-3", "dall-e-2"];
};
