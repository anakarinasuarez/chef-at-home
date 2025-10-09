# 🖼️ Image Cache System

## Overview

The Image Cache System prevents unnecessary OpenAI API calls by caching
generated images on the server side. This significantly reduces costs and
improves performance when generating recipes with similar ingredients.

## How It Works

1. **Server-Side Caching**: Images are cached in server memory using a Map
   structure
2. **Automatic Cleanup**: Expired images are automatically cleaned every hour
3. **Dual Cache**: Both server-side and client-side caching for maximum
   efficiency
4. **TTL Support**: Images are cached for 24 hours by default

## Key Features

- ✅ **Cost Savings**: Prevents duplicate image generation
- ✅ **Performance**: Faster recipe generation
- ✅ **Automatic Cleanup**: Expired images are removed automatically
- ✅ **Memory Efficient**: Uses server memory with size estimation
- ✅ **Monitoring**: Built-in statistics and management tools

## Files Added/Modified

### New Files

- `src/lib/server-image-cache.ts` - Server-side image cache implementation
- `src/components/ImageCacheManager.tsx` - UI component for cache management
- `src/app/test-image-cache/page.tsx` - Test page for cache management
- `src/app/api/image-cache/route.ts` - API endpoint for cache operations
- `src/app/api/test-image-cache/route.ts` - API endpoint for cache testing
- `src/lib/test-image-cache.ts` - Test suite for cache functionality

### Modified Files

- `src/services/openaiImageService.ts` - Updated to use server-side cache
- `src/app/api/recipes/generate/route.ts` - Added cache initialization

## API Endpoints

### Image Cache Management

- `GET /api/image-cache?action=stats` - Get cache statistics
- `GET /api/image-cache?action=clean` - Clean expired images
- `GET /api/image-cache?action=clear` - Clear all cached images
- `GET /api/image-cache?action=keys` - Get all cached image keys
- `POST /api/image-cache` - Perform cache operations (clean, clear)

### Cache Testing

- `GET /api/test-image-cache` - Run cache functionality tests

## Usage Examples

### Check Cache Statistics

```bash
curl http://localhost:3000/api/image-cache?action=stats
```

### Clean Expired Images

```bash
curl -X POST http://localhost:3000/api/image-cache \
  -H "Content-Type: application/json" \
  -d '{"action": "clean"}'
```

### Clear All Cached Images

```bash
curl -X POST http://localhost:3000/api/image-cache \
  -H "Content-Type: application/json" \
  -d '{"action": "clear"}'
```

## Cache Key Generation

Images are cached using a combination of:

- Recipe name (normalized)
- Ingredients (sorted and joined)

Example cache key: `img_chicken_rice_vegetables_chicken,rice,vegetables`

## Configuration

### TTL (Time To Live)

- Default: 24 hours (86400 seconds)
- Configurable per image
- Automatic expiration checking

### Memory Management

- Images stored in server memory
- Automatic cleanup every hour
- Memory usage estimation provided

## Monitoring

### Cache Statistics

- Total cached images
- Expired images count
- Memory usage estimation
- Cache hit/miss ratios

### UI Management

Visit `/test-image-cache` to access the cache management interface with:

- Real-time statistics
- Manual cache operations
- Visual feedback
- Usage instructions

## Testing

Run the test suite to verify cache functionality:

```bash
curl http://localhost:3000/api/test-image-cache
```

The test suite verifies:

- Image caching and retrieval
- Cache key consistency
- Expiration handling
- Statistics accuracy
- Cleanup operations

## Benefits

### Cost Reduction

- Prevents duplicate OpenAI API calls
- Reduces DALL-E usage costs
- Optimizes API quota usage

### Performance Improvement

- Faster recipe generation
- Reduced server load
- Better user experience
- Lower latency

### Reliability

- Automatic error handling
- Fallback mechanisms
- Memory management
- Monitoring capabilities

## Important Notes

⚠️ **Server Restart**: Cache is stored in memory and will be lost on server
restart ⚠️ **Memory Usage**: Monitor memory usage in production environments ⚠️
**TTL**: Images expire after 24 hours by default ⚠️ **Cleanup**: Automatic
cleanup runs every hour

## Future Enhancements

- Persistent storage (Redis, database)
- Cache compression
- Advanced analytics
- Cache warming strategies
- Distributed caching
