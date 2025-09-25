'use client';

import Button from '@/components/Button';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import IngredientsCard from '@/components/IngredientsCard';
import Nav from '@/components/Nav';
import { colors } from '@/design-system';
import { useAuthUnified } from '@/hooks';
import { useSavedRecipesStore, useToastStore } from '@/stores';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiPlus, BiShare, BiShareAlt, BiTime, BiUser } from 'react-icons/bi';
import { FaPencil } from 'react-icons/fa6';
import { IoIosArrowBack } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';

interface Recipe {
  id: string;
  title: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  cookingTime: string;
  difficulty: string;
  cuisine?: string;
  servings: number;
  image?: string;
  source: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthUnified();
  const savedRecipes = useSavedRecipesStore(state => state.savedRecipes);
  const saveRecipe = useSavedRecipesStore(state => state.saveRecipe);
  const removeRecipe = useSavedRecipesStore(state => state.removeRecipe);
  const showSuccess = useToastStore(state => state.showSuccess);
  const showError = useToastStore(state => state.showError);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFromMyRecipes, setIsFromMyRecipes] = useState(false);
  const [isRecipeSavedState, setIsRecipeSavedState] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadRecipe = () => {
      try {
        setLoading(true);

        // Verificar si viene desde My Recipes
        const urlParams = new URLSearchParams(window.location.search);
        const isFromMyRecipesParam = urlParams.get('from') === 'my-recipes';
        const referrer = document.referrer;
        const isFromMyRecipesReferrer = referrer.includes('/my-recipes');

        const isFromMyRecipesPage = isFromMyRecipesParam || isFromMyRecipesReferrer;
        setIsFromMyRecipes(isFromMyRecipesPage);

        console.log('Current URL:', window.location.href);
        console.log('URL params:', urlParams.toString());
        console.log('From My Recipes param:', isFromMyRecipesParam);
        console.log('From My Recipes referrer:', isFromMyRecipesReferrer);
        console.log('From My Recipes final:', isFromMyRecipesPage);

        // Buscar la receta en localStorage usando el ID de la URL
        const savedRecipe = localStorage.getItem(`recipe-${params.id}`);

        if (savedRecipe) {
          const recipeData = JSON.parse(savedRecipe);
          console.log('Loaded recipe from localStorage:', recipeData);

          setRecipe(recipeData);

          // Verificar si la receta está realmente guardada por el usuario
          if (user) {
            // Verificar directamente en el store de Zustand si la receta está en la lista de guardadas
            const isActuallySaved = savedRecipes.some(r => r.id === recipeData.id);

            // Solo considerar como guardada si viene de My Recipes O si está realmente guardada
            const finalSavedState = isFromMyRecipesPage || isActuallySaved;
            setIsRecipeSavedState(finalSavedState);

            console.log('🔍 DEBUG - Recipe ID:', recipeData.id);
            console.log('🔍 DEBUG - Recipe actually saved:', isActuallySaved);
            console.log('🔍 DEBUG - From My Recipes:', isFromMyRecipesPage);
            console.log('🔍 DEBUG - Final saved state:', finalSavedState);
            console.log('🔍 DEBUG - User ID:', user.id);
          }
        } else {
          console.log('No recipe found in localStorage for ID:', params.id);
          router.push('/recipes');
          return;
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        router.push('/recipes');
        return;
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.id, router, user, savedRecipes]);

  // useEffect separado para actualizar el estado cuando cambien las recetas guardadas
  useEffect(() => {
    if (user && recipe) {
      const isActuallySaved = savedRecipes.some(r => r.id === recipe.id);
      const finalSavedState = isFromMyRecipes || isActuallySaved;
      setIsRecipeSavedState(finalSavedState);

      console.log('🔍 DEBUG - Updated saved state:', finalSavedState);
    }
  }, [savedRecipes, user, recipe, isFromMyRecipes]);

  // Debug useEffect para monitorear cambios
  useEffect(() => {
    console.log(
      'Button condition - isFromMyRecipes:',
      isFromMyRecipes,
      'isRecipeSavedState:',
      isRecipeSavedState,
      'Final condition:',
      isFromMyRecipes || isRecipeSavedState,
      'Recipe ID:',
      recipe?.id,
      'User:',
      user?.id
    );
  }, [isFromMyRecipes, isRecipeSavedState, recipe?.id, user?.id]);

  const handleSaveRecipe = () => {
    if (!recipe) {
      console.log('No recipe available');
      return;
    }

    if (!user) {
      console.log('No user available');
      showError('Please log in to save recipes');
      return;
    }

    console.log('Saving recipe:', recipe.title, 'with ID:', recipe.id);

    try {
      let success = false;

      if (isRecipeSavedState) {
        // Si ya está guardada, la removemos
        success = removeRecipe(recipe.id, user.id);
        if (success) {
          setIsRecipeSavedState(false);
          showSuccess('Recipe removed from favorites!');
        }
      } else {
        // Si no está guardada, la guardamos
        success = saveRecipe(recipe, user.id);
        if (success) {
          setIsRecipeSavedState(true);
          showSuccess('Recipe saved to favorites!');
        }
      }

      console.log('Toggle save result:', success);

      // Si se guardó la receta, eliminar de la lista de recetas generadas
      if (success && !isRecipeSavedState) {
        // Eliminar la receta de sessionStorage para que no aparezca en la lista
        const currentRecipes = sessionStorage.getItem('currentRecipes');
        if (currentRecipes) {
          try {
            const parsedRecipes = JSON.parse(currentRecipes);
            const updatedRecipes = parsedRecipes.filter(
              (r: Record<string, unknown>) => r.id !== recipe.id
            );
            sessionStorage.setItem('currentRecipes', JSON.stringify(updatedRecipes));
            console.log('🗑️ Removed recipe from sessionStorage:', recipe.id);
          } catch (error) {
            console.error('Error updating sessionStorage:', error);
          }
        }

        setTimeout(() => {
          // Redirigir a la página de recetas
          router.push('/recipes');
        }, 1000); // Esperar 1 segundo para que se vea la notificación
      }

      if (!success) {
        showError('Error saving recipe');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      showError('Error saving recipe');
    }
  };

  const handleEditRecipe = () => {
    if (!recipe) return;

    // Guardar los datos de la receta en localStorage para editarlos
    const editData = {
      title: recipe.title,
      ingredients: recipe.ingredients || [],
      servings: recipe.servings,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty || 'medium',
      cuisine: 'international',
      instructions: recipe.instructions || [],
      image: recipe.image, // ✅ Preservar la imagen original
      isEditing: true,
      originalId: recipe.id,
    };

    localStorage.setItem('editRecipeData', JSON.stringify(editData));
    router.push('/create?edit=true');
  };

  const handleDeleteRecipe = () => {
    if (!recipe) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!recipe || !user) return;
    removeRecipe(recipe.id, user.id);
    setShowDeleteModal(false);
    router.push('/my-recipes');
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleShareRecipe = () => {
    if (!recipe) return;

    // Implementar funcionalidad de compartir
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div
        className='min-h-screen'
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user?.name || 'User'} />
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <div
              className='animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4'
              style={{ borderColor: colors.brand.primary[500] }}
            ></div>
            <p className='text-lg' style={{ color: colors.interface.text.primary }}>
              Loading recipe...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div
        className='min-h-screen'
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user?.name || 'User'} />
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <h1
              className='text-2xl font-bold mb-4'
              style={{ color: colors.interface.text.primary }}
            >
              Recipe not found
            </h1>
            <Button variant='primary' onClick={() => router.push('/recipes')} className='px-6 py-2'>
              Back to Recipes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen' style={{ backgroundColor: colors.interface.background.primary }}>
      <Nav showMenu={true} userName={user?.name || 'User'} />

      <div className='max-w-6xl mx-auto px-4 py-8 mt-20'>
        {/* Recipe Header */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
            <div className='flex items-start gap-4 flex-1'>
              <Button variant='tertiary' onClick={() => router.back()} className='mt-1 !p-0'>
                <IoIosArrowBack className='text-xl' />
              </Button>
              <div className='flex-1'>
                <h1
                  className='text-4xl font-bold mb-4'
                  style={{ color: colors.interface.text.primary }}
                >
                  {recipe.title}
                </h1>
                <div
                  className='flex items-center gap-6'
                  style={{ color: colors.interface.text.secondary }}
                >
                  <div className='flex items-center gap-2'>
                    <BiUser style={{ color: colors.brand.primary[500] }} />
                    <span>for {recipe.servings} people</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <BiTime style={{ color: colors.brand.primary[500] }} />
                    <span>duration {recipe.cookingTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-3 flex-shrink-0'>
              {/* Mostrar botones de receta guardada solo si viene de My Recipes O si está realmente guardada */}
              {isFromMyRecipes || isRecipeSavedState ? (
                // Si la receta está guardada, mostrar Edit/Delete/Share
                <>
                  <Button
                    variant='secondary'
                    onClick={() => handleEditRecipe()}
                    className='px-6 py-3 flex items-center gap-2'
                  >
                    <FaPencil className='text-lg' />
                    Edit
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => handleDeleteRecipe()}
                    className='px-6 py-3 flex items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500'
                  >
                    <MdDelete className='text-lg' />
                    Delete
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => handleShareRecipe()}
                    className='px-6 py-3 flex items-center gap-2'
                  >
                    <BiShare className='text-lg' />
                    Share
                  </Button>
                </>
              ) : (
                // Si la receta NO está guardada, mostrar Save/Share
                <>
                  <Button
                    variant={isRecipeSavedState ? 'secondary' : 'primary'}
                    onClick={() => handleSaveRecipe()}
                    className='px-6 py-3 flex items-center gap-2'
                  >
                    {isRecipeSavedState ? (
                      <span className='text-lg'>✓</span>
                    ) : (
                      <BiPlus className='text-lg' />
                    )}
                    {isRecipeSavedState ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => handleShareRecipe()}
                    className='px-6 py-3 flex items-center gap-2'
                  >
                    <BiShareAlt className='text-lg' />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 overflow-hidden'>
          {/* Recipe Image - LEFT COLUMN (2/3 del ancho - más grande) */}
          <div className='lg:col-span-2'>
            <div className='relative rounded-2xl overflow-hidden h-[500px] w-full'>
              {recipe.image && !imageError ? (
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className='object-cover'
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImagePlaceholder
                  title={recipe.title}
                  cuisine={recipe.cuisine || 'International'}
                  className='h-[500px] w-full'
                  ingredients={recipe.ingredients.map(ing => ing.name)}
                />
              )}
            </div>
          </div>

          {/* Ingredients - RIGHT COLUMN (al lado de la imagen) */}
          <div className='lg:col-span-1 min-w-0'>
            <IngredientsCard
              ingredients={recipe.ingredients || []}
              servings={recipe.servings}
              imageHeight={500}
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h2 className='text-2xl font-bold mb-8' style={{ color: colors.interface.text.primary }}>
            Instructions
          </h2>

          <div className='space-y-6'>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => (
                <div key={index} className='flex gap-4'>
                  <div
                    className='flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold'
                    style={{
                      backgroundColor: colors.brand.primary[500],
                      color: colors.base.white,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className='flex-1'>
                    <p
                      className='leading-relaxed text-lg'
                      style={{ color: colors.interface.text.primary }}
                    >
                      {instruction}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-400' style={{ color: colors.interface.text.secondary }}>
                No instructions available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={recipe?.title || ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
