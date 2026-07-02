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
 * Imagen de la card: ancho completo, ratio 4:3, object-cover, esquinas redondeadas.
 * Usa la foto real de la receta (recipe.image) y cae en ImagePlaceholder si falta o falla.
 */
export const RecipeImageSimple = ({ recipe, imageError, onImageError }: RecipeImageProps) => {
  const displayImage =
    recipe.image && recipe.image !== '/images/plate.png' ? recipe.image : null;

  return (
    <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
      {displayImage && !imageError ? (
        <Image
          src={displayImage}
          alt={recipe.title}
          fill
          className='object-cover'
          onError={onImageError}
          sizes='(max-width: 1024px) 100vw, 320px'
          priority
        />
      ) : (
        <ImagePlaceholder title={recipe.title} className='h-full w-full' />
      )}
    </div>
  );
};
