import {
  cleanExpiredImages,
  clearAllCachedImages,
  getAllCachedImageKeys,
  getImageCacheStats,
} from '@/lib/server-image-cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = getImageCacheStats();
        return NextResponse.json({
          success: true,
          stats,
          message: 'Image cache statistics retrieved',
        });

      case 'clean':
        const cleanedCount = cleanExpiredImages();
        return NextResponse.json({
          success: true,
          cleanedCount,
          message: `Cleaned ${cleanedCount} expired images`,
        });

      case 'clear':
        clearAllCachedImages();
        return NextResponse.json({
          success: true,
          message: 'All cached images cleared',
        });

      case 'keys':
        const keys = getAllCachedImageKeys();
        return NextResponse.json({
          success: true,
          keys,
          count: keys.length,
          message: 'Cached image keys retrieved',
        });

      default:
        // Return general info
        const generalStats = getImageCacheStats();
        return NextResponse.json({
          success: true,
          stats: generalStats,
          availableActions: ['stats', 'clean', 'clear', 'keys'],
          message: 'Image cache management endpoint',
        });
    }
  } catch (error) {
    console.error('Image cache API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Image cache operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'clean':
        const cleanedCount = cleanExpiredImages();
        return NextResponse.json({
          success: true,
          cleanedCount,
          message: `Cleaned ${cleanedCount} expired images`,
        });

      case 'clear':
        clearAllCachedImages();
        return NextResponse.json({
          success: true,
          message: 'All cached images cleared',
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use: clean, clear',
        });
    }
  } catch (error) {
    console.error('Image cache API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Image cache operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
