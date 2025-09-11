import OpenAI from "openai";

export interface RecipeRequest {
  ingredients: string[];
  servings: number;
  cuisine?: string;
  difficulty?: string;
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
  difficulty: string;
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

class OpenAIRecipeService {
  private openai: OpenAI | null = null;
  private isAvailable: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (apiKey) {
        this.openai = new OpenAI({ apiKey });
        this.isAvailable = true;
        console.log("✅ OpenAI Recipe service initialized");
      } else {
        console.warn("⚠️ OPENAI_API_KEY not found, service unavailable");
      }
    } catch (error) {
      console.error("❌ Error initializing OpenAI Recipe service:", error);
    }
  }

  async generateRecipe(request: RecipeRequest): Promise<RecipeResponse> {
    if (!this.isAvailable || !this.openai) {
      throw new Error("OpenAI Recipe service not available");
    }

    try {
      const prompt = this.buildPrompt(request);

      const completion = await this.openai.chat.completions.create({
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

      return this.parseRecipeResponse(response, request.count || 1);
    } catch (error) {
      console.error("Error generating recipe with OpenAI:", error);
      throw error;
    }
  }

  private buildPrompt(request: RecipeRequest): string {
    const { ingredients, servings, cuisine, difficulty } = request;

    let prompt = `Create a delicious recipe using these ingredients: ${ingredients.join(
      ", "
    )}.\n\n`;

    if (servings) {
      prompt += `Servings: ${servings}\n`;
    }

    if (cuisine) {
      prompt += `Cuisine style: ${cuisine}\n`;
    }

    if (difficulty) {
      prompt += `Difficulty level: ${difficulty}\n`;
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
  "difficulty": "easy/medium/hard",
  "cuisine": "cuisine type",
  "servings": ${servings},
  "prepTime": "X minutes",
  "totalTime": "X minutes"
}`;

    return prompt;
  }

  private parseRecipeResponse(response: string, count: number): RecipeResponse {
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
  }

  get isServiceAvailable(): boolean {
    return this.isAvailable;
  }
}

export const openaiRecipeService = new OpenAIRecipeService();
