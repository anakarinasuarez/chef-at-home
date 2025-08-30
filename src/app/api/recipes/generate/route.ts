import { NextRequest, NextResponse } from "next/server";
import GeminiService from "@/services/geminiService";
import { UnsplashService } from "@/services/unsplashService";

export async function POST(request: NextRequest) {
  let ingredients: string[] = [];
  let servings: number = 2;
  let cuisine: string = "international";
  let difficulty: string = "medium";
  let count: number = 1;

  try {
    const requestData = await request.json();
    ingredients = requestData.ingredients || ingredients;
    servings = requestData.servings || servings;
    cuisine = requestData.cuisine || cuisine;
    difficulty = requestData.difficulty || difficulty;
    count = requestData.count || count;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return NextResponse.json(
        { error: "Ingredients are required and must be an array" },
        { status: 400 }
      );
    }

    if (!servings || servings < 1) {
      return NextResponse.json(
        { error: "Valid servings count is required" },
        { status: 400 }
      );
    }

    const geminiService = new GeminiService();

    let recipes;

    if (count && count > 1) {
      // Generate multiple recipes
      recipes = await geminiService.generateMultipleRecipes(
        ingredients,
        servings,
        count
      );
    } else {
      // Generate single recipe
      const recipe = await geminiService.generateRecipe(
        ingredients,
        servings,
        cuisine,
        difficulty
      );
      recipes = [recipe];
    }

    // Add images to recipes
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const image = await UnsplashService.getRandomFoodImage(recipe.title);
          return { ...recipe, image };
        } catch (error) {
          console.error("Error getting image for recipe:", error);
          return { ...recipe, image: null };
        }
      })
    );

    console.log(
      `Recipes generated with: ${recipesWithImages[0]?.source || "gemini"}`
    );

    return NextResponse.json({
      recipes: recipesWithImages,
      count: recipesWithImages.length,
      source: recipesWithImages[0]?.source || "gemini",
    });
  } catch (error) {
    console.error("Error generating recipe:", error);

    // Fallback to template generation
    try {
      // Usar los parámetros originales en lugar de intentar leer el body de nuevo
      const fallbackRecipes = generateFallbackRecipes(
        ingredients,
        servings,
        count || 1
      );
      return NextResponse.json({
        recipes: fallbackRecipes,
        count: fallbackRecipes.length,
        source: "fallback",
      });
    } catch (fallbackError) {
      console.error("Fallback generation also failed:", fallbackError);
      return NextResponse.json(
        { error: "Failed to generate recipes" },
        { status: 500 }
      );
    }
  }
}

function generateFallbackRecipes(
  ingredients: string[],
  servings: number,
  count: number = 1
): any[] {
  const recipes = [];
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

  for (let i = 0; i < count; i++) {
    const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    const randomDifficulty = ["Easy", "Medium", "Hard"][
      Math.floor(Math.random() * 3)
    ];

    recipes.push({
      title: `${randomCuisine} ${ingredients[0]} Delight ${i + 1}`,
      ingredients: ingredients.map((ing) => ({
        name: ing,
        quantity: Math.ceil(servings / 2) + i,
        unit: "pieces",
      })),
      instructions: [
        `Prepare ${ingredients.join(" and ")}`,
        "Cook with authentic spices",
        "Garnish and serve hot",
      ],
      cookingTime: `${25 + i * 5} minutes`,
      difficulty: randomDifficulty,
      cuisine: randomCuisine,
      servings: servings,
      source: "fallback",
    });
  }

  return recipes;
}
