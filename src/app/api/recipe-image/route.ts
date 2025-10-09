import { getRecipeImage, regenerateRecipeImage } from '@/services/recipeImageService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');
    const recipeName = searchParams.get('recipeName');
    const ingredients = searchParams.get('ingredients');
    const cuisine = searchParams.get('cuisine') || 'international';
    const style = searchParams.get('style') || 'photorealistic';
    const regenerate = searchParams.get('regenerate') === 'true';

    if (!recipeId || !recipeName || !ingredients) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required parameters: recipeId, recipeName, ingredients',
        },
        { status: 400 }
      );
    }

    const ingredientsArray = JSON.parse(ingredients);

    const requestData = {
      recipeId,
      recipeName,
      ingredients: ingredientsArray,
      cuisine,
      style: style as 'photorealistic' | 'artistic' | 'minimalist' | 'gourmet',
    };

    let imageUrl: string | null;

    if (regenerate) {
      imageUrl = await regenerateRecipeImage(requestData);
    } else {
      imageUrl = await getRecipeImage(requestData);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      recipeId,
      cached: !regenerate,
    });
  } catch (error) {
    console.error('Recipe image API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get recipe image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      recipeId,
      recipeName,
      ingredients,
      cuisine = 'international',
      style = 'photorealistic',
      regenerate = false,
    } = body;

    if (!recipeId || !recipeName || !ingredients) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: recipeId, recipeName, ingredients',
        },
        { status: 400 }
      );
    }

    const requestData = {
      recipeId,
      recipeName,
      ingredients,
      cuisine,
      style,
    };

    let imageUrl: string | null;

    if (regenerate) {
      imageUrl = await regenerateRecipeImage(requestData);
    } else {
      imageUrl = await getRecipeImage(requestData);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      recipeId,
      cached: !regenerate,
    });
  } catch (error) {
    console.error('Recipe image API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get recipe image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
