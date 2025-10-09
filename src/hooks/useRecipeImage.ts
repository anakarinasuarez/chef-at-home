'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface RecipeImageHookResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  regenerateImage: () => void;
}

interface RecipeImageHookParams {
  recipeId: string;
  recipeName: string;
  ingredients: string[];
  cuisine?: string;
  style?: 'photorealistic' | 'artistic' | 'minimalist' | 'gourmet';
  fallbackImage?: string;
  existingImage?: string; // Add existing image from recipe
}

// Global cache to prevent duplicate requests
const globalImageCache = new Map<
  string,
  {
    imageUrl: string | null;
    loading: boolean;
    promise?: Promise<string | null>;
  }
>();

/**
 * Hook para manejar imágenes de recetas con caché global
 */
export const useRecipeImage = ({
  recipeId,
  recipeName,
  ingredients,
  cuisine = 'international',
  style = 'photorealistic',
  fallbackImage = '/images/plate.png',
  existingImage,
}: RecipeImageHookParams): RecipeImageHookResult => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchImage = useCallback(
    async (regenerate = false) => {
      if (!recipeId || !recipeName || !ingredients.length) {
        if (isMountedRef.current) {
          setImageUrl(fallbackImage);
          setLoading(false);
        }
        return;
      }

      // ALWAYS use existing image first - NO automatic generation
      if (existingImage && existingImage !== '/images/plate.png') {
        if (isMountedRef.current) {
          setImageUrl(existingImage);
          setLoading(false);
          console.log(`📦 Using existing image for recipe ID: ${recipeId}`);
        }
        return;
      }

      // Only generate new image if explicitly requested (regenerate = true)
      if (!regenerate) {
        if (isMountedRef.current) {
          setImageUrl(fallbackImage);
          setLoading(false);
          console.log(
            `📦 Using fallback image for recipe ID: ${recipeId} (no regeneration requested)`
          );
        }
        return;
      }

      const cacheKey = `${recipeId}_${regenerate ? 'regenerate' : 'normal'}`;

      // Check if we already have this request in progress
      if (globalImageCache.has(cacheKey)) {
        const cached = globalImageCache.get(cacheKey)!;
        if (cached.promise) {
          // Wait for existing request
          try {
            const result = await cached.promise;
            if (isMountedRef.current) {
              setImageUrl(result);
              setLoading(false);
            }
            return;
          } catch (err) {
            console.error('Error waiting for existing request:', err);
          }
        } else if (cached.imageUrl !== null) {
          // Use cached result
          if (isMountedRef.current) {
            setImageUrl(cached.imageUrl);
            setLoading(false);
          }
          return;
        }
      }

      try {
        if (isMountedRef.current) {
          setLoading(true);
          setError(null);
        }

        // Create promise and store it
        const promise = fetch('/api/recipe-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipeId,
            recipeName,
            ingredients,
            cuisine,
            style,
            regenerate,
          }),
        })
          .then(async response => {
            const data = await response.json();

            if (data.success && data.imageUrl) {
              // Cache the result
              globalImageCache.set(cacheKey, {
                imageUrl: data.imageUrl,
                loading: false,
              });

              if (isMountedRef.current) {
                setImageUrl(data.imageUrl);
                console.log(
                  `📦 Recipe image ${regenerate ? 'regenerated' : 'loaded'} for ID: ${recipeId}`
                );
              }
              return data.imageUrl;
            } else {
              if (isMountedRef.current) {
                setImageUrl(fallbackImage);
                setError(data.message || 'Failed to load image');
              }
              return fallbackImage;
            }
          })
          .catch(err => {
            console.error('Error fetching recipe image:', err);
            if (isMountedRef.current) {
              setImageUrl(fallbackImage);
              setError('Network error');
            }
            return fallbackImage;
          });

        // Store the promise
        globalImageCache.set(cacheKey, {
          imageUrl: null,
          loading: true,
          promise,
        });

        await promise;
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [recipeId, recipeName, ingredients, cuisine, style, fallbackImage, existingImage]
  );

  const regenerateImage = useCallback(() => {
    fetchImage(true);
  }, [fetchImage]);

  useEffect(() => {
    // Only use existing image or fallback - NO automatic API calls
    if (recipeId && recipeName && ingredients.length > 0) {
      if (existingImage && existingImage !== '/images/plate.png') {
        if (isMountedRef.current) {
          setImageUrl(existingImage);
          setLoading(false);
          console.log(`📦 Using existing image for recipe ID: ${recipeId}`);
        }
      } else {
        if (isMountedRef.current) {
          setImageUrl(fallbackImage);
          setLoading(false);
          console.log(`📦 Using fallback image for recipe ID: ${recipeId}`);
        }
      }
    } else {
      // Use fallback image immediately if no recipe data
      if (isMountedRef.current) {
        setImageUrl(fallbackImage);
        setLoading(false);
      }
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [recipeId, recipeName, ingredients.length, existingImage, fallbackImage]);

  return {
    imageUrl,
    loading,
    error,
    regenerateImage,
  };
};

/**
 * Hook simplificado para verificar si una imagen está cacheadas
 */
export const useRecipeImageCacheStatus = (recipeId: string): boolean => {
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    if (!recipeId) return;

    const checkCacheStatus = async () => {
      try {
        const response = await fetch(`/api/recipe-image-cache?recipeId=${recipeId}`);
        const data = await response.json();
        setIsCached(data.isCached || false);
      } catch (error) {
        console.error('Error checking cache status:', error);
        setIsCached(false);
      }
    };

    checkCacheStatus();
  }, [recipeId]);

  return isCached;
};
