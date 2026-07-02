import { RecipeCardData } from '@/types';
import Button from '../Button';

interface RecipeActionsProps {
  variant: 'save' | 'my-recipes';
  recipe: RecipeCardData;
  isSaved: boolean;
  isSaving: boolean;
  isRemoving: boolean;
  onSaveClick: (e: React.MouseEvent) => void;
  onEdit?: (recipe: RecipeCardData) => void;
  onDelete?: (recipeId: string) => void;
  onShare?: (recipe: RecipeCardData) => void;
}

/**
 * Componente especializado en mostrar los botones de acción de una receta
 * Responsabilidad única: Renderizar botones de acción según la variante
 */
export const RecipeActions = ({
  variant,
  recipe,
  isSaved,
  isSaving,
  isRemoving,
  onSaveClick,
  onEdit,
  onDelete,
}: RecipeActionsProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(recipe.id || '');
  };

  if (variant === 'save') {
    // Save action for Generated Recipes — single secondary button, bottom-right
    return (
      <div className='flex justify-end'>
        <Button
          variant='secondary'
          onClick={() => onSaveClick({} as React.MouseEvent)}
          disabled={isSaving || isRemoving}
          data-testid='save-recipe-button'
        >
          {isRemoving ? 'Saved!' : isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </Button>
      </div>
    );
  }

  // My Recipes card (Figma card-my-recipe): Delete (danger) + Edit (secondary),
  // text labels, bottom-right. Share lives on the recipe detail, not the card.
  return (
    <div className='flex items-center justify-end gap-sm'>
      <Button
        variant='danger'
        onClick={e => e && handleDeleteClick(e)}
        disabled={isRemoving}
        data-testid='delete-button'
      >
        Delete
      </Button>
      <Button
        variant='secondary'
        onClick={e => {
          e?.stopPropagation();
          onEdit?.(recipe);
        }}
        data-testid='edit-button'
      >
        Edit
      </Button>
    </div>
  );
};
