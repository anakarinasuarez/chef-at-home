'use client';

import { useRecipeCard } from '@/hooks/useRecipeCard';
import { RecipeCardData } from '@/types';
import { memo } from 'react';
import { ErrorBoundaryAdvanced } from './ErrorBoundaryAdvanced';
import { RecipeActions } from './recipe/RecipeActions';
import { RecipeImageSimple } from './recipe/RecipeImageSimple';
import { RecipeInfo } from './recipe/RecipeInfo';

interface RecipeCardProps {
  recipe: RecipeCardData;
  variant?: 'save' | 'my-recipes';
  onEdit?: (recipe: RecipeCardData) => void;
  onDelete?: (recipeId: string) => void;
  onShare?: (recipe: RecipeCardData) => void;
  onRemoveFromList?: (recipeId: string) => void;
  isRemoving?: boolean;
}

/**
 * Componente RecipeCard refactorizado siguiendo el principio SRP
 * Ahora solo se encarga de la composición y el layout
 * La lógica de negocio está en el hook useRecipeCard
 * Los sub-componentes manejan responsabilidades específicas
 */
function RecipeCard({
  recipe,
  variant = 'save',
  onEdit,
  onDelete,
  onShare,
  onRemoveFromList,
  isRemoving = false,
}: RecipeCardProps) {
  // Usar el hook personalizado para toda la lógica de negocio
  const {
    isSaving,
    imageError,
    recipeId,
    isSaved,
    handleCardClick,
    handleSaveClick,
    handleImageError,
  } = useRecipeCard({
    recipe,
    variant,
    onRemoveFromList,
  });

  return (
    <ErrorBoundaryAdvanced
      level='component'
      errorBoundaryName='RecipeCard'
      allowRetry={true}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      <div
        onClick={handleCardClick}
        className='flex w-full flex-col gap-lg rounded-lg bg-surface p-xl transition-shadow duration-200 cursor-pointer hover:shadow-lg'
        data-testid='recipe-card'
      >
        {/* Recipe Info - title + meta */}
        <RecipeInfo recipe={recipe} />

        {/* Recipe Image */}
        <RecipeImageSimple
          recipe={{
            id: recipe.id || 'unknown',
            title: recipe.title,
            image: recipe.image,
            cuisine: recipe.difficulty
          }}
          imageError={imageError}
          onImageError={handleImageError}
        />

        {/* Action Buttons - Bottom right */}
        <RecipeActions
          variant={variant}
          recipe={recipe}
          isSaved={isSaved}
          isSaving={isSaving}
          isRemoving={isRemoving}
          onSaveClick={handleSaveClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
        />
      </div>
    </ErrorBoundaryAdvanced>
  );
}

// Exportar el componente memoizado para evitar re-renders innecesarios
export default memo(RecipeCard);
