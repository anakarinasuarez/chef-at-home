'use client';

import ImagePlaceholder from '@/components/ImagePlaceholder';
import Image from 'next/image';

interface Recipe {
  id: string;
  title: string;
  image?: string;
  ingredients?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  cuisine?: string;
}

interface RecipeImageProps {
  recipe: Recipe;
  imageError?: boolean;
  onImageError?: () => void;
}

/**
 * Componente simple para mostrar imagen de receta SIN generación automática
 * Solo usa la imagen existente de la receta o fallback
 */
export const RecipeImageSimple = ({ recipe, imageError, onImageError }: RecipeImageProps) => {
  // Solo usar imagen existente o fallback - NO llamadas API
  const displayImage =
    recipe.image && recipe.image !== '/images/plate.png' ? recipe.image : '/images/plate.png';

  return (
    <div className='px-6'>
      <div className='relative h-48 overflow-hidden rounded-lg'>
        {displayImage && !imageError ? (
          <Image
            src={displayImage}
            alt={recipe.title}
            fill
            className='object-cover'
            onError={onImageError}
            priority
          />
        ) : (
          <ImagePlaceholder title={recipe.title} />
        )}
      </div>
    </div>
  );
};
