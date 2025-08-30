import { NextRequest, NextResponse } from "next/server";
import { UnsplashService } from "@/services/unsplashService";

export async function POST(request: NextRequest) {
  try {
    const { recipeTitle, count = 1, ingredients } = await request.json();

    if (!recipeTitle) {
      return NextResponse.json(
        { error: "Recipe title is required" },
        { status: 400 }
      );
    }

    // Use ingredients for better image matching if available
    let searchQuery = recipeTitle;
    if (ingredients && ingredients.length > 0) {
      // Create a more specific search query using the main ingredient
      const mainIngredient = ingredients[0].toLowerCase();
      const secondaryIngredient = ingredients[1] || "";

      if (secondaryIngredient) {
        searchQuery = `${mainIngredient} ${secondaryIngredient} food photography`;
      } else {
        searchQuery = `${mainIngredient} food photography`;
      }
    } else {
      searchQuery = `${recipeTitle} food photography`;
    }

    // Get image from Unsplash (server-side)
    const imageUrl = await UnsplashService.getRandomFoodImage(searchQuery);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);

    // Return fallback image if there's an error
    const fallbackImage = UnsplashService.getFallbackImage();
    return NextResponse.json({ imageUrl: fallbackImage });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const count = parseInt(searchParams.get("count") || "10");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Search for multiple images (server-side)
    const images = await UnsplashService.searchFoodImages(query, count);
    const imageUrls = images.map((img) => img.urls.regular);

    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error("Error searching Unsplash images:", error);

    // Return fallback images if there's an error
    const fallbackImages = Array(count).fill(
      UnsplashService.getFallbackImage()
    );
    return NextResponse.json({ images: fallbackImages });
  }
}
