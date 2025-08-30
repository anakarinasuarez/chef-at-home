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

      return this.parseRecipeResponse(text, ingredients, servings);
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error(`Gemini API error: ${error.message}`);
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
    const cookingMethods = [
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
    const randomMethod =
      cookingMethods[Math.floor(Math.random() * cookingMethods.length)];

    const regionalNames = [
      "Tuscan",
      "Sicilian",
      "Provençal",
      "Bavarian",
      "Andalusian",
      "Lombard",
      "Catalan",
      "Burgundian",
      "Norman",
      "Languedoc",
      "Piedmont",
      "Venetian",
    ];
    const randomRegion =
      regionalNames[Math.floor(Math.random() * regionalNames.length)];

    return `Generate a completely unique ${cuisine} recipe using these ingredients: ${ingredients.join(
      ", "
    )}. 
    
Requirements:
- Servings: ${servings} people
- Difficulty: ${difficulty}
- Must use ALL the provided ingredients
- Create a UNIQUE and CREATIVE title using:
  * Regional names like "${randomRegion}"
  * Cooking techniques like "${randomMethod}"
  * Specific ingredient combinations
  * NEVER use generic words like "Delight", "Special", "Creation", "Style", "Delicious"
- Make each recipe completely different from others
- Recipe ID: ${uniqueId}
- Format as JSON with this structure:
{
  "title": "Unique Regional Recipe Name",
  "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
  "instructions": ["detailed step 1", "detailed step 2", "detailed step 3"],
  "cookingTime": "X minutes",
  "difficulty": "${difficulty}",
  "cuisine": "${cuisine}",
  "servings": ${servings}
}

Be extremely creative with the title and ensure this recipe is completely unique!`;
  }

  private parseRecipeResponse(
    text: string,
    originalIngredients: string[],
    servings: number
  ): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recipe = JSON.parse(jsonMatch[0]);
        return {
          ...recipe,
          source: "gemini",
          originalIngredients,
          servings,
        };
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
    }

    // Fallback to template if parsing fails
    return this.generateFallbackRecipe(originalIngredients, servings);
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
}

export default GeminiService;
