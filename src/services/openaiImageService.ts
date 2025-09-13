import OpenAI from "openai";
import { UniversalCacheManager } from "@/lib/universal-cache";
import { buildUnifiedImagePrompt } from "@/lib/prompts";

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

// Build prompt for image generation using unified prompt
const buildImagePrompt = (request: RecipeImageRequest): string => {
  return buildUnifiedImagePrompt({
    recipeName: request.recipeName,
    ingredients: request.ingredients,
    cuisine: request.cuisine,
    style: request.style,
  });
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
