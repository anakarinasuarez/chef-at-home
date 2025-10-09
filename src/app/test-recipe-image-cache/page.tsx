import { useRecipeImage } from '@/hooks/useRecipeImage';
import { useState } from 'react';

export default function RecipeImageCacheTestPage() {
  const [testRecipeId] = useState('test_recipe_123');
  const [testRecipeName] = useState('Test Chicken Recipe');
  const [testIngredients] = useState(['chicken', 'rice', 'vegetables']);

  const { imageUrl, loading, error, regenerateImage } = useRecipeImage({
    recipeId: testRecipeId,
    recipeName: testRecipeName,
    ingredients: testIngredients,
    cuisine: 'international',
  });

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>🖼️ Recipe Image Cache Test</h1>
          <p className='text-gray-600'>Testing the recipe image caching system</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          <h2 className='text-xl font-bold mb-4 text-gray-800'>Test Recipe Image</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='font-semibold text-gray-700 mb-2'>Recipe Info:</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>
                  <strong>ID:</strong> {testRecipeId}
                </li>
                <li>
                  <strong>Name:</strong> {testRecipeName}
                </li>
                <li>
                  <strong>Ingredients:</strong> {testIngredients.join(', ')}
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-gray-700 mb-2'>Cache Status:</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>
                  <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
                </li>
                <li>
                  <strong>Error:</strong> {error || 'None'}
                </li>
                <li>
                  <strong>Image URL:</strong> {imageUrl ? 'Available' : 'Not available'}
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-6'>
            <button
              onClick={regenerateImage}
              disabled={loading}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50'
            >
              {loading ? 'Regenerating...' : '🔄 Regenerate Image'}
            </button>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-bold mb-4 text-gray-800'>Image Display</h2>

          <div className='relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden'>
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-blue-500'></div>
                  <p className='text-gray-600'>Loading image...</p>
                </div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={testRecipeName}
                className='w-full h-full object-cover'
                onError={() => console.log('Image failed to load')}
              />
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <p>No image available</p>
              </div>
            )}
          </div>
        </div>

        <div className='mt-8 bg-yellow-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-yellow-800 mb-2'>⚠️ Test Instructions</h3>
          <ul className='text-sm text-yellow-700 space-y-1'>
            <li>• First load: Image should be generated and cached</li>
            <li>• Refresh page: Image should load from cache (faster)</li>
            <li>• Regenerate: Should create new image and update cache</li>
            <li>• Check browser network tab to see API calls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
