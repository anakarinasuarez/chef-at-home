import ImageCacheManager from '@/components/ImageCacheManager';

export default function ImageCacheTestPage() {
  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>🖼️ Image Cache Management</h1>
          <p className='text-gray-600'>
            Monitor and manage the server-side image cache to optimize OpenAI API usage
          </p>
        </div>

        <ImageCacheManager />

        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-bold mb-4 text-gray-800'>📊 Cache Benefits</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='font-semibold text-green-600 mb-2'>✅ Cost Savings</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Prevents duplicate image generation</li>
                <li>• Reduces OpenAI API calls</li>
                <li>• Saves money on DALL-E usage</li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-blue-600 mb-2'>⚡ Performance</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Faster recipe generation</li>
                <li>• Reduced server load</li>
                <li>• Better user experience</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='mt-6 bg-yellow-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-yellow-800 mb-2'>⚠️ Important Notes</h3>
          <ul className='text-sm text-yellow-700 space-y-1'>
            <li>• Cache is stored in server memory and will be lost on restart</li>
            <li>• Images are cached for 24 hours by default</li>
            <li>• Clearing cache will force regeneration of all images</li>
            <li>• Cache cleanup runs automatically every hour</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
