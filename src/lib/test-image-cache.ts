/**
 * Test script for image cache functionality
 * Run this to verify that the image cache is working properly
 */

import {
  cacheImage,
  cleanExpiredImages,
  clearAllCachedImages,
  getCachedImage,
  getImageCacheStats,
} from '@/lib/server-image-cache';

async function testImageCache() {
  console.log('🧪 Starting Image Cache Tests...\n');

  // Test 1: Cache an image
  console.log('Test 1: Caching an image...');
  const testRecipeName = 'Test Recipe';
  const testIngredients = ['chicken', 'rice', 'vegetables'];
  const testImageUrl = 'https://example.com/test-image.jpg';

  cacheImage(testRecipeName, testIngredients, testImageUrl, 3600); // 1 hour TTL
  console.log('✅ Image cached successfully\n');

  // Test 2: Retrieve cached image
  console.log('Test 2: Retrieving cached image...');
  const cachedImage = getCachedImage(testRecipeName, testIngredients);

  if (cachedImage === testImageUrl) {
    console.log('✅ Cached image retrieved correctly');
  } else {
    console.log('❌ Failed to retrieve cached image');
  }
  console.log('');

  // Test 3: Test with different ingredients (should not find)
  console.log('Test 3: Testing with different ingredients...');
  const differentIngredients = ['beef', 'pasta'];
  const notFoundImage = getCachedImage(testRecipeName, differentIngredients);

  if (notFoundImage === null) {
    console.log('✅ Correctly returned null for different ingredients');
  } else {
    console.log('❌ Should have returned null for different ingredients');
  }
  console.log('');

  // Test 4: Get cache statistics
  console.log('Test 4: Getting cache statistics...');
  const stats = getImageCacheStats();
  console.log('📊 Cache Stats:', stats);

  if (stats.totalImages >= 1) {
    console.log('✅ Cache statistics show at least 1 cached image');
  } else {
    console.log('❌ Cache statistics should show at least 1 cached image');
  }
  console.log('');

  // Test 5: Test cache key generation consistency
  console.log('Test 5: Testing cache key consistency...');
  const sameImage1 = getCachedImage(testRecipeName, testIngredients);
  const sameImage2 = getCachedImage(testRecipeName, [...testIngredients]); // Different array reference

  if (sameImage1 === sameImage2 && sameImage1 === testImageUrl) {
    console.log('✅ Cache key generation is consistent');
  } else {
    console.log('❌ Cache key generation is inconsistent');
  }
  console.log('');

  // Test 6: Clean expired images (should not clean anything since TTL is 1 hour)
  console.log('Test 6: Cleaning expired images...');
  const cleanedCount = cleanExpiredImages();

  if (cleanedCount === 0) {
    console.log('✅ No expired images cleaned (as expected)');
  } else {
    console.log(`⚠️ Cleaned ${cleanedCount} expired images (unexpected)`);
  }
  console.log('');

  // Test 7: Clear all cached images
  console.log('Test 7: Clearing all cached images...');
  clearAllCachedImages();

  const finalStats = getImageCacheStats();
  if (finalStats.totalImages === 0) {
    console.log('✅ All cached images cleared successfully');
  } else {
    console.log('❌ Failed to clear all cached images');
  }
  console.log('');

  console.log('🎉 Image Cache Tests Completed!');
  console.log('📊 Final Stats:', finalStats);
}

// Run tests if this file is executed directly
if (require.main === module) {
  testImageCache().catch(console.error);
}

export { testImageCache };
