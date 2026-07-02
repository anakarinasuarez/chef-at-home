import { buildUnifiedRecipePrompt, getSystemPrompt } from '@/lib/prompts';
import { RecipeValidator } from '@/utils';
import { GoogleGenAI, Type } from '@google/genai';
import { buildFallbackRecipe } from './utils/fallbackRecipeUtils';

const MODEL = 'gemini-2.5-flash';

const getApiKey = (): string | undefined =>
  process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Create a Gemini client using the current @google/genai SDK.
const createGeminiClient = (): GoogleGenAI | null => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn('⚠️ GOOGLE_GEMINI_API_KEY not configured');
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error('❌ Error creating Gemini client:', error);
    return null;
  }
};

// Check if service is available
export const isGeminiServiceAvailable = (): boolean => !!getApiKey();

// Get random cuisine (used to vary generated recipes)
const getRandomCuisine = (): string => {
  const cuisines = [
    'Italian',
    'Mexican',
    'Asian',
    'Mediterranean',
    'American',
    'French',
    'Indian',
    'Thai',
  ];
  return cuisines[Math.floor(Math.random() * cuisines.length)];
};

// Structured-output schema — guarantees valid JSON, no fragile parsing.
const recipeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          quantity: { type: Type.STRING },
          unit: { type: Type.STRING },
        },
        required: ['name', 'quantity', 'unit'],
        propertyOrdering: ['name', 'quantity', 'unit'],
      },
    },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    prepTime: { type: Type.STRING },
    cookingTime: { type: Type.STRING },
    totalTime: { type: Type.STRING },
    servings: { type: Type.NUMBER },
    cuisine: { type: Type.STRING },
  },
  required: [
    'title',
    'description',
    'ingredients',
    'instructions',
    'cookingTime',
    'servings',
    'cuisine',
  ],
  propertyOrdering: [
    'title',
    'description',
    'ingredients',
    'instructions',
    'prepTime',
    'cookingTime',
    'totalTime',
    'servings',
    'cuisine',
  ],
};

// Build recipe prompt
const buildRecipePrompt = (
  ingredients: string[],
  servings: number,
  cuisine: string
): string => buildUnifiedRecipePrompt({ ingredients, servings, cuisine });

const validateAndCleanRecipe = RecipeValidator.validateAndCleanRecipe;

// Parsed recipe shape returned to callers
export interface ParsedRecipe {
  title: string;
  description: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  instructions: string[];
  prepTime: string;
  cookingTime: string;
  totalTime: string;
  servings: number;
  cuisine: string;
  image?: string;
  source: string;
}

// Parse a (schema-constrained) JSON response into a validated recipe.
const parseRecipeResponse = (
  text: string,
  originalIngredients: string[],
  servings: number
): ParsedRecipe | null => {
  try {
    // responseSchema guarantees JSON; fall back to extraction just in case.
    let raw = text.trim();
    if (!raw.startsWith('{')) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) raw = match[0];
    }
    const recipe = JSON.parse(raw);
    const cleaned = validateAndCleanRecipe(recipe, originalIngredients, servings);
    return { ...cleaned, source: 'gemini', servings } as ParsedRecipe;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return generateFallbackRecipe(originalIngredients, servings);
  }
};

// Deterministic fallback when the model/service is unavailable.
const generateFallbackRecipe = (
  ingredients: string[],
  servings: number
): ParsedRecipe => buildFallbackRecipe(ingredients, servings);

// Generate a single recipe with Gemini 2.5 Flash (free tier).
export const generateRecipeWithGemini = async (
  ingredients: string[],
  servings: number,
  cuisine: string = 'international'
): Promise<ParsedRecipe | null> => {
  const ai = createGeminiClient();
  if (!ai) {
    throw new Error('Gemini service not available');
  }

  try {
    const prompt = buildRecipePrompt(ingredients, servings, cuisine);
    const systemPrompt = getSystemPrompt('gemini');

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: recipeResponseSchema,
        temperature: 0.9,
      },
    });

    const text = response.text ?? '';
    return parseRecipeResponse(text, ingredients, servings);
  } catch (error) {
    console.error('Gemini API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gemini API error: ${message}`);
  }
};

// Generate multiple recipes (varied cuisines).
export const generateMultipleRecipesWithGemini = async (
  ingredients: string[],
  servings: number,
  count: number = 4
): Promise<ParsedRecipe[]> => {
  if (!isGeminiServiceAvailable()) {
    throw new Error('Gemini service not available');
  }
  const recipes = await Promise.all(
    Array.from({ length: count }, () =>
      generateRecipeWithGemini(ingredients, servings, getRandomCuisine()).catch(
        err => {
          console.error('Error generating recipe variant:', err);
          return null;
        }
      )
    )
  );

  return recipes.filter((r): r is ParsedRecipe => r !== null);
};
