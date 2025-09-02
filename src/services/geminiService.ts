import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY not configured");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateRecipe(
    ingredients: string[],
    servings: number,
    cuisine: string = "international",
    difficulty: string = "medium"
  ): Promise<any> {
    try {
      const prompt = this.buildRecipePrompt(
        ingredients,
        servings,
        cuisine,
        difficulty
      );

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Raw Gemini response:", text.substring(0, 500) + "...");

      return this.parseRecipeResponse(text, ingredients, servings);
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Gemini API error: ${errorMessage}`);
    }
  }

  async generateMultipleRecipes(
    ingredients: string[],
    servings: number,
    count: number = 4
  ): Promise<any[]> {
    try {
      const recipes = [];

      for (let i = 0; i < count; i++) {
        const cuisine = this.getRandomCuisine();
        const difficulty = this.getRandomDifficulty();

        const recipe = await this.generateRecipe(
          ingredients,
          servings,
          cuisine,
          difficulty
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
  }

  private buildRecipePrompt(
    ingredients: string[],
    servings: number,
    cuisine: string,
    difficulty: string
  ): string {
    const uniqueId = Math.random().toString(36).substr(2, 9);

    // Análisis inteligente de ingredientes
    const proteinIngredients = ingredients.filter((ing) =>
      [
        "chicken",
        "beef",
        "pork",
        "fish",
        "shrimp",
        "salmon",
        "tuna",
        "lamb",
        "turkey",
        "eggs",
        "tofu",
        "tempeh",
      ].some((protein) => ing.toLowerCase().includes(protein))
    );

    const vegetableIngredients = ingredients.filter((ing) =>
      [
        "tomato",
        "onion",
        "garlic",
        "carrot",
        "potato",
        "bell pepper",
        "mushroom",
        "spinach",
        "lettuce",
        "cucumber",
        "zucchini",
        "eggplant",
        "broccoli",
        "cauliflower",
      ].some((veg) => ing.toLowerCase().includes(veg))
    );

    const starchIngredients = ingredients.filter((ing) =>
      [
        "rice",
        "pasta",
        "bread",
        "potato",
        "quinoa",
        "couscous",
        "noodles",
      ].some((starch) => ing.toLowerCase().includes(starch))
    );

    // Determinar tipo de plato basado en ingredientes
    let dishType = "main course";
    if (proteinIngredients.length > 0 && vegetableIngredients.length > 0) {
      dishType = "main course";
    } else if (
      vegetableIngredients.length > 0 &&
      proteinIngredients.length === 0
    ) {
      dishType = "vegetarian main";
    } else if (
      starchIngredients.length > 0 &&
      proteinIngredients.length === 0
    ) {
      dishType = "starch-based dish";
    } else if (
      proteinIngredients.length > 0 &&
      vegetableIngredients.length === 0
    ) {
      dishType = "protein-focused dish";
    }

    // Técnicas de cocina apropiadas para los ingredientes
    const cookingMethods = this.getAppropriateCookingMethods(
      ingredients,
      cuisine
    );
    const randomMethod =
      cookingMethods[Math.floor(Math.random() * cookingMethods.length)];

    // Nombres regionales apropiados para la cocina
    const regionalNames = this.getRegionalNamesForCuisine(cuisine);
    const randomRegion =
      regionalNames[Math.floor(Math.random() * regionalNames.length)];

    // Especias y hierbas apropiadas para la cocina
    const spices = this.getSpicesForCuisine(cuisine);
    const randomSpices = spices.slice(0, 2 + Math.floor(Math.random() * 2));

    return `Create a simple recipe using ${ingredients.join(" and ")}.

Return this exact JSON:
{
  "title": "${randomRegion} ${randomMethod} ${ingredients[0]}",
  "description": "A simple recipe",
  "ingredients": [
    {"name": "${ingredients[0]}", "quantity": "2", "unit": "pieces"},
    {"name": "${ingredients[1] || "oil"}", "quantity": "1", "unit": "tbsp"}
  ],
  "instructions": [
    "Prepare ingredients",
    "Cook ${ingredients[0]}",
    "Add ${ingredients[1] || "seasoning"}",
    "Serve hot"
  ],
  "cookingTime": "20 minutes",
  "difficulty": "${difficulty}",
  "cuisine": "${cuisine}",
  "servings": ${servings},
  "prepTime": "5 minutes",
  "totalTime": "25 minutes"
}`;
  }

  private parseRecipeResponse(
    text: string,
    originalIngredients: string[],
    servings: number
  ): any {
    try {
      // Try to extract JSON from the response with better regex
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let jsonString = jsonMatch[0];

        // Clean up common JSON issues
        jsonString = this.cleanJsonString(jsonString);

        const recipe = JSON.parse(jsonString);

        // Validate and clean the recipe data
        const cleanedRecipe = this.validateAndCleanRecipe(
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

    // Fallback to template if parsing fails
    return this.generateFallbackRecipe(originalIngredients, servings);
  }

  private cleanJsonString(jsonString: string): string {
    // Remove any text before the first {
    jsonString = jsonString.substring(jsonString.indexOf("{"));

    // Remove any text after the last }
    jsonString = jsonString.substring(0, jsonString.lastIndexOf("}") + 1);

    // Fix common JSON issues
    jsonString = jsonString
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, "$1")
      // Fix missing quotes around property names
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      // Fix single quotes to double quotes
      .replace(/'/g, '"')
      // Fix unescaped quotes in strings
      .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1\\"$2\\"$3"')
      // Remove any control characters
      .replace(/[\x00-\x1F\x7F]/g, "");

    return jsonString;
  }

  private validateAndCleanRecipe(
    recipe: any,
    originalIngredients: string[],
    servings: number
  ): any {
    // Ensure all required fields exist
    const cleanedRecipe = {
      title: recipe.title || "Delicious Recipe",
      description:
        recipe.description || "A flavorful dish made with fresh ingredients",
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      cookingTime: recipe.cookingTime || "30 minutes",
      prepTime: recipe.prepTime || "15 minutes",
      totalTime: recipe.totalTime || "45 minutes",
      difficulty: recipe.difficulty || "Medium",
      cuisine: recipe.cuisine || "International",
      servings: recipe.servings || servings,
    };

    // Validate ingredients structure
    if (Array.isArray(cleanedRecipe.ingredients)) {
      cleanedRecipe.ingredients = cleanedRecipe.ingredients.map((ing: any) => ({
        name: ing.name || ing,
        quantity: ing.quantity || "1",
        unit: ing.unit || "piece",
      }));
    } else {
      // If ingredients is not an array, create from original ingredients
      cleanedRecipe.ingredients = originalIngredients.map((ing) => ({
        name: ing,
        quantity: "1",
        unit: "piece",
      }));
    }

    // Ensure all original ingredients are included
    const includedIngredients = cleanedRecipe.ingredients.map((ing: any) =>
      ing.name.toLowerCase()
    );

    originalIngredients.forEach((originalIng) => {
      if (
        !includedIngredients.some(
          (included: string) =>
            included.includes(originalIng.toLowerCase()) ||
            originalIng.toLowerCase().includes(included)
        )
      ) {
        cleanedRecipe.ingredients.push({
          name: originalIng,
          quantity: "1",
          unit: "piece",
        });
      }
    });

    // Validate instructions
    if (
      !Array.isArray(cleanedRecipe.instructions) ||
      cleanedRecipe.instructions.length === 0
    ) {
      cleanedRecipe.instructions = [
        "Prepare all ingredients",
        "Cook according to your preference",
        "Serve hot and enjoy!",
      ];
    }

    // Clean up time formats
    cleanedRecipe.cookingTime = this.cleanTimeFormat(cleanedRecipe.cookingTime);
    cleanedRecipe.prepTime = this.cleanTimeFormat(cleanedRecipe.prepTime);
    cleanedRecipe.totalTime = this.cleanTimeFormat(cleanedRecipe.totalTime);

    return cleanedRecipe;
  }

  private cleanTimeFormat(time: string): string {
    // Extract numbers and ensure proper format
    const timeMatch = time.match(/(\d+)/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      return `${minutes} minutes`;
    }
    return "30 minutes";
  }

  private generateFallbackRecipe(ingredients: string[], servings: number): any {
    const cuisineStyles = [
      { cuisine: "Italian", style: "Rustic", method: "Sautéed" },
      { cuisine: "Mexican", style: "Spicy", method: "Grilled" },
      { cuisine: "Asian", style: "Fusion", method: "Stir-fried" },
      { cuisine: "Mediterranean", style: "Fresh", method: "Roasted" },
      { cuisine: "French", style: "Classic", method: "Braised" },
      { cuisine: "Indian", style: "Aromatic", method: "Curried" },
      { cuisine: "Thai", style: "Balanced", method: "Steamed" },
      { cuisine: "Spanish", style: "Traditional", method: "Pan-seared" },
    ];

    const difficulties = ["Easy", "Medium", "Hard"];
    const randomStyle =
      cuisineStyles[Math.floor(Math.random() * cuisineStyles.length)];
    const randomDifficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    const uniqueId = Math.random().toString(36).substr(2, 6);
    const uniqueMethods = [
      "Braised",
      "Grilled",
      "Sautéed",
      "Roasted",
      "Steamed",
      "Fried",
      "Baked",
      "Smoked",
      "Cured",
      "Pickled",
      "Fermented",
      "Infused",
    ];
    const uniqueMethod =
      uniqueMethods[Math.floor(Math.random() * uniqueMethods.length)];

    const uniqueTitle = `${randomStyle.cuisine} ${uniqueMethod} ${ingredients[0]} ${randomStyle.style} Style`;

    return {
      title: uniqueTitle,
      ingredients: ingredients.map((ing, index) => ({
        name: ing,
        quantity: Math.ceil(servings / 2) + (index % 3),
        unit: index % 2 === 0 ? "pieces" : "gr",
      })),
      instructions: [
        `Prepare and clean ${ingredients.join(", ")}`,
        `${uniqueMethod.toLowerCase()} the ${ingredients[0]} until golden`,
        `Add ${ingredients.slice(1).join(" and ")} and cook for 5-7 minutes`,
        `Season with ${randomStyle.cuisine.toLowerCase()} spices and herbs`,
        "Serve hot with garnish of your choice",
      ],
      cookingTime: `${20 + Math.floor(Math.random() * 20)} minutes`,
      difficulty: randomDifficulty,
      cuisine: randomStyle.cuisine,
      servings: servings,
      source: "gemini-fallback",
      id: `fallback-${uniqueId}`,
    };
  }

  private getRandomCuisine(): string {
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
  }

  private getRandomDifficulty(): string {
    const difficulties = ["Easy", "Medium", "Hard"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  private getAppropriateCookingMethods(
    ingredients: string[],
    cuisine: string
  ): string[] {
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

    // Ajustar métodos basados en ingredientes
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

    let methods = baseMethods[cuisine] || baseMethods["American"];

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

    return methods.slice(0, 5); // Retornar máximo 5 métodos
  }

  private getRegionalNamesForCuisine(cuisine: string): string[] {
    const regionalNames: Record<string, string[]> = {
      Italian: [
        "Tuscan",
        "Sicilian",
        "Lombard",
        "Piedmont",
        "Venetian",
        "Roman",
        "Neapolitan",
        "Calabrian",
      ],
      Mexican: [
        "Oaxacan",
        "Yucatecan",
        "Poblano",
        "Veracruzano",
        "Jalisciense",
        "Tamaulipeco",
      ],
      Asian: [
        "Cantonese",
        "Sichuan",
        "Hunan",
        "Shandong",
        "Fujian",
        "Jiangsu",
        "Zhejiang",
      ],
      Mediterranean: [
        "Provençal",
        "Andalusian",
        "Catalan",
        "Greek",
        "Turkish",
        "Lebanese",
      ],
      American: [
        "Southern",
        "Texan",
        "Californian",
        "New England",
        "Midwestern",
        "Pacific Northwest",
      ],
      French: [
        "Burgundian",
        "Norman",
        "Provençal",
        "Languedoc",
        "Alsacian",
        "Bretagne",
      ],
      Indian: [
        "Punjabi",
        "Bengali",
        "Gujarati",
        "Maharashtrian",
        "Tamil",
        "Kerala",
      ],
      Thai: [
        "Northern",
        "Central",
        "Southern",
        "Isaan",
        "Bangkok",
        "Chiang Mai",
      ],
    };

    return regionalNames[cuisine] || regionalNames["American"];
  }

  private getSpicesForCuisine(cuisine: string): string[] {
    const spices: Record<string, string[]> = {
      Italian: [
        "basil",
        "oregano",
        "rosemary",
        "thyme",
        "sage",
        "parsley",
        "garlic",
        "onion",
        "black pepper",
      ],
      Mexican: [
        "cumin",
        "chili powder",
        "oregano",
        "garlic",
        "onion",
        "cilantro",
        "lime",
        "jalapeño",
      ],
      Asian: [
        "ginger",
        "garlic",
        "soy sauce",
        "sesame oil",
        "star anise",
        "cinnamon",
        "five spice",
      ],
      Mediterranean: [
        "oregano",
        "basil",
        "thyme",
        "rosemary",
        "garlic",
        "olive oil",
        "lemon",
      ],
      American: [
        "garlic",
        "onion",
        "black pepper",
        "paprika",
        "oregano",
        "thyme",
      ],
      French: [
        "thyme",
        "rosemary",
        "tarragon",
        "bay leaves",
        "garlic",
        "shallots",
        "white wine",
      ],
      Indian: [
        "cumin",
        "coriander",
        "turmeric",
        "cardamom",
        "cinnamon",
        "cloves",
        "ginger",
      ],
      Thai: [
        "lemongrass",
        "galangal",
        "fish sauce",
        "lime",
        "basil",
        "mint",
        "chili",
      ],
    };

    return spices[cuisine] || spices["American"];
  }
}

export default GeminiService;
