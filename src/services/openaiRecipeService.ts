import OpenAI from "openai";

export interface RecipeRequest {
  ingredients: string[];
  servings: number;
  cuisine?: string;
  count?: number;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
  cookingTime: string;
  cuisine: string;
  servings: number;
  prepTime?: string;
  totalTime?: string;
}

export interface RecipeResponse {
  recipes: Recipe[];
  count: number;
  source: string;
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
export const isOpenAIServiceAvailable = (): boolean => {
  return !!process.env.OPENAI_API_KEY;
};

// Build prompt for recipe generation
const buildRecipePrompt = (request: RecipeRequest): string => {
  const { ingredients, servings, cuisine } = request;

  let prompt = `Create a delicious recipe using these ingredients: ${ingredients.join(
    ", "
  )}.\n\n`;

  if (servings) {
    prompt += `Servings: ${servings}\n`;
  }

  if (cuisine) {
    prompt += `Cuisine style: ${cuisine}\n`;
  }

  prompt += `\nPlease provide a complete recipe in JSON format with the following structure:
{
  "title": "Recipe Name",
  "description": "Brief description of the dish",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount", "unit": "unit"}
  ],
  "instructions": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "cookingTime": "X minutes",
  "cuisine": "cuisine type",
  "servings": ${servings},
  "prepTime": "X minutes",
  "totalTime": "X minutes"
}`;

  return prompt;
};

// Parse OpenAI response
const parseRecipeResponse = (response: string, count: number): RecipeResponse => {
  try {
    // Clean the response to extract JSON
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
      response.match(/```\s*([\s\S]*?)\s*```/) || [null, response];

    const jsonString = jsonMatch[1] || response;
    const recipeData = JSON.parse(jsonString);

    // Ensure it's an array
    const recipes = Array.isArray(recipeData) ? recipeData : [recipeData];

    return {
      recipes: recipes.slice(0, count),
      count: recipes.length,
      source: "openai-gpt4",
    };
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    console.log("Raw response:", response);
    throw new Error("Failed to parse recipe response");
  }
};

// Generate recipe using OpenAI
export const generateRecipeWithOpenAI = async (
  request: RecipeRequest
): Promise<RecipeResponse> => {
  const openai = createOpenAIClient();
  
  if (!openai) {
    throw new Error("OpenAI Recipe service not available");
  }

  try {
    const prompt = buildRecipePrompt(request);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef and recipe developer. Generate creative, detailed, and delicious recipes based on the provided ingredients. Always respond with valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    return parseRecipeResponse(response, request.count || 1);
  } catch (error) {
    console.error("Error generating recipe with OpenAI:", error);
    throw error;
  }
};
