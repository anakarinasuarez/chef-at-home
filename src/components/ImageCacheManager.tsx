'use client';

import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';

interface ImageCacheStats {
  totalImages: number;
  expiredImages: number;
  memoryUsage: string;
}

interface ImageCacheResponse {
  success: boolean;
  stats?: ImageCacheStats;
  cleanedCount?: number;
  keys?: string[];
  count?: number;
  message: string;
}

export default function ImageCacheManager() {
  const [stats, setStats] = useState<ImageCacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/image-cache?action=stats');
      const data: ImageCacheResponse = await response.json();

      if (data.success && data.stats) {
        setStats(data.stats);
        setMessage(data.message);
      } else {
        setMessage('Error fetching cache stats');
      }
    } catch (error) {
      setMessage('Error fetching cache stats');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanExpiredImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/image-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clean' }),
      });
      const data: ImageCacheResponse = await response.json();

      if (data.success) {
        setMessage(`Cleaned ${data.cleanedCount} expired images`);
        await fetchStats(); // Refresh stats
      } else {
        setMessage('Error cleaning expired images');
      }
    } catch (error) {
      setMessage('Error cleaning expired images');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllImages = async () => {
    if (
      !confirm(
        'Are you sure you want to clear all cached images? This will force regeneration of all images.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/image-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear' }),
      });
      const data: ImageCacheResponse = await response.json();

      if (data.success) {
        setMessage('All cached images cleared');
        await fetchStats(); // Refresh stats
      } else {
        setMessage('Error clearing cached images');
      }
    } catch (error) {
      setMessage('Error clearing cached images');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>🖼️ Image Cache Manager</h2>

      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-blue-800'>Total Images</h3>
            <p className='text-2xl font-bold text-blue-600'>{stats.totalImages}</p>
          </div>

          <div className='bg-yellow-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-yellow-800'>Expired Images</h3>
            <p className='text-2xl font-bold text-yellow-600'>{stats.expiredImages}</p>
          </div>

          <div className='bg-green-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-green-800'>Memory Usage</h3>
            <p className='text-2xl font-bold text-green-600'>{stats.memoryUsage}</p>
          </div>
        </div>
      )}

      <div className='flex flex-wrap gap-3'>
        <Button
          onClick={fetchStats}
          disabled={loading}
          className='bg-blue-500 hover:bg-blue-600 text-white'
        >
          {loading ? 'Loading...' : '🔄 Refresh Stats'}
        </Button>

        <Button
          onClick={cleanExpiredImages}
          disabled={loading}
          className='bg-yellow-500 hover:bg-yellow-600 text-white'
        >
          {loading ? 'Cleaning...' : '🧹 Clean Expired'}
        </Button>

        <Button
          onClick={clearAllImages}
          disabled={loading}
          className='bg-red-500 hover:bg-red-600 text-white'
        >
          {loading ? 'Clearing...' : '🗑️ Clear All'}
        </Button>
      </div>

      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <h3 className='font-semibold text-gray-700 mb-2'>💡 How it works:</h3>
        <ul className='text-sm text-gray-600 space-y-1'>
          <li>• Images are cached for 24 hours by default</li>
          <li>• Cached images prevent unnecessary OpenAI API calls</li>
          <li>• Expired images are automatically cleaned every hour</li>
          <li>• Cache is stored in server memory for fast access</li>
        </ul>
      </div>
    </div>
  );
}
