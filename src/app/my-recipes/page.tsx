'use client';

import Button from '@/components/Button';
import { LazyDeleteConfirmationModal, LazyRecipeCard } from '@/components/lazy/LazyComponents';
import { SuspenseWrapper } from '@/components/lazy/SuspenseWrapper';
import Nav from '@/components/Nav';
import { useAuthUnified } from '@/hooks';
import { useSavedRecipesStore, useToastStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

interface FrontendRecipe {
  id?: string;
  title: string;
  servings: number;
  cookingTime: string;
  difficulty: string;
  image?: string;
  source: string;
  ingredients?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions?: string[];
  description?: string;
  savedAt?: string;
}

export default function MyRecipesPage() {
  const { user, isLoading } = useAuthUnified();
  const router = useRouter();

  // Usar stores de Zustand directamente
  const savedRecipes = useSavedRecipesStore(state => state.savedRecipes);
  const loading = useSavedRecipesStore(state => state.isLoading);
  const removeRecipeAction = useSavedRecipesStore(state => state.removeRecipe);
  const showSuccess = useToastStore(state => state.showSuccess);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<FrontendRecipe | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detectar scroll automáticamente para actualizar el punto activo
  useEffect(() => {
    if (!isClient || savedRecipes.length === 0) return;

    const container = document.querySelector(
      '[data-testid="saved-recipes-container"]'
    ) as HTMLElement;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;

      // Encontrar qué receta está más visible
      let mostVisibleIndex = 0;
      let maxVisibility = 0;

      Array.from(container.children).forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const childLeft = childRect.left;
        const childRight = childRect.right;

        // Calcular qué tan visible está la receta
        const visibleLeft = Math.max(containerLeft, childLeft);
        const visibleRight = Math.min(containerLeft + container.offsetWidth, childRight);
        const visibility = Math.max(0, visibleRight - visibleLeft);

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = index;
        }
      });

      setActiveIndex(mostVisibleIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [savedRecipes.length, isClient]);

  // Si no está logueado, redirigir al login (solo en cliente)
  useEffect(() => {
    if (!user && isClient) {
      router.push('/auth/login');
    }
  }, [user, isClient, router]);

  // Si no está logueado, mostrar loading
  if (!user) {
    return (
      <div className='h-screen overflow-hidden bg-canvas text-fg'>
        <Nav showMenu={true} userName="Loading..." currentPage='my-recipes' />
        <div className='flex items-center justify-center h-[calc(100vh-120px)]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleDeleteClick = (recipe: FrontendRecipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete && recipeToDelete.id && user?.id) {
      const success = removeRecipeAction(recipeToDelete.id, user.id);
      if (success) {
        showSuccess('Recipe deleted successfully!');
      }
    }
    setShowDeleteModal(false);
    setRecipeToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRecipeToDelete(null);
  };

  const scrollToRecipe = (index: number) => {
    if (!isClient) return;

    const container = document.querySelector(
      '[data-testid="saved-recipes-container"]'
    ) as HTMLElement;
    if (container) {
      const recipeCard = container.children[index] as HTMLElement;
      if (recipeCard) {
        recipeCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
        setActiveIndex(index);
      }
    }
  };

  const handleShare = (recipe: FrontendRecipe) => {
    if (!isClient) return;

    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Recipe link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className='h-screen overflow-hidden bg-canvas text-fg'>
        <Nav showMenu={true} userName={user.name} currentPage='my-recipes' />
        <div className='flex items-center justify-center h-[calc(100vh-120px)]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p>Loading your recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen lg:h-screen lg:overflow-hidden bg-canvas text-fg'>
      <Nav showMenu={true} userName={user.name} currentPage='my-recipes' />

      <div className='max-w-page mx-auto px-lg lg:px-3xl py-xl mt-20 lg:h-[calc(100vh-120px)] flex flex-col'>
        {/* Header */}
        <div className='flex items-start gap-4 mb-8'>
          <button
            onClick={handleBackToHome}
            aria-label='Back to home'
            className='w-12 h-12 rounded-2xl transition-colors border-2 flex items-center justify-center bg-surface text-fg border-surface hover:bg-elevated hover:border-elevated'
          >
            <IoIosArrowBack className='text-xl' />
          </button>
          <div>
            <p className='text-sm text-muted'>
              {user?.name ? `${user.name}, ` : ''}these are your saved recipes
            </p>
            <h1
              className='text-2xl font-bold leading-tight tracking-tight text-fg'
              data-testid='my-recipes-title'
            >
              Recipes you created like a true chef
            </h1>
          </div>
        </div>

        {/* Contenido */}
        {savedRecipes.length === 0 ? (
          <div className='text-center py-20' data-testid='empty-state'>
            <div className='text-6xl mb-4'>🍽️</div>
            <h2 className='text-2xl font-bold mb-2 text-fg'>
              No saved recipes yet
            </h2>
            <p className='mb-6 text-muted'>
              Start creating recipes and save your favorites to see them here
            </p>
            <Button variant='secondary' onClick={handleBackToHome}>
              Back to Home
            </Button>
          </div>
        ) : (
          <div className='relative flex-1 flex flex-col'>
            {/* Card collection — vertical list on mobile, horizontal carousel on desktop */}
            <div
              className='flex flex-col gap-lg lg:flex-row lg:gap-6 lg:overflow-x-auto lg:overflow-y-hidden lg:scrollbar-hide lg:flex-1 lg:items-center pt-3 pb-1.5'
              data-testid='saved-recipes-container'
            >
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className='w-full lg:w-80 lg:flex-shrink-0'>
                  <SuspenseWrapper minHeight='400px'>
                    <LazyRecipeCard
                      recipe={recipe}
                      variant='my-recipes'
                      onEdit={recipe => {
                        // Guardar los datos de la receta en localStorage para editarlos
                        const editData = {
                          title: recipe.title,
                          ingredients: (recipe as any).ingredients || [],
                          servings: recipe.servings,
                          cookingTime: recipe.cookingTime,
                          difficulty: recipe.difficulty || 'medium',
                          cuisine: 'international',
                          instructions: (recipe as any).instructions || [],
                          isEditing: true,
                          originalId: recipe.id,
                        };

                        localStorage.setItem('editRecipeData', JSON.stringify(editData));
                        router.push('/create?edit=true');
                      }}
                      onDelete={recipeId => {
                        const recipe = savedRecipes.find(r => r.id === recipeId);
                        if (recipe) {
                          handleDeleteClick(recipe);
                        }
                      }}
                      onShare={recipe => handleShare(recipe as any)}
                    />
                  </SuspenseWrapper>
                </div>
              ))}
            </div>

            {/* Scroll Indicator - desktop carousel navigation only */}
            <div className='hidden lg:flex justify-center mt-2'>
              <div className='flex gap-2'>
                {savedRecipes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToRecipe(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${
                      index === activeIndex
                        ? 'bg-primary opacity-100'
                        : 'bg-elevated opacity-50'
                    }`}
                    aria-label={`Go to recipe ${index + 1}`}
                    title={`Go to recipe ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <SuspenseWrapper minHeight='200px'>
          <LazyDeleteConfirmationModal
            isOpen={showDeleteModal}
            title={recipeToDelete?.title || ''}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </SuspenseWrapper>
      </div>
    </div>
  );
}
