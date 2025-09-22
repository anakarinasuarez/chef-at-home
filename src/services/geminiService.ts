import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { buildUnifiedRecipePrompt, getSystemPrompt } from "@/lib/prompts";
import { RecipeValidator } from "@/utils";

// Definir tipos específicos para Gemini
interface GeminiClient {
  genAI: GoogleGenerativeAI;
  model: GenerativeModel;
}

// Create Gemini client
const createGeminiClient = (): GeminiClient | null => {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GOOGLE_GEMINI_API_KEY not configured");
      return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("✅ Gemini client created");
    return { genAI, model };
  } catch (error) {
    console.error("❌ Error creating Gemini client:", error);
    return null;
  }
};

// Check if service is available
export const isGeminiServiceAvailable = (): boolean => {
  return !!process.env.GOOGLE_GEMINI_API_KEY;
};

// Get random cuisine
const getRandomCuisine = (): string => {
  const cuisines = [
    "Italian",
    "Mexican",
    "Asian",
    "Mediterranean",
    "American",
    "French",
    "Indian",
    "Thai",
  ];
  return cuisines[Math.floor(Math.random() * cuisines.length)];
};

// Get appropriate cooking methods
const getAppropriateCookingMethods = (
  ingredients: string[],
  cuisine: string
): string[] => {
  const baseMethods: Record<string, string[]> = {
    Italian: ["Sautéed", "Braised", "Roasted", "Grilled", "Baked"],
    Mexican: ["Grilled", "Sautéed", "Braised", "Roasted", "Fried"],
    Asian: ["Stir-fried", "Steamed", "Braised", "Grilled", "Deep-fried"],
    Mediterranean: ["Grilled", "Roasted", "Sautéed", "Baked", "Braised"],
    American: ["Grilled", "Baked", "Roasted", "Sautéed", "Fried"],
    French: ["Braised", "Sautéed", "Roasted", "Baked", "Grilled"],
    Indian: ["Curried", "Tandoori", "Sautéed", "Braised", "Steamed"],
    Thai: ["Stir-fried", "Curried", "Grilled", "Steamed", "Deep-fried"],
  };

  let methods = baseMethods[cuisine] || baseMethods["American"];

  // Adjust methods based on ingredients
  const hasFish = ingredients.some((ing) =>
    ["fish", "salmon", "tuna", "shrimp", "seafood"].some((fish) =>
      ing.toLowerCase().includes(fish)
    )
  );

  const hasChicken = ingredients.some((ing) =>
    ing.toLowerCase().includes("chicken")
  );

  const hasVegetables = ingredients.some((ing) =>
    [
      "tomato",
      "onion",
      "garlic",
      "carrot",
      "potato",
      "bell pepper",
      "mushroom",
      "spinach",
    ].some((veg) => ing.toLowerCase().includes(veg))
  );

  if (hasFish) {
    methods = methods.filter(
      (m: string) => !["Deep-fried", "Tandoori"].includes(m)
    );
    methods.unshift("Pan-seared", "Steamed");
  }

  if (hasChicken) {
    methods = methods.filter((m: string) => !["Deep-fried"].includes(m));
    methods.unshift("Grilled", "Roasted");
  }

  if (hasVegetables) {
    methods.unshift("Sautéed", "Roasted");
  }

  return methods.slice(0, 5);
};

// Get regional names for cuisine
const getRegionalNamesForCuisine = (cuisine: string): string[] => {
  const regionalNames: Record<string, string[]> = {
    Italian: [
      "Tuscan",
      "Sicilian",
      "Lombard",
      "Piedmont",
      "Venetian",
      "Roman",
      "Neapolitan",
    ],
    Mexican: ["Oaxacan", "Yucatecan", "Poblano", "Veracruzano", "Jalisciense"],
    Asian: ["Cantonese", "Sichuan", "Hunan", "Shandong", "Fujian"],
    Mediterranean: ["Provençal", "Andalusian", "Catalan", "Greek", "Turkish"],
    American: ["Southern", "Texan", "Californian", "New England", "Midwestern"],
    French: ["Burgundian", "Norman", "Provençal", "Languedoc", "Alsacian"],
    Indian: ["Punjabi", "Bengali", "Gujarati", "Maharashtrian", "Tamil"],
    Thai: ["Northern", "Central", "Southern", "Isaan", "Bangkok"],
  };

  return regionalNames[cuisine] || regionalNames["American"];
};

// Get spices for cuisine
const getSpicesForCuisine = (cuisine: string): string[] => {
  const spices: Record<string, string[]> = {
    Italian: ["basil", "oregano", "rosemary", "thyme", "garlic", "onion"],
    Mexican: ["cumin", "chili powder", "oregano", "garlic", "cilantro", "lime"],
    Asian: ["ginger", "garlic", "soy sauce", "sesame oil", "star anise"],
    Mediterranean: [
      "oregano",
      "basil",
      "thyme",
      "rosemary",
      "garlic",
      "olive oil",
    ],
    American: ["garlic", "onion", "black pepper", "paprika", "oregano"],
    French: ["thyme", "rosemary", "tarragon", "bay leaves", "garlic"],
    Indian: [
      "cumin",
      "coriander",
      "turmeric",
      "cardamom",
      "cinnamon",
      "ginger",
    ],
    Thai: ["lemongrass", "galangal", "fish sauce", "lime", "basil", "mint"],
  };

  return spices[cuisine] || spices["American"];
};

// Get additional ingredients for cuisine
const getAdditionalIngredientsForCuisine = (
  cuisine: string,
  mainIngredients: string[]
): string[] => {
  const additionalIngredients: Record<string, string[]> = {
    Italian: [
      "extra virgin olive oil",
      "balsamic vinegar",
      "parmesan cheese",
      "white wine",
      "fresh herbs",
    ],
    Mexican: [
      "corn tortillas",
      "black beans",
      "queso fresco",
      "lime juice",
      "cilantro",
    ],
    Asian: [
      "soy sauce",
      "fish sauce",
      "sesame oil",
      "rice vinegar",
      "bamboo shoots",
    ],
    Mediterranean: [
      "feta cheese",
      "kalamata olives",
      "hummus",
      "tahini",
      "chickpeas",
    ],
    American: [
      "cheddar cheese",
      "bacon",
      "barbecue sauce",
      "hot sauce",
      "corn",
    ],
    French: ["dijon mustard", "shallots", "white wine", "butter", "cream"],
    Indian: ["basmati rice", "naan bread", "yogurt", "coconut milk", "lentils"],
    Thai: [
      "coconut milk",
      "fish sauce",
      "palm sugar",
      "kaffir lime leaves",
      "peanuts",
    ],
  };

  const baseIngredients =
    additionalIngredients[cuisine] || additionalIngredients["American"];
  return baseIngredients.filter(
    (ing) =>
      !mainIngredients.some(
        (main) =>
          main.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(main.toLowerCase())
      )
  );
};

// Generate detailed instructions
const generateDetailedInstructions = (
  ingredients: string[],
  cuisine: string,
  cookingMethod: string
): string[] => {
  const baseInstructions = [
    `Prepare and clean all ${ingredients.join(", ")}`,
    `Heat oil in a large pan over medium heat`,
    `Add ${ingredients[0]} and cook until golden brown`,
    `Add remaining ingredients and continue cooking`,
    `Season with ${cuisine.toLowerCase()} spices and herbs`,
    "Serve hot with garnish and enjoy!",
  ];

  const cuisineSpecificInstructions: Record<string, string[]> = {
    Italian: [
      "Heat extra virgin olive oil in a large skillet",
      `Sauté ${ingredients[0]} until golden and fragrant`,
      "Add garlic and herbs, cook for 1 minute",
      "Deglaze with white wine if using",
      "Finish with fresh herbs and parmesan cheese",
    ],
    Mexican: [
      "Heat oil in a comal or large skillet",
      `Cook ${ingredients[0]} until well browned`,
      "Add onions and peppers, cook until softened",
      "Season with Mexican spices and lime juice",
      "Garnish with fresh cilantro and serve with tortillas",
    ],
    Asian: [
      "Heat wok or large skillet over high heat",
      `Stir-fry ${ingredients[0]} until seared`,
      "Add aromatics (ginger, garlic) and cook briefly",
      "Add sauce and remaining ingredients",
      "Finish with sesame oil and green onions",
    ],
    Mediterranean: [
      "Heat olive oil in a large pan",
      `Cook ${ingredients[0]} until golden`,
      "Add Mediterranean vegetables and herbs",
      "Simmer with wine or broth if needed",
      "Finish with lemon juice and fresh herbs",
    ],
  };

  return cuisineSpecificInstructions[cuisine] || baseInstructions;
};

// Build recipe prompt
const buildRecipePrompt = (
  ingredients: string[],
  servings: number,
  cuisine: string
): string => {
  return buildUnifiedRecipePrompt({
    ingredients,
    servings,
    cuisine,
  });
};

// Clean JSON string
const cleanJsonString = (jsonString: string): string => {
  jsonString = jsonString.substring(jsonString.indexOf("{"));
  jsonString = jsonString.substring(0, jsonString.lastIndexOf("}") + 1);

  jsonString = jsonString
    .replace(/,(\s*[}\]])/g, "$1")
    .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
    .replace(/'/g, '"')
    .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1\\"$2\\"$3"')
    .replace(/[\x00-\x1F\x7F]/g, "");

  return jsonString;
};

// Usar la función centralizada de RecipeValidator
const cleanTimeFormat = RecipeValidator.cleanTimeFormat;

// Usar la función centralizada de RecipeValidator
const validateAndCleanRecipe = RecipeValidator.validateAndCleanRecipe;

// Definir tipo para respuesta de receta parseada
interface ParsedRecipe {
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

// Parse recipe response
const parseRecipeResponse = (
  text: string,
  originalIngredients: string[],
  servings: number
): ParsedRecipe | null => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      let jsonString = jsonMatch[0];
      jsonString = cleanJsonString(jsonString);
      const recipe = JSON.parse(jsonString);
      const cleanedRecipe = validateAndCleanRecipe(
        recipe,
        originalIngredients,
        servings
      );

      return {
        ...cleanedRecipe,
        source: "gemini",
        originalIngredients,
        servings,
      };
    }
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    console.error("Raw response:", text);
  }

  return generateFallbackRecipe(originalIngredients, servings);
};

// Importar utilidades de fallback
import { buildFallbackRecipe } from "./utils/fallbackRecipeUtils";

// Generate fallback recipe - Refactorizada usando funciones utilitarias
const generateFallbackRecipe = (
  ingredients: string[],
  servings: number
): ParsedRecipe => {
  console.log("🔄 Using fallback recipe generation");
  return buildFallbackRecipe(ingredients, servings);
};

// Generate single recipe
export const generateRecipeWithGemini = async (
  ingredients: string[],
  servings: number,
  cuisine: string = "international"
): Promise<ParsedRecipe | null> => {
  const client = createGeminiClient();

  if (!client) {
    throw new Error("Gemini service not available");
  }

  try {
    const prompt = buildRecipePrompt(ingredients, servings, cuisine);
    const systemPrompt = getSystemPrompt("gemini");
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    const result = await client.model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw Gemini response:", text.substring(0, 500) + "...");
    return parseRecipeResponse(text, ingredients, servings);
  } catch (error) {
    console.error("Gemini API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Gemini API error: ${errorMessage}`);
  }
};

// Generate multiple recipes
export const generateMultipleRecipesWithGemini = async (
  ingredients: string[],
  servings: number,
  count: number = 4
): Promise<ParsedRecipe[]> => {
  try {
    const recipes = [];

    for (let i = 0; i < count; i++) {
      const cuisine = getRandomCuisine();
      const recipe = await generateRecipeWithGemini(
        ingredients,
        servings,
        cuisine
      );
      recipes.push(recipe);

      // Small delay to avoid rate limiting
      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return recipes;
  } catch (error) {
    console.error("Error generating multiple recipes:", error);
    throw error;
  }
};
