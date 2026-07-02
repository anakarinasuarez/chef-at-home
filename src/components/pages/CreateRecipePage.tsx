'use client';

import Button from '@/components/Button';
import Chip from '@/components/ui/Chip';
import MainLayout from '@/components/layouts/MainLayout';
import { sessionLimitsManager } from '@/lib/sessionLimits';
import { useSavedRecipesStore, useToastStore } from '@/stores';
import { User } from '@/types';
import { normalizeIngredientName } from '@/utils/ingredientUtils';
import saladPlate from '@/assets/images/salad-plate.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';

interface CreateRecipePageProps {
  userName: string;
  user: User;
}

export default function CreateRecipePage({ userName, user }: CreateRecipePageProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToastStore();
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string }>>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedServings, setSelectedServings] = useState<number | null>(null);
  const [customServings, setCustomServings] = useState<number[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newCustomServing, setNewCustomServing] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [originalImage, setOriginalImage] = useState<string | null>(null); // ✅ Para preservar la imagen original
  const [canGenerateRecipe, setCanGenerateRecipe] = useState(true);
  const updateRecipe = useSavedRecipesStore(state => state.updateRecipe);

  // Verificar límite de sesión
  useEffect(() => {
    if (!user?.id) return;

    const canGenerate = sessionLimitsManager.canGenerateRecipe(user.id);
    setCanGenerateRecipe(canGenerate);
  }, [user?.id]);

  // Cargar datos de edición si existe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';

    if (isEditMode) {
      const editData = localStorage.getItem('editRecipeData');
      if (editData) {
        try {
          const parsedData = JSON.parse(editData);
          setIsEditing(true);
          setEditingRecipeId(parsedData.originalId);

          // Cargar título de la receta
          if (parsedData.title) {
            setRecipeTitle(parsedData.title);
          }

          // Cargar ingredientes
          if (parsedData.ingredients && parsedData.ingredients.length > 0) {
            const formattedIngredients = parsedData.ingredients.map(
              (ing: string | { name: string }) => ({
                id: Date.now().toString() + Math.random(),
                name: typeof ing === 'string' ? ing : ing.name,
              })
            );
            setIngredients(formattedIngredients);
          }

          // Cargar servings
          if (parsedData.servings) {
            setSelectedServings(parsedData.servings);
          }

          // Cargar imagen original
          if (parsedData.image) {
            setOriginalImage(parsedData.image);
          }

          // Limpiar localStorage después de cargar
          localStorage.removeItem('editRecipeData');
        } catch (error) {
          console.error('Error loading edit data:', error);
        }
      }
    }
  }, []);

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const trimmedIngredient = newIngredient.trim();

      // Verificar si el ingrediente ya existe (case-insensitive)
      const normalizedNewIngredient = normalizeIngredientName(trimmedIngredient);
      const isDuplicate = ingredients.some(
        ingredient => normalizeIngredientName(ingredient.name) === normalizedNewIngredient
      );

      if (isDuplicate) {
        showError(`"${trimmedIngredient}" is already in the ingredients list`);
        return;
      }

      const newIngredientObj = {
        id: Date.now().toString() + Math.random(),
        name: trimmedIngredient,
      };
      setIngredients([...ingredients, newIngredientObj]);
      setNewIngredient('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const handleServingsChange = (servings: number) => {
    setSelectedServings(servings);
    setShowCustomInput(false);
  };

  const handleCustomServings = () => {
    const customValue = parseInt(newCustomServing, 10);
    if (!isNaN(customValue) && customValue > 0) {
      setCustomServings(prev =>
        prev.includes(customValue) ? prev : [...prev, customValue]
      );
      setSelectedServings(customValue);
      setShowCustomInput(false);
      setNewCustomServing('');
    } else {
      showError('Enter a valid number of servings');
    }
  };

  const handleSaveRecipe = async () => {
    if (ingredients.length === 0) {
      showError('Please add at least one ingredient');
      return;
    }

    if (!selectedServings) {
      showError('Please select the number of servings');
      return;
    }

    if (!recipeTitle.trim()) {
      showError('Please enter a recipe title');
      return;
    }

    if (!editingRecipeId) {
      showError('No recipe ID found for editing');
      return;
    }

    setIsCreating(true);

    try {
      // 🚀 NUEVA LÓGICA: Detectar tipo de cambio para mejor UX
      // Obtener la receta original para comparar
      const originalRecipe = localStorage.getItem(`recipe-${editingRecipeId}`);
      let changeType: 'ingredients' | 'servings' | 'title' | 'none' = 'none';

      if (originalRecipe) {
        try {
          const originalData = JSON.parse(originalRecipe);
          const originalIngredients =
            originalData.ingredients?.map((ing: any) =>
              typeof ing === 'string' ? ing : ing.name
            ) || [];
          const currentIngredients = ingredients.map(ing => ing.name);

          // Comparar ingredientes (orden independiente)
          const originalSorted = originalIngredients.sort();
          const currentSorted = currentIngredients.sort();
          const ingredientsChanged =
            JSON.stringify(originalSorted) !== JSON.stringify(currentSorted);
          const servingsChanged = originalData.servings !== selectedServings;
          const titleChanged = originalData.title !== recipeTitle.trim();

          // Determinar tipo de cambio
          if (ingredientsChanged) {
            changeType = 'ingredients';
          } else if (servingsChanged) {
            changeType = 'servings';
          } else if (titleChanged) {
            changeType = 'title';
          }

        } catch (error) {
          console.error('Error comparing recipe data:', error);
          changeType = 'ingredients'; // Si no se puede comparar, asumir cambio de ingredientes
        }
      } else {
        changeType = 'ingredients'; // Si no hay receta original, generar nuevas
      }

      // 🎯 ACCIONES SEGÚN TIPO DE CAMBIO
      if (changeType === 'ingredients') {
        // Limpiar cache para forzar nueva generación
        try {
          const { UniversalCacheManager } = await import('@/lib/universal-cache');
          await UniversalCacheManager.clearAllCache();
          sessionStorage.removeItem('currentRecipes');
        } catch (error) {
          console.error('Error clearing cache:', error);
        }

        // Redirigir a generar UNA nueva receta con los ingredientes actualizados
        const ingredientsParam = encodeURIComponent(
          JSON.stringify(ingredients.map(ing => ing.name))
        );
        const redirectUrl = `/recipes?ingredients=${ingredientsParam}&servings=${selectedServings}&force=true&editMode=true&originalId=${editingRecipeId}&recipeTitle=${encodeURIComponent(recipeTitle.trim())}&count=1`;
        router.push(redirectUrl);
        return;
      } else if (changeType === 'servings') {
        // Recalcular proporciones de ingredientes
        const originalRecipe = localStorage.getItem(`recipe-${editingRecipeId}`);
        if (originalRecipe) {
          try {
            const originalData = JSON.parse(originalRecipe);
            const originalServings = originalData.servings || 4;
            const ratio = selectedServings / originalServings;

            // Recalcular cantidades de ingredientes
            const recalculatedIngredients =
              originalData.ingredients?.map((ing: any) => {
                const name = typeof ing === 'string' ? ing : ing.name;
                const quantity =
                  typeof ing === 'object' && ing.quantity
                    ? Math.round(ing.quantity * ratio * 100) / 100
                    : 1;
                const unit = typeof ing === 'object' && ing.unit ? ing.unit : 'unit';

                return { name, quantity, unit };
              }) || [];

            const updatedRecipeData = {
              title: recipeTitle.trim(),
              ingredients: recalculatedIngredients,
              servings: selectedServings,
              cookingTime: originalData.cookingTime || '30 minutes',
              difficulty: originalData.difficulty || 'medium',
              source: 'user-edited',
              image: originalData.image || undefined,
              instructions: originalData.instructions || [
                'Instructions will be updated when you regenerate the recipe.',
              ],
            };

            const success = updateRecipe(editingRecipeId, updatedRecipeData, user.id);
            if (success) {
              showSuccess(`Recipe updated for ${selectedServings} servings!`);
              router.push('/my-recipes');
              return;
            }
          } catch (error) {
            console.error('Error recalculating servings:', error);
          }
        }
      }

      // Si solo se cambió el título, actualizar metadatos
      const updatedRecipeData = {
        title: recipeTitle.trim(),
        ingredients: ingredients.map(ing => ({
          name: ing.name,
          quantity: 1,
          unit: 'unit',
        })),
        servings: selectedServings,
        cookingTime: '30 minutes',
        difficulty: 'medium',
        source: 'user-edited',
        image: originalImage || undefined,
        instructions: ['Instructions will be updated when you regenerate the recipe.'],
      };

      const success = updateRecipe(editingRecipeId, updatedRecipeData, user.id);

      if (success) {
        showSuccess('Title updated successfully!');
        router.push('/my-recipes');
      } else {
        throw new Error('Failed to update recipe');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      showError('Error saving recipe. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateRecipe = async () => {
    if (ingredients.length === 0) {
      showError('Please add at least one ingredient');
      return;
    }

    if (!selectedServings) {
      showError('Please select the number of servings');
      return;
    }

    setIsCreating(true);

    try {
      // 🚀 SOLUCIÓN: Solo redirigir, no hacer request aquí
      // El RecipesPage se encargará de hacer el request único
      const ingredientsParam = encodeURIComponent(JSON.stringify(ingredients.map(ing => ing.name)));
      const redirectUrl = `/recipes?ingredients=${ingredientsParam}&servings=${selectedServings}&count=4`;
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error redirecting to recipes page:', error);
      showError('Error redirecting to recipes page. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const servingOptions = Array.from(
    new Set([1, 2, 4, 6, 8, ...customServings])
  ).sort((a, b) => a - b);

  return (
    <MainLayout showMenu={true} userName={userName} currentPage='create'>
      {/* Greeting */}
      <p className='mb-sm text-sm text-muted'>Welcome {userName}</p>

      {/* Heading */}
      <h1 className='mb-xl text-[28px] font-bold leading-tight tracking-tight text-fg lg:mb-6 lg:text-[32px]'>
        {isEditing
          ? 'Edit your recipe'
          : 'What ingredients do you have to create your recipe?'}
      </h1>

      {/* Mobile illustration banner (desktop shows it in the side column) */}
      <div className='mb-xl flex justify-center lg:hidden'>
        <Image
          src={saladPlate}
          alt='Fresh salad plate'
          className='h-auto w-64'
          priority
        />
      </div>

      {/* Campo de Título de la Receta - Solo en modo edición */}
      {isEditing && (
        <div className='mb-8'>
          <h3 className='mb-4 text-xl font-semibold text-fg'>Recipe Title</h3>
          <input
            type='text'
            value={recipeTitle}
            onChange={e => setRecipeTitle(e.target.value)}
            placeholder='Enter recipe title...'
            className='w-full max-w-form rounded-sm border border-border bg-input px-md py-sm text-base text-fg placeholder:text-muted transition-colors focus:border-primary focus:outline-none'
            data-testid='recipe-title-input'
          />
        </div>
      )}

      {/* Sección de Ingredientes */}
      <div className='mb-8'>
        <h3 className='mb-4 text-xl font-semibold text-fg'>Ingredients</h3>

        {/* Input para agregar ingredientes */}
        <div className='flex gap-2 mb-4'>
          <input
            type='text'
            value={newIngredient}
            onChange={e => setNewIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Add an ingredient...'
            className='flex-1 min-w-0 rounded-sm border border-border bg-input px-md py-sm text-base text-fg placeholder:text-muted transition-colors focus:border-primary focus:outline-none'
            data-testid='ingredient-input'
          />
          <Button
            variant='secondary'
            onClick={handleAddIngredient}
            aria-label='Add ingredient'
            className='px-lg'
            data-testid='add-ingredient-button'
          >
            <FiPlus className='text-xl' />
          </Button>
        </div>

        {/* Lista de ingredientes */}
        {ingredients.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {ingredients.map(ingredient => (
              <div
                key={ingredient.id}
                className='group relative flex items-center justify-center rounded-sm bg-elevated px-md py-sm transition-colors duration-200'
              >
                <span className='text-sm text-center text-primary'>
                  {ingredient.name}
                </span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  aria-label={`Remove ${ingredient.name}`}
                  className='absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-danger text-on-primary hover:bg-danger-hover'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Servings */}
      <div className='mb-8'>
        <h3 className='mb-4 text-xl font-semibold text-fg'>Servings</h3>

        {/* Serving pills (Figma serving-selector) + optional custom value */}
        <div className='flex flex-wrap items-center gap-sm'>
          {servingOptions.map(servings => (
            <Chip
              key={servings}
              selected={selectedServings === servings}
              onClick={() => handleServingsChange(servings)}
              data-testid={`servings-${servings}-button`}
            >
              {servings}
            </Chip>
          ))}

          {showCustomInput ? (
            <div className='flex items-center gap-sm'>
              <input
                type='number'
                value={newCustomServing}
                onChange={e => setNewCustomServing(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCustomServings();
                }}
                placeholder='e.g. 3'
                className='w-24 rounded-sm border border-border bg-input px-md py-sm text-fg placeholder:text-muted transition-colors focus:border-primary focus:outline-none'
                min='1'
                autoFocus
              />
              <Button
                variant='secondary'
                size='sm'
                aria-label='Add servings'
                data-testid='confirm-serving-button'
                onClick={handleCustomServings}
              >
                <FiPlus className='text-lg' />
              </Button>
              <Button
                variant='tertiary'
                size='sm'
                aria-label='Cancel custom servings'
                onClick={() => {
                  setShowCustomInput(false);
                  setNewCustomServing('');
                }}
              >
                ×
              </Button>
            </div>
          ) : (
            <Chip
              aria-label='Add custom servings'
              onClick={() => setShowCustomInput(true)}
            >
              +
            </Chip>
          )}
        </div>
      </div>

      {/* Spacer so the fixed mobile action bar never covers the last field */}
      <div className='h-24 lg:hidden' aria-hidden='true' />

      {/* Acciones — bottom-pinned ActionBar on mobile, inline in flow on desktop */}
      <div className='fixed inset-x-0 bottom-0 z-40 flex gap-md border-t border-border bg-surface px-lg py-md lg:static lg:z-auto lg:gap-4 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0'>
        <Button
          variant='primary'
          onClick={isEditing ? handleSaveRecipe : handleCreateRecipe}
          disabled={
            isCreating ||
            ingredients.length === 0 ||
            !selectedServings ||
            (isEditing && !recipeTitle.trim()) ||
            (!isEditing && !canGenerateRecipe) // Deshabilitar si no puede generar más recetas
          }
          className='flex-1 lg:flex-none px-8 py-3'
          data-testid='create-recipe-button'
        >
          {isCreating
            ? isEditing
              ? 'Saving recipe...'
              : 'Creating recipe...'
            : isEditing
              ? 'Update Recipe'
              : !canGenerateRecipe
                ? 'Session Limit Reached'
                : 'Create Recipe'}
        </Button>
        <Button
          variant='secondary'
          onClick={() => router.push('/my-recipes')}
          className='flex-1 lg:flex-none px-6 py-3'
        >
          Cancel
        </Button>
      </div>
    </MainLayout>
  );
}
