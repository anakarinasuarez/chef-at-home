import { RecipeCardData } from '@/types';
import { BiShare } from 'react-icons/bi';
import { FaPencil } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
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
  onShare,
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

  // Edit / Delete / Share for My Recipes — Delete uses the danger token
  return (
    <div className='flex justify-end gap-sm'>
      <Button
        variant='secondary'
        onClick={e => {
          e?.stopPropagation();
          onEdit?.(recipe);
        }}
        aria-label='Edit recipe'
        className='p-md flex items-center justify-center'
        data-testid='edit-button'
      >
        <FaPencil className='text-lg' />
      </Button>
      <Button
        variant='danger'
        onClick={e => e && handleDeleteClick(e)}
        aria-label='Delete recipe'
        className='p-md flex items-center justify-center'
        data-testid='delete-button'
      >
        <MdDelete className='text-lg' />
      </Button>
      <Button
        variant='secondary'
        onClick={e => {
          e?.stopPropagation();
          onShare?.(recipe);
        }}
        aria-label='Share recipe'
        className='p-md flex items-center justify-center'
      >
        <BiShare className='text-lg' data-testid='bi-share' />
      </Button>
    </div>
  );
};
