import { useRecipeImage } from '@/hooks/useRecipeImage';
import ImagePlaceholder from '../ImagePlaceholder';
import OptimizedImage from '../OptimizedImage';

interface Recipe {
  id?: string;
  title: string;
  image?: string;
  source: string;
  ingredients?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  cuisine?: string;
}

interface RecipeImageProps {
  recipe: Recipe;
  imageError: boolean;
  onImageError: () => void;
}

/**
 * Componente especializado en mostrar la imagen de una receta con caché
 * Responsabilidad única: Renderizar imagen de receta con fallback y caché
 */
export const RecipeImageCached = ({ recipe, imageError, onImageError }: RecipeImageProps) => {
  // Use the recipe image hook for cached images
  const { imageUrl: cachedImageUrl, loading: imageLoading } = useRecipeImage({
    recipeId: recipe.id || '',
    recipeName: recipe.title,
    ingredients: recipe.ingredients?.map(ing => ing.name) || [],
    cuisine: recipe.cuisine || 'international',
    fallbackImage: '/images/plate.png',
    existingImage: recipe.image, // Pass existing image from recipe
  });

  // Use cached image if available, otherwise fall back to recipe.image, then fallback image
  const displayImage = cachedImageUrl || recipe.image || '/images/plate.png';

  return (
    <div className='px-6'>
      <div className='relative h-48 overflow-hidden rounded-lg'>
        {displayImage && !imageError && !imageLoading ? (
          <OptimizedImage
            src={displayImage}
            alt={recipe.title}
            width={400}
            height={192}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
            onError={onImageError}
            quality={80}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        ) : imageLoading ? (
          <div className='flex items-center justify-center h-full bg-gray-100'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2 border-blue-500'></div>
              <p className='text-xs text-gray-600'>Loading...</p>
            </div>
          </div>
        ) : (
          <ImagePlaceholder
            title={recipe.title}
            cuisine={
              recipe.source === 'fallback-enhanced' ? 'Italian' : recipe.cuisine || 'International'
            }
            className='h-48'
            ingredients={recipe.ingredients?.map(ing => ing.name) || []}
          />
        )}
      </div>
    </div>
  );
};
