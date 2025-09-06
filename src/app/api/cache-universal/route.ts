import { NextRequest, NextResponse } from "next/server";
import { UniversalCacheManager } from "@/lib/universal-cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "stats":
        const stats = await UniversalCacheManager.getCacheStats();
        return NextResponse.json({
          success: true,
          stats,
          provider: UniversalCacheManager.getCurrentProvider(),
        });

      case "clear":
        const clearType = searchParams.get("type") || "all";

        if (clearType === "recipes") {
          await UniversalCacheManager.clearRecipesCache();
        } else if (clearType === "images") {
          await UniversalCacheManager.clearImagesCache();
        } else {
          await UniversalCacheManager.clearAllCache();
        }

        return NextResponse.json({
          success: true,
          message: `Cache cleared: ${clearType}`,
          provider: UniversalCacheManager.getCurrentProvider(),
        });

      case "clean":
        const cleanedCount = await UniversalCacheManager.cleanExpiredItems();
        return NextResponse.json({
          success: true,
          message: `Cleaned ${cleanedCount} expired items`,
          cleanedCount,
          provider: UniversalCacheManager.getCurrentProvider(),
        });

      case "init":
        await UniversalCacheManager.initialize();
        return NextResponse.json({
          success: true,
          message: "Cache manager initialized",
          provider: UniversalCacheManager.getCurrentProvider(),
        });

      case "get":
        const type = searchParams.get("type");
        const ingredientsParam = searchParams.get("ingredients");
        const servingsParam = searchParams.get("servings");

        if (type === "recipes" && ingredientsParam && servingsParam) {
          try {
            const ingredients = JSON.parse(
              decodeURIComponent(ingredientsParam)
            );
            const servings = parseInt(servingsParam);
            const cachedRecipes = await UniversalCacheManager.getCachedRecipes(
              ingredients,
              servings
            );

            if (cachedRecipes) {
              return NextResponse.json({
                success: true,
                recipes: cachedRecipes,
                provider: UniversalCacheManager.getCurrentProvider(),
              });
            } else {
              return NextResponse.json({
                success: false,
                message: "No cached recipes found",
              });
            }
          } catch (error) {
            return NextResponse.json({
              success: false,
              message: "Error parsing parameters",
            });
          }
        }

        if (type === "image" && ingredientsParam) {
          const recipeName = searchParams.get("recipeName");
          if (recipeName) {
            try {
              const ingredients = JSON.parse(
                decodeURIComponent(ingredientsParam)
              );
              const cachedImage = await UniversalCacheManager.getCachedImage(
                recipeName,
                ingredients
              );

              if (cachedImage) {
                return NextResponse.json({
                  success: true,
                  imageUrl: cachedImage,
                  provider: UniversalCacheManager.getCurrentProvider(),
                });
              } else {
                return NextResponse.json({
                  success: false,
                  message: "No cached image found",
                });
              }
            } catch (error) {
              return NextResponse.json({
                success: false,
                message: "Error parsing parameters",
              });
            }
          }
        }

        return NextResponse.json({
          success: false,
          message: "Invalid get parameters",
        });

      default:
        return NextResponse.json({
          success: false,
          message: "Invalid action. Use: stats, clear, clean, init, get",
        });
    }
  } catch (error) {
    console.error("Cache API error:", error);
    return NextResponse.json({
      success: false,
      message: "Cache operation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "cache-recipes":
        const { ingredients, servings, recipes, ttl } = data;
        await UniversalCacheManager.cacheRecipes(
          ingredients,
          servings,
          recipes,
          ttl
        );
        return NextResponse.json({
          success: true,
          message: "Recipes cached successfully",
          provider: UniversalCacheManager.getCurrentProvider(),
        });

      case "cache-image":
        const {
          recipeName,
          ingredients: imgIngredients,
          imageUrl,
          ttl: imageTtl,
        } = data;
        await UniversalCacheManager.cacheImage(
          recipeName,
          imgIngredients,
          imageUrl,
          imageTtl
        );
        return NextResponse.json({
          success: true,
          message: "Image cached successfully",
          provider: UniversalCacheManager.getCurrentProvider(),
        });

      case "force-provider":
        const { provider } = data;
        UniversalCacheManager.forceProvider(provider);
        return NextResponse.json({
          success: true,
          message: `Provider forced to: ${provider}`,
          provider: UniversalCacheManager.getCurrentProvider(),
        });

      default:
        return NextResponse.json({
          success: false,
          message: "Invalid action",
        });
    }
  } catch (error) {
    console.error("Cache API error:", error);
    return NextResponse.json({
      success: false,
      message: "Cache operation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
