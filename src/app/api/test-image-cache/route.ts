import { testImageCache } from '@/lib/test-image-cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Running image cache tests...');

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];

    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    // Run tests
    await testImageCache();

    // Restore original console.log
    console.log = originalLog;

    return NextResponse.json({
      success: true,
      message: 'Image cache tests completed',
      logs: logs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Image cache test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Image cache tests failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
