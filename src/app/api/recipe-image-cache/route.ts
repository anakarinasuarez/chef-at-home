import { getRecipeImageCacheInfo, isRecipeImageCached } from '@/lib/recipe-image-cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing recipeId parameter',
        },
        { status: 400 }
      );
    }

    const isCached = isRecipeImageCached(recipeId);
    const cacheInfo = getRecipeImageCacheInfo(recipeId);

    return NextResponse.json({
      success: true,
      recipeId,
      isCached,
      cacheInfo,
    });
  } catch (error) {
    console.error('Recipe image cache status API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check cache status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
