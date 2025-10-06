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
    // Save Button for Generated Recipes
    return (
      <div className='p-6 flex justify-end'>
        <Button
          variant={isSaved ? 'secondary' : 'primary'}
          onClick={() => onSaveClick({} as React.MouseEvent)}
          disabled={isSaving || isRemoving}
          className='px-6 py-3 flex items-center gap-2'
          data-testid='save-recipe-button'
        >
          {isRemoving ? (
            <span className='text-lg animate-pulse'>✓</span>
          ) : isSaving ? (
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
          ) : isSaved ? (
            <span className='text-lg'>✓</span>
          ) : (
            <span className='text-lg'>+</span>
          )}
          {isRemoving ? 'Saved!' : isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </Button>
      </div>
    );
  }

  // Edit, Delete, Share Buttons for My Recipes
  return (
    <div className='p-6 flex justify-end'>
      <div className='flex gap-2'>
        <Button
          variant='secondary'
          onClick={e => {
            e?.stopPropagation();
            onEdit?.(recipe);
          }}
          className='p-3 flex items-center justify-center'
          data-testid='edit-button'
        >
          <FaPencil className='text-lg' />
        </Button>
        <Button
          variant='secondary'
          onClick={e => e && handleDeleteClick(e)}
          className='p-3 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500'
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
          className='p-3 flex items-center justify-center'
        >
          <BiShare className='text-lg' data-testid='bi-share' />
        </Button>
      </div>
    </div>
  );
};
