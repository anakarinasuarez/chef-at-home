'use client';

import Button from '@/components/Button';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import IngredientsCard from '@/components/IngredientsCard';
import Nav from '@/components/Nav';
import Badge from '@/components/ui/Badge';
import { useAuthUnified } from '@/hooks';
import { useSavedRecipesStore, useToastStore } from '@/stores';
import Image from 'next/image';
import { recipeStockPhoto } from '@/lib/recipeImage';
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
  stepImages?: string[];
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
  const [editMode, setEditMode] = useState(false);

  // Always show a coherent food photo: real image → dish-name stock photo.
  const displayImage =
    recipe?.image && recipe.image !== '/images/plate.png'
      ? recipe.image
      : recipe
        ? recipeStockPhoto(recipe.title, recipe.cuisine)
        : '/images/plate.png';

  useEffect(() => {
    const loadRecipe = () => {
      try {
        setLoading(true);
        console.log('🔧 DEBUG: Loading recipe with ID:', params.id);

        // Verificar si viene desde My Recipes
        const urlParams = new URLSearchParams(window.location.search);
        const isFromMyRecipesParam = urlParams.get('from') === 'my-recipes';
        const referrer = document.referrer;
        const isFromMyRecipesReferrer = referrer.includes('/my-recipes');

        const isFromMyRecipesPage = isFromMyRecipesParam || isFromMyRecipesReferrer;
        setIsFromMyRecipes(isFromMyRecipesPage);

        // Verificar si estamos en modo edición
        const editModeParam = urlParams.get('editMode') === 'true';
        setEditMode(editModeParam);

        console.log('Current URL:', window.location.href);
        console.log('URL params:', urlParams.toString());
        console.log('From My Recipes param:', isFromMyRecipesParam);
        console.log('From My Recipes referrer:', isFromMyRecipesReferrer);
        console.log('From My Recipes final:', isFromMyRecipesPage);

        // Buscar la receta en localStorage usando el ID de la URL y userId
        const savedRecipe = localStorage.getItem(`recipe-${user?.id}-${params.id}`);

        if (savedRecipe) {
          const recipeData = JSON.parse(savedRecipe);
          console.log('Loaded recipe from localStorage:', recipeData);
          console.log('🔧 DEBUG: Recipe ingredients in localStorage:', recipeData.ingredients);

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

  const handleSaveRecipe = async () => {
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
        // 🚀 MODO EDICIÓN: Verificar si estamos en modo edición
        const urlParams = new URLSearchParams(window.location.search);
        const originalId = urlParams.get('originalId');

        if (editMode && originalId) {
          console.log('🔄 Edit mode: Replacing original recipe with new one...');
          try {
            const { useSavedRecipesStore } = await import('@/stores/savedRecipesStore');
            const updateRecipe = useSavedRecipesStore.getState().updateRecipe;

            // Reemplazar la receta original con la nueva
            const updatedRecipe = {
              ...recipe,
              id: originalId, // Mantener el ID original
              title: recipe.title, // Usar el título de la nueva receta
            };

            const success = updateRecipe(originalId, updatedRecipe, user.id);
            if (success) {
              console.log('✅ Original recipe replaced in edit mode');
              showSuccess('Recipe updated successfully!');
            } else {
              console.error('❌ Failed to update recipe');
              showError('Failed to update recipe');
            }
          } catch (error) {
            console.error('❌ Error updating original recipe:', error);
            showError('Error updating recipe');
          }
        }

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
      }

      // Navegación después de guardar (siempre se ejecuta si hay éxito)
      if (success) {
        setTimeout(() => {
          // Si venimos de edit mode, ir a My Recipes en lugar de Generated Recipes
          const urlParams = new URLSearchParams(window.location.search);
          const fromEdit = urlParams.get('fromEdit') === 'true';

          console.log('🔧 DEBUG: Navigation after save:', {
            currentUrl: window.location.href,
            urlParams: urlParams.toString(),
            fromEdit,
            editMode,
          });

          if (fromEdit) {
            console.log('🔧 DEBUG: Navigating to /my-recipes (fromEdit=true)');
            router.push('/my-recipes');
          } else {
            console.log('🔧 DEBUG: Navigating to /recipes (fromEdit=false)');
            router.push('/recipes');
          }
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
      <div className='min-h-screen bg-canvas'>
        <Nav showMenu={true} userName={user?.name || 'User'} />
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-lg text-fg'>Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className='min-h-screen bg-canvas'>
        <Nav showMenu={true} userName={user?.name || 'User'} />
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold mb-4 text-fg'>
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
    <div className='min-h-screen bg-canvas'>
      <Nav showMenu={true} userName={user?.name || 'User'} />

      {/* MOBILE layout — Figma "Recipe detail — Mobile" */}
      <div className='lg:hidden max-w-page mx-auto px-lg py-xl mt-20'>
        {/* Back row + compact title */}
        <div className='flex items-center gap-sm mb-lg'>
          <button
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search);
              if (urlParams.get('fromEdit') === 'true') {
                router.push('/my-recipes');
              } else {
                router.back();
              }
            }}
            aria-label='Back'
            className='text-fg transition-colors hover:text-primary'
          >
            <IoIosArrowBack className='text-xl' />
          </button>
          <span className='truncate font-semibold text-fg'>{recipe.title}</span>
        </div>

        {/* Banner */}
        <div className='relative w-full h-[220px] rounded-lg overflow-hidden mb-md'>
          {displayImage && !imageError ? (
            <Image
              src={displayImage}
              alt={recipe.title}
              fill
              className='object-cover'
              onError={() => setImageError(true)}
              priority
              unoptimized
            />
          ) : (
            <ImagePlaceholder
              title={recipe.title}
              cuisine={recipe.cuisine || 'International'}
              className='h-full w-full'
              ingredients={recipe.ingredients.map(ing => ing.name)}
            />
          )}
        </div>

        {/* Meta */}
        <p className='mb-xl text-sm text-muted'>
          for {recipe.servings} people · duration {recipe.cookingTime}
        </p>

        {/* Ingredients card */}
        <div className='mb-xl rounded-lg bg-surface p-xl'>
          <div className='mb-lg flex items-center justify-between'>
            <h2 className='text-xl font-bold text-fg'>Ingredients</h2>
            <Badge variant='neutral'>{recipe.ingredients?.length ?? 0}</Badge>
          </div>
          <div className='flex flex-col gap-sm'>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ing, i) => (
                <div key={i} className='flex items-center justify-between gap-md'>
                  <span className='text-fg'>• {ing.name}</span>
                  <span className='whitespace-nowrap text-muted'>
                    {ing.quantity}
                    {ing.unit}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-muted'>No ingredients available</p>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className='mb-xl'>
          <h2 className='mb-lg text-xl font-bold text-fg'>Steps</h2>
          <div className='flex flex-col gap-xl'>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => (
                <div key={index} className='flex flex-col gap-sm'>
                  <p className='text-sm text-muted'>
                    Step{' '}
                    <span className='font-semibold text-primary'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </p>
                  <p className='leading-relaxed text-fg'>{instruction}</p>
                  {(() => {
                    // Coherent step photo: rotate through the dish's Pexels
                    // photos; otherwise a per-step dish-name stock photo. Always
                    // shows something coherent (never blank).
                    const stepImg =
                      recipe.stepImages && recipe.stepImages.length > 0
                        ? recipe.stepImages[index % recipe.stepImages.length]
                        : recipeStockPhoto(recipe.title, recipe.cuisine, {
                            w: 326,
                            h: 180,
                            seed: `step-${index}`,
                          });
                    return (
                      <div className='relative h-[180px] w-full max-w-[326px] overflow-hidden rounded-md bg-elevated'>
                        <Image
                          src={stepImg}
                          alt={`Step ${index + 1} — ${recipe.title}`}
                          fill
                          sizes='326px'
                          className='object-cover'
                          unoptimized
                        />
                      </div>
                    );
                  })()}
                </div>
              ))
            ) : (
              <p className='text-muted'>No instructions available</p>
            )}
          </div>
        </div>

        {/* Spacer so the fixed action bar never covers content */}
        <div className='h-24' aria-hidden='true' />
      </div>

      {/* MOBILE ActionBar — bottom-pinned */}
      <div className='lg:hidden fixed inset-x-0 bottom-0 z-40 flex gap-md border-t border-border bg-surface px-lg py-md'>
        {isFromMyRecipes || isRecipeSavedState ? (
          <>
            <Button
              variant='secondary'
              onClick={() => handleEditRecipe()}
              className='flex-1'
            >
              Edit
            </Button>
            <Button
              variant='secondary'
              onClick={() => handleShareRecipe()}
              className='flex-1'
            >
              Share
            </Button>
            <Button
              variant='danger'
              onClick={() => handleDeleteRecipe()}
              className='flex-1'
            >
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={isRecipeSavedState ? 'secondary' : 'primary'}
              onClick={() => handleSaveRecipe()}
              className='flex-1 flex items-center justify-center gap-2'
            >
              {isRecipeSavedState ? (
                <span className='text-lg'>✓</span>
              ) : (
                <BiPlus className='text-lg' />
              )}
              {isRecipeSavedState ? 'Saved' : editMode ? 'Update' : 'Save'}
            </Button>
            <Button
              variant='secondary'
              onClick={() => handleShareRecipe()}
              className='flex-1 flex items-center justify-center gap-2'
            >
              <BiShareAlt className='text-lg' />
              Share
            </Button>
          </>
        )}
      </div>

      {/* DESKTOP layout — unchanged from before */}
      <div className='hidden lg:block max-w-page mx-auto px-3xl py-xl mt-20'>
        {/* Recipe Header */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
            <div className='flex items-start gap-4 flex-1'>
              <Button
                variant='tertiary'
                onClick={() => {
                  // Si venimos de edit mode, ir a My Recipes en lugar de volver atrás
                  const urlParams = new URLSearchParams(window.location.search);
                  const fromEdit = urlParams.get('fromEdit') === 'true';

                  if (fromEdit) {
                    router.push('/my-recipes');
                  } else {
                    router.back();
                  }
                }}
                className='mt-1 !p-0'
              >
                <IoIosArrowBack className='text-xl' />
              </Button>
              <div className='flex-1'>
                <h1 className='text-4xl font-bold mb-4 text-fg'>
                  {recipe.title}
                </h1>
                <div className='flex items-center gap-6 text-muted'>
                  <div className='flex items-center gap-2'>
                    <BiUser className='text-primary' />
                    <span>for {recipe.servings} people</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <BiTime className='text-primary' />
                    <span>duration {recipe.cookingTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-3 lg:flex-shrink-0'>
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
                    className='px-6 py-3 flex items-center gap-2 hover:bg-danger hover:text-on-primary hover:border-danger'
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
                    {isRecipeSavedState ? 'Saved' : editMode ? 'Update Recipe' : 'Save'}
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
              {displayImage && !imageError ? (
                <Image
                  src={displayImage}
                  alt={recipe.title}
                  fill
                  className='object-cover'
                  onError={() => setImageError(true)}
                  priority
                  unoptimized
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

            {/* No regenerate button - only use existing images */}
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

        {/* Instructions — stacked steps; each step is number + text, readable at both breakpoints */}
        <div>
          <h2 className='text-2xl font-bold mb-8 text-fg'>Instructions</h2>

          <div className='space-y-6'>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => {
                // Coherent step photo (same source as mobile): Pexels/TheMealDB
                // dish photos, else a per-step dish stock photo. Always shows.
                const stepImg =
                  recipe.stepImages && recipe.stepImages.length > 0
                    ? recipe.stepImages[index % recipe.stepImages.length]
                    : recipeStockPhoto(recipe.title, recipe.cuisine, {
                        w: 400,
                        h: 260,
                        seed: `step-${index}`,
                      });
                return (
                  <div
                    key={index}
                    className='flex flex-col sm:flex-row gap-4 items-start'
                  >
                    <div className='flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary text-on-primary'>
                      {index + 1}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='leading-relaxed text-lg text-fg'>
                        {instruction}
                      </p>
                    </div>
                    <div className='relative h-[160px] w-full sm:w-[280px] sm:flex-shrink-0 overflow-hidden rounded-lg bg-elevated'>
                      <Image
                        src={stepImg}
                        alt={`Step ${index + 1} — ${recipe.title}`}
                        fill
                        sizes='280px'
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className='text-muted'>No instructions available</p>
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
