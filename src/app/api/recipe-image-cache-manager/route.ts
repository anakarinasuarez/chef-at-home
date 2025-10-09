import {
  cleanExpiredRecipeImages,
  clearAllCachedRecipeImages,
  getAllCachedRecipeImageIds,
  getRecipeImageCacheStats,
  removeCachedRecipeImage,
  updateCachedRecipeImage,
} from '@/lib/recipe-image-cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = getRecipeImageCacheStats();
        return NextResponse.json({
          success: true,
          stats,
          message: 'Recipe image cache statistics retrieved',
        });

      case 'clean':
        const cleanedCount = cleanExpiredRecipeImages();
        return NextResponse.json({
          success: true,
          cleanedCount,
          message: `Cleaned ${cleanedCount} expired recipe images`,
        });

      case 'clear':
        clearAllCachedRecipeImages();
        return NextResponse.json({
          success: true,
          message: 'All cached recipe images cleared',
        });

      case 'ids':
        const ids = getAllCachedRecipeImageIds();
        return NextResponse.json({
          success: true,
          ids,
          count: ids.length,
          message: 'Cached recipe image IDs retrieved',
        });

      default:
        // Return general info
        const generalStats = getRecipeImageCacheStats();
        return NextResponse.json({
          success: true,
          stats: generalStats,
          availableActions: ['stats', 'clean', 'clear', 'ids'],
          message: 'Recipe image cache management endpoint',
        });
    }
  } catch (error) {
    console.error('Recipe image cache API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Recipe image cache operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, recipeId, imageUrl, recipeName, ingredients } = body;

    switch (action) {
      case 'clean':
        const cleanedCount = cleanExpiredRecipeImages();
        return NextResponse.json({
          success: true,
          cleanedCount,
          message: `Cleaned ${cleanedCount} expired recipe images`,
        });

      case 'clear':
        clearAllCachedRecipeImages();
        return NextResponse.json({
          success: true,
          message: 'All cached recipe images cleared',
        });

      case 'remove':
        if (!recipeId) {
          return NextResponse.json(
            {
              success: false,
              message: 'Missing recipeId',
            },
            { status: 400 }
          );
        }
        removeCachedRecipeImage(recipeId);
        return NextResponse.json({
          success: true,
          message: `Removed cached image for recipe ${recipeId}`,
        });

      case 'update':
        if (!recipeId || !imageUrl) {
          return NextResponse.json(
            {
              success: false,
              message: 'Missing recipeId or imageUrl',
            },
            { status: 400 }
          );
        }
        updateCachedRecipeImage(recipeId, imageUrl, recipeName, ingredients);
        return NextResponse.json({
          success: true,
          message: `Updated cached image for recipe ${recipeId}`,
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use: clean, clear, remove, update',
        });
    }
  } catch (error) {
    console.error('Recipe image cache API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Recipe image cache operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
