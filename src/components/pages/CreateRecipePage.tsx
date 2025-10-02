'use client';

import Button from '@/components/Button';
import MainLayout from '@/components/layouts/MainLayout';
import { colors, typography } from '@/design-system';
import { useSavedRecipesStore } from '@/stores';
import { User } from '@/types';
import { normalizeIngredientName } from '@/utils/ingredientUtils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CreateRecipePageProps {
  userName: string;
  user: User;
}

export default function CreateRecipePage({ userName, user }: CreateRecipePageProps) {
  const router = useRouter();
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
  const updateRecipe = useSavedRecipesStore(state => state.updateRecipe);

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
        toast.error(`"${trimmedIngredient}" is already in the ingredients list`);
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
    if (newCustomServing.trim()) {
      const customValue = parseInt(newCustomServing);
      if (!isNaN(customValue) && customValue > 0) {
        setSelectedServings(customValue);
        setShowCustomInput(false);
        setNewCustomServing('');
      }
    }
  };

  const handleSaveRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    if (!selectedServings) {
      toast.error('Please select the number of servings');
      return;
    }

    if (!recipeTitle.trim()) {
      toast.error('Please enter a recipe title');
      return;
    }

    if (!editingRecipeId) {
      toast.error('No recipe ID found for editing');
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

          console.log('🔍 Change detection:', {
            original: originalSorted,
            current: currentSorted,
            changeType,
            ingredientsChanged,
            servingsChanged,
            titleChanged,
          });
        } catch (error) {
          console.error('Error comparing recipe data:', error);
          changeType = 'ingredients'; // Si no se puede comparar, asumir cambio de ingredientes
        }
      } else {
        changeType = 'ingredients'; // Si no hay receta original, generar nuevas
      }

      // 🎯 ACCIONES SEGÚN TIPO DE CAMBIO
      if (changeType === 'ingredients') {
        console.log('🔄 Ingredients changed, generating new recipes...');

        // Limpiar cache para forzar nueva generación
        try {
          const { UniversalCacheManager } = await import('@/lib/universal-cache');
          await UniversalCacheManager.clearAllCache();
          sessionStorage.removeItem('currentRecipes');
          console.log('🧹 Cache cleared for new recipe generation');
        } catch (error) {
          console.error('Error clearing cache:', error);
        }

        // Redirigir a generar UNA nueva receta con los ingredientes actualizados
        const ingredientsParam = encodeURIComponent(
          JSON.stringify(ingredients.map(ing => ing.name))
        );
        const redirectUrl = `/recipes?ingredients=${ingredientsParam}&servings=${selectedServings}&force=true&editMode=true&originalId=${editingRecipeId}&recipeTitle=${encodeURIComponent(recipeTitle.trim())}&count=1`;
        console.log('🔄 Redirecting to generate ONE new recipe:', redirectUrl);
        router.push(redirectUrl);
        return;
      } else if (changeType === 'servings') {
        console.log('📊 Servings changed, recalculating ingredients...');

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
              console.log('✅ Recipe servings updated successfully');
              toast.success(`Recipe updated for ${selectedServings} servings!`);
              router.push('/my-recipes');
              return;
            }
          } catch (error) {
            console.error('Error recalculating servings:', error);
          }
        }
      }

      // Si solo se cambió el título, actualizar metadatos
      console.log('📝 Title only changed, updating recipe metadata...');

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
        console.log('✅ Recipe metadata updated successfully');
        toast.success('Title updated successfully!');
        router.push('/my-recipes');
      } else {
        throw new Error('Failed to update recipe');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Error saving recipe. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    if (!selectedServings) {
      toast.error('Please select the number of servings');
      return;
    }

    setIsCreating(true);

    try {
      // 🚀 SOLUCIÓN: Solo redirigir, no hacer request aquí
      // El RecipesPage se encargará de hacer el request único
      const ingredientsParam = encodeURIComponent(JSON.stringify(ingredients.map(ing => ing.name)));
      const redirectUrl = `/recipes?ingredients=${ingredientsParam}&servings=${selectedServings}&count=4`;
      console.log('Redirigiendo a página de recetas múltiples:', redirectUrl);
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error redirecting to recipes page:', error);
      toast.error('Error redirecting to recipes page. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <MainLayout showMenu={true} userName={userName} currentPage='create'>
      {/* Mensaje de Bienvenida */}
      <h2
        className='mb-4 text-white'
        style={{
          fontSize: typography.styles['body-large'].fontSize,
          fontWeight: typography.styles['body-large'].fontWeight,
          color: colors.interface.text.primary,
        }}
      >
        Welcome {userName}
      </h2>

      {/* Título Principal */}
      <h1
        className='mb-6 text-center lg:text-left leading-tight'
        style={{
          fontSize: typography.styles['title-1'].fontSize,
          fontWeight: typography.styles['title-1'].fontWeight,
          lineHeight: typography.styles['title-1'].lineHeight,
          letterSpacing: typography.styles['title-1'].letterSpacing,
          color: colors.interface.text.primary,
        }}
      >
        {isEditing ? 'Edit your recipe' : 'Create your perfect recipe'}
      </h1>

      {/* Campo de Título de la Receta - Solo en modo edición */}
      {isEditing && (
        <div className='mb-8'>
          <h3
            className='mb-4'
            style={{
              fontSize: typography.styles['title-3'].fontSize,
              fontWeight: typography.styles['title-3'].fontWeight,
              color: colors.interface.text.primary,
            }}
          >
            Recipe Title
          </h3>
          <input
            type='text'
            value={recipeTitle}
            onChange={e => setRecipeTitle(e.target.value)}
            placeholder='Enter recipe title...'
            className='w-full max-w-md px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200'
            style={{
              fontSize: typography.styles['body'].fontSize,
            }}
          />
        </div>
      )}

      {/* Sección de Ingredientes */}
      <div className='mb-8'>
        <h3
          className='mb-4'
          style={{
            fontSize: typography.styles['title-3'].fontSize,
            fontWeight: typography.styles['title-3'].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          Ingredients
        </h3>

        {/* Input para agregar ingredientes */}
        <div className='flex gap-2 mb-4'>
          <input
            type='text'
            value={newIngredient}
            onChange={e => setNewIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Add an ingredient...'
            className='w-80 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200'
            style={{
              fontSize: typography.styles['body'].fontSize,
            }}
          />
          <Button variant='secondary' onClick={handleAddIngredient} className='px-6'>
            +
          </Button>
        </div>

        {/* Lista de ingredientes */}
        {ingredients.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {ingredients.map(ingredient => (
              <div
                key={ingredient.id}
                className='group relative flex items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200'
                style={{
                  backgroundColor: colors.interface.background.secondary,
                }}
              >
                <span className='text-sm text-center' style={{ color: colors.brand.primary[500] }}>
                  {ingredient.name}
                </span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className='absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-red-500 text-white hover:bg-red-600'
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
        <h3
          className='mb-4'
          style={{
            fontSize: typography.styles['title-3'].fontSize,
            fontWeight: typography.styles['title-3'].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          Servings
        </h3>

        {/* Botones de selección rápida - solo se muestran si no está en modo custom */}
        {!showCustomInput && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {[1, 2, 4, 6, 8].map(servings => (
              <Button
                key={servings}
                variant={selectedServings === servings ? 'primary' : 'secondary'}
                onClick={() => handleServingsChange(servings)}
                className='px-4 py-2'
              >
                {servings}
              </Button>
            ))}
            <Button
              variant='secondary'
              onClick={() => setShowCustomInput(true)}
              className='px-4 py-2'
            >
              +
            </Button>
          </div>
        )}

        {/* Input personalizado - solo se muestra cuando está en modo custom */}
        {showCustomInput && (
          <div className='flex gap-2'>
            <input
              type='number'
              value={newCustomServing}
              onChange={e => setNewCustomServing(e.target.value)}
              placeholder='Add numberts'
              className='w-40 px-3 py-2 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500'
              min='1'
            />
            <Button
              variant='secondary'
              onClick={() => setShowCustomInput(false)}
              className='w-10 h-10 flex items-center justify-center'
            >
              ×
            </Button>
            <Button
              variant='secondary'
              onClick={handleCustomServings}
              className='w-10 h-10 flex items-center justify-center'
            >
              +
            </Button>
          </div>
        )}
      </div>

      {/* Botón de Crear/Guardar Receta */}
      <div className='flex gap-4'>
        <Button
          variant='primary'
          onClick={isEditing ? handleSaveRecipe : handleCreateRecipe}
          disabled={
            isCreating ||
            ingredients.length === 0 ||
            !selectedServings ||
            (isEditing && !recipeTitle.trim())
          }
          className='px-8 py-3'
        >
          {isCreating
            ? isEditing
              ? 'Saving recipe...'
              : 'Creating recipe...'
            : isEditing
              ? 'Update Recipe'
              : 'Create Recipe'}
        </Button>
        <Button
          variant='secondary'
          onClick={() => router.push('/my-recipes')}
          className='px-6 py-3'
        >
          My Recipes
        </Button>
      </div>
    </MainLayout>
  );
}
