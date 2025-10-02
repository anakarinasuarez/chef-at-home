'use client';

import { LazyRecipeCard } from '@/components/lazy/LazyComponents';
import { SuspenseWrapper } from '@/components/lazy/SuspenseWrapper';
import Nav from '@/components/Nav';
import { colors } from '@/design-system';
import { useAuthUnified } from '@/hooks';
import { UniversalCacheManager } from '@/lib/universal-cache';
import { deduplicateIngredientsNumeric } from '@/utils/ingredientUtils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookingTime: string;
  image?: string;
  source: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}

export default function RecipesPage() {
  const { user } = useAuthUnified();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);
  const [removingRecipeId, setRemovingRecipeId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get URL params safely
  const getUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  // Debug: Log recipes state changes
  useEffect(() => {
    console.log('🔧 DEBUG: Recipes state changed:', recipes.length, 'recipes');
    if (recipes.length > 0) {
      console.log('🔧 DEBUG: First recipe:', recipes[0]);
    }
  }, [recipes]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Generate recipes with AI when component mounts
  useEffect(() => {
    if (!isClient) return;

    console.log(
      '🚀 useEffect triggered - hasLoadedRecipes:',
      hasLoadedRecipes,
      'recipes count:',
      recipes.length
    );

    // Si ya tenemos recetas cargadas, no hacer nada
    if (recipes.length > 0) {
      console.log('📦 Recipes already loaded, skipping generation');
      setLoading(false);
      return;
    }

    // Si ya se cargaron recetas anteriormente, no regenerar
    if (hasLoadedRecipes) {
      console.log('📦 Recipes were already loaded, skipping generation');
      setLoading(false);
      return;
    }

    // Si estamos en modo edición y no hay recetas, no generar automáticamente
    const urlParams = getUrlParams();
    const editMode = urlParams.get('editMode') === 'true';
    const forceGenerate = urlParams.get('force') === 'true';
    const fromEdit = urlParams.get('fromEdit') === 'true';

    // Solo evitar generación si es modo edición SIN force=true
    if (editMode && !forceGenerate && recipes.length === 0) {
      console.log('📦 Edit mode detected without force, not generating automatically');
      setLoading(false);
      return;
    }

    // Si venimos de edit mode, no generar recetas automáticamente
    if (fromEdit) {
      console.log('📦 Coming from edit mode, not generating recipes automatically');
      // Limpiar la URL para evitar regeneración
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/recipes');
      }
      setLoading(false);
      return;
    }

    const generateRecipes = async () => {
      console.log('🔄 generateRecipes function called');

      // Solo cargar desde sessionStorage si NO hay parámetros de generación
      const urlParams = getUrlParams();
      const forceGenerate = urlParams.get('force') === 'true';
      const ingredientsParam = urlParams.get('ingredients');
      const servingsParam = urlParams.get('servings');
      const editMode = urlParams.get('editMode') === 'true';
      const originalId = urlParams.get('originalId');
      const recipeTitle = urlParams.get('recipeTitle');
      const countParam = urlParams.get('count');

      const hasSpecificParams = ingredientsParam || servingsParam || forceGenerate;

      if (!hasSpecificParams) {
        // Verificar si hay recetas en sessionStorage solo si no hay parámetros específicos
        const savedRecipes = sessionStorage.getItem('currentRecipes');
        console.log('📦 Checking sessionStorage:', !!savedRecipes);

        if (savedRecipes) {
          try {
            const parsedRecipes = JSON.parse(savedRecipes);
            console.log('📦 Loading recipes from sessionStorage:', parsedRecipes.length);
            setRecipes(parsedRecipes);
            setHasLoadedRecipes(true);
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing saved recipes:', error);
          }
        }
      }

      // Si ya hemos cargado recetas, no hacer nada
      if (hasLoadedRecipes) {
        console.log('📦 Recipes already loaded, skipping generation');
        setLoading(false);
        return;
      }

      // Initialize cache manager
      await UniversalCacheManager.initialize();

      setLoading(true);
      setError(null);

      try {
        // Get ingredients from URL params or localStorage
        const savedRecipeId = urlParams.get('saved');

        let ingredients = ['pasta', 'basil', 'olive oil', 'garlic', 'tomatoes']; // fallback
        let servings = 4; // fallback

        console.log('🔍 URL Params Debug:', {
          ingredientsParam,
          servingsParam,
          forceGenerate,
          savedRecipeId,
          hasSpecificParams,
          currentUrl: typeof window !== 'undefined' ? window.location.href : 'SSR',
        });

        // Si se guardó una receta desde el detalle, solo loggear (no eliminar del sessionStorage)
        if (savedRecipeId) {
          console.log('✅ Recipe saved from detail, keeping sessionStorage intact:', savedRecipeId);
        }

        if (!hasSpecificParams) {
          // Cargar recetas desde sessionStorage (ya sea después de guardar o normalmente)
          const savedRecipes = sessionStorage.getItem('currentRecipes');
          if (savedRecipes) {
            try {
              const parsedRecipes = JSON.parse(savedRecipes);
              console.log('📦 Loading recipes from sessionStorage:', parsedRecipes.length);
              setRecipes(parsedRecipes);
              setHasLoadedRecipes(true);
              setLoading(false);
              return;
            } catch (error) {
              console.error('Error parsing saved recipes:', error);
            }
          }

          console.log('🔄 No specific params found, checking for existing recipes');
          // Si no hay parámetros específicos, verificar si hay recetas existentes
          // Usar ingredientes por defecto solo si no hay recetas en cache
          ingredients = ['pasta', 'basil', 'olive oil', 'garlic', 'tomatoes'];
          servings = 4;
          console.log('🎯 Using default ingredients:', ingredients, 'servings:', servings);

          // Verificar cache antes de generar nuevas recetas
          try {
            const cachedRecipes = await UniversalCacheManager.getCachedRecipes(
              ingredients,
              servings
            );

            if (cachedRecipes && cachedRecipes.length > 0) {
              console.log('📦 Using cached default recipes:', cachedRecipes.length);
              setRecipes(cachedRecipes);
              setHasLoadedRecipes(true);
              setLoading(false);
              sessionStorage.setItem('currentRecipes', JSON.stringify(cachedRecipes));
              return;
            } else {
              console.log('❌ No cached default recipes found, will generate new ones');
            }
          } catch (error) {
            console.log('❌ Error checking cache for default recipes:', error);
          }
        } else if (!forceGenerate) {
          try {
            console.log('🔍 Checking cache for ingredients:', ingredients, 'servings:', servings);
            const cachedRecipes = await UniversalCacheManager.getCachedRecipes(
              ingredients,
              servings
            );

            if (cachedRecipes && cachedRecipes.length > 0) {
              console.log(
                '📦 Using cached recipes from UniversalCacheManager:',
                cachedRecipes.length,
                'recipes'
              );
              setRecipes(cachedRecipes);
              setHasLoadedRecipes(true);
              setLoading(false);

              // Guardar en sessionStorage para mantenerlas al navegar
              sessionStorage.setItem('currentRecipes', JSON.stringify(cachedRecipes));
              return;
            } else {
              console.log('❌ No cached recipes found for these ingredients');
            }
          } catch (error) {
            console.log('❌ Error checking cache:', error);
          }
        } else {
          console.log('🔄 Force generating new recipes (ignoring cache)');
          // Limpiar cache cuando se fuerza la generación
          try {
            await UniversalCacheManager.clearAllCache();
            sessionStorage.removeItem('currentRecipes');
            console.log('🧹 Cache and sessionStorage cleared for force generation');
          } catch (error) {
            console.log('❌ Error clearing cache:', error);
          }
        }

        if (ingredientsParam) {
          try {
            ingredients = JSON.parse(decodeURIComponent(ingredientsParam));
            console.log('📝 Using ingredients from URL:', ingredients);
          } catch (e) {
            console.log('Could not parse ingredients from URL');
          }
        } else {
          console.log('📝 No ingredients in URL, using fallback:', ingredients);
        }

        if (servingsParam) {
          servings = parseInt(servingsParam) || 4;
          console.log('📝 Using servings from URL:', servings);
        } else {
          console.log('📝 No servings in URL, using fallback:', servings);
        }

        console.log('🎯 Final ingredients for generation:', ingredients, 'servings:', servings);

        // 🚀 OPTIMIZACIÓN: Verificar cache local antes de llamar al API
        console.log('🔍 Checking local cache before API call...');
        try {
          const cachedRecipes = await UniversalCacheManager.getCachedRecipes(ingredients, servings);
          if (cachedRecipes && cachedRecipes.length > 0) {
            console.log(
              '✅ Using local cached recipes, skipping API call:',
              cachedRecipes.length,
              'recipes'
            );
            setRecipes(cachedRecipes);
            setHasLoadedRecipes(true);
            setLoading(false);
            // Guardar en sessionStorage para mantenerlas al navegar
            sessionStorage.setItem('currentRecipes', JSON.stringify(cachedRecipes));
            return;
          } else {
            console.log('❌ No local cached recipes found, will call API');
          }
        } catch (error) {
          console.log('❌ Error checking local cache:', error);
        }

        // Generate recipes using our new API route
        const recipeCount = countParam ? parseInt(countParam) : 4;
        console.log('🚀 About to call API with:', {
          ingredients,
          servings,
          count: recipeCount,
        });

        const response = await fetch('/api/recipes/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients: ingredients,
            servings: servings,
            cuisine: 'international',
            count: recipeCount,
          }),
        });

        console.log('📡 API Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to generate recipes: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Recipes generated successfully:', data);
        console.log('Number of recipes received:', data.recipes?.length || 0);

        // Convert API response to Recipe format
        const aiRecipes = data.recipes.map((aiRecipe: Record<string, unknown>, index: number) => {
          console.log('🔧 DEBUG: Processing recipe', index, ':', aiRecipe);
          console.log('🔧 DEBUG: Raw ingredients:', aiRecipe.ingredients);

          // Procesar ingredientes correctamente
          let processedIngredients: Array<{ name: string; quantity: number; unit: string }> = [];

          if (aiRecipe.ingredients && Array.isArray(aiRecipe.ingredients)) {
            const rawIngredients = aiRecipe.ingredients.map((ing: any) => {
              if (typeof ing === 'string') {
                return { name: ing, quantity: 1, unit: 'unit' };
              } else if (typeof ing === 'object' && ing.name) {
                return {
                  name: ing.name,
                  quantity: ing.quantity || 1,
                  unit: ing.unit || 'unit',
                };
              }
              return { name: String(ing), quantity: 1, unit: 'unit' };
            });

            // Aplicar deduplicación para eliminar ingredientes repetidos
            processedIngredients = deduplicateIngredientsNumeric(rawIngredients);
          }

          console.log('🔧 DEBUG: Processed ingredients:', processedIngredients);

          return {
            id: `recipe_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
            title: (aiRecipe.title as string) || `Recipe ${index + 1}`,
            servings: (aiRecipe.servings as number) || servings,
            cookingTime: (aiRecipe.cookingTime as string) || '30 minutes',
            image: (aiRecipe.image as string) || null,
            source: (aiRecipe.source as string) || 'gemini',
            ingredients: processedIngredients,
            instructions: (aiRecipe.instructions as string[]) || [],
            // En modo edición, agregar metadata para el reemplazo
            ...(editMode &&
              originalId && {
                originalId,
                isEditMode: true,
                originalTitle: recipeTitle,
              }),
          };
        });

        console.log('Processed recipes:', aiRecipes);
        console.log('Setting recipes state with count:', aiRecipes.length);
        console.log('🔧 DEBUG: About to set recipes state');
        setRecipes(aiRecipes);
        setHasLoadedRecipes(true);
        console.log('🔧 DEBUG: Recipes state set');

        // Guardar en sessionStorage para mantenerlas al navegar
        sessionStorage.setItem('currentRecipes', JSON.stringify(aiRecipes));
        console.log('Recipes saved to sessionStorage');

        // 🚀 MODO EDICIÓN: Si estamos en modo edición, NO actualizar automáticamente
        // El usuario debe guardar manualmente la nueva receta
        if (editMode && originalId && recipeTitle) {
          console.log('🔄 Edit mode detected, waiting for user to save the new recipe...');
          // No actualizamos automáticamente, esperamos a que el usuario guarde
        }

        // Cache the recipes using UniversalCacheManager
        try {
          console.log('💾 Caching recipes with ingredients:', ingredients, 'servings:', servings);
          await UniversalCacheManager.cacheRecipes(ingredients, servings, aiRecipes);
          console.log('✅ Recipes cached successfully using UniversalCacheManager');
        } catch (error) {
          console.error('❌ Error caching recipes:', error);
        }
      } catch (error) {
        console.error('Error generating recipes:', error);
        setError('Failed to generate recipes. Please try again.');

        // Fallback recipes if API fails
        const fallbackRecipes = [
          {
            id: 'fallback-1',
            title: 'Simple Pasta with Herbs',
            servings: 4,
            cookingTime: '20 minutes',
            image:
              'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            source: 'fallback',
            ingredients: [
              { name: 'Pasta', quantity: 400, unit: 'g' },
              { name: 'Olive Oil', quantity: 3, unit: 'tbsp' },
              { name: 'Garlic', quantity: 3, unit: 'cloves' },
              { name: 'Fresh Herbs', quantity: 1, unit: 'cup' },
            ],
            instructions: [
              'Cook pasta according to package instructions',
              'Heat olive oil and sauté garlic',
              'Add herbs and toss with pasta',
              'Serve immediately',
            ],
          },
        ];
        setRecipes(fallbackRecipes);
        setHasLoadedRecipes(true);
      } finally {
        setLoading(false);
      }
    };

    generateRecipes();
  }, [isClient]); // Solo ejecutar una vez al montar el componente

  // Memoizar el handler de save recipe
  const handleSaveRecipe = useCallback((recipeId: string) => {
    setSavedRecipes(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(recipeId)) {
        newSaved.delete(recipeId);
      } else {
        newSaved.add(recipeId);
      }
      return newSaved;
    });
  }, []);

  // Memoizar el handler de remove from list
  const handleRemoveFromList = useCallback((recipeId: string) => {
    console.log('🗑️ handleRemoveFromList called with recipeId:', recipeId);
    console.log('🗑️ Current recipes count:', recipes.length);

    // Marcar la receta como removiendo para animación
    setRemovingRecipeId(recipeId);

    // Eliminar inmediatamente sin setTimeout para evitar problemas de estado
    setRecipes(prevRecipes => {
      const updatedRecipes = prevRecipes.filter(recipe => recipe.id !== recipeId);
      console.log('🗑️ Updated recipes count:', updatedRecipes.length);

      // Actualizar sessionStorage con las recetas restantes
      sessionStorage.setItem('currentRecipes', JSON.stringify(updatedRecipes));

      // Si no quedan recetas, marcar como cargado para evitar regeneración
      if (updatedRecipes.length === 0) {
        setHasLoadedRecipes(true);
        console.log('📦 No more recipes, marking as loaded to prevent regeneration');
      }

      return updatedRecipes;
    });

    // Limpiar el estado de removiendo después de la animación
    setTimeout(() => {
      setRemovingRecipeId(null);
      console.log('✅ Recipe removed from Generated Recipes, staying on current page');
    }, 600);
  }, []);

  // Memoizar el handler de back to home
  const handleBackToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const clearAllCache = async () => {
    if (!isClient) return;

    try {
      // Limpiar sessionStorage
      sessionStorage.removeItem('currentRecipes');

      // Limpiar cache usando UniversalCacheManager
      await UniversalCacheManager.clearAllCache();

      // Limpiar TODO el localStorage (más agresivo)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('recipes_') || key.startsWith('image_') || key.includes('cache'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🗑️ Removed ${keysToRemove.length} localStorage keys:`, keysToRemove);

      // Limpiar estado
      setRecipes([]);
      setHasLoadedRecipes(false);
      setLoading(true);

      console.log('🧹 Cache cleared, reloading page...');

      // Recargar la página para generar nuevas recetas
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Memoizar el handler de scroll to recipe
  const scrollToRecipe = useCallback(
    (index: number) => {
      if (!isClient) return;

      const container = document.querySelector('.overflow-x-auto') as HTMLElement;
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
    },
    [isClient]
  );

  // Detectar scroll automáticamente para actualizar el punto activo
  useEffect(() => {
    if (!isClient) return;

    const container = document.querySelector('.overflow-x-auto') as HTMLElement;
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
  }, [recipes.length, isClient]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && isClient) {
      router.push('/auth/login');
    }
  }, [user, isClient, router]);

  if (!user) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div
        className='h-screen overflow-hidden text-white'
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user.name} currentPage='generated' />
        <div className='flex items-center justify-center h-[calc(100vh-120px)]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p>Generating your recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='h-screen overflow-hidden'
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={user.name} currentPage='generated' />

      <div className='max-w-7xl mx-auto px-4 py-8 mt-20 h-[calc(100vh-120px)] flex flex-col'>
        {/* Header */}
        <div className='flex items-start gap-4 mb-8'>
          <button
            onClick={handleBackToHome}
            className='w-12 h-12 rounded-2xl transition-colors border-2 flex items-center justify-center'
            style={{
              backgroundColor: colors.interface.background.secondary,
              color: colors.base.white,
              borderColor: colors.interface.background.secondary,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = colors.interface.background.tertiary;
              e.currentTarget.style.borderColor = colors.interface.background.tertiary;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = colors.interface.background.secondary;
              e.currentTarget.style.borderColor = colors.interface.background.secondary;
            }}
          >
            <IoIosArrowBack className='text-xl' />
          </button>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold' style={{ color: colors.interface.text.primary }}>
              Generated Recipes
            </h1>
            <p className='mt-1' style={{ color: colors.interface.text.secondary }}>
              {recipes.length} recipes generated for you
            </p>
          </div>
        </div>

        {/* Recipes Horizontal Scroll */}
        {recipes.length > 0 && (
          <div className='relative flex-1 flex flex-col'>
            {/* Scroll Container */}
            <div className='flex gap-6 overflow-x-auto scrollbar-hide items-center flex-1 pt-3 pb-1.5'>
              {recipes.map(recipe => {
                console.log(
                  '🔧 DEBUG: Rendering RecipeCard for:',
                  recipe.id,
                  'with onRemoveFromList:',
                  !!handleRemoveFromList
                );
                return (
                  <div
                    key={recipe.id}
                    className={`flex-shrink-0 w-80 transition-all duration-600 ease-in-out ${
                      removingRecipeId === recipe.id
                        ? 'opacity-0 scale-95 transform translate-x-4'
                        : 'opacity-100 scale-100 transform translate-x-0'
                    }`}
                  >
                    <SuspenseWrapper minHeight='400px'>
                      <LazyRecipeCard
                        recipe={recipe}
                        variant='save'
                        onRemoveFromList={handleRemoveFromList}
                        isRemoving={removingRecipeId === recipe.id}
                      />
                    </SuspenseWrapper>
                  </div>
                );
              })}
            </div>

            {/* Scroll Indicator - Clickable Navigation */}
            <div className='flex justify-center mt-2'>
              <div className='flex gap-2'>
                {recipes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToRecipe(index)}
                    className='w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer'
                    style={{
                      backgroundColor:
                        index === activeIndex
                          ? colors.brand.primary[500]
                          : colors.interface.background.tertiary,
                      opacity: index === activeIndex ? 1 : 0.5,
                    }}
                    title={`Go to recipe ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {recipes.length === 0 && !loading && (
          <div className='text-center py-20'>
            <div className='text-6xl mb-4'>🍽️</div>
            <h2
              className='text-2xl font-bold mb-2'
              style={{ color: colors.interface.text.primary }}
            >
              {error ? 'Error generating recipes' : 'No recipes found'}
            </h2>
            <p className='mb-6' style={{ color: colors.interface.text.secondary }}>
              {error || "We couldn't generate recipes at the moment. Please try again."}
            </p>
            <div className='flex justify-center'>
              <button
                onClick={handleBackToHome}
                className='px-8 py-3 rounded-lg transition-colors border'
                style={{
                  backgroundColor: 'transparent',
                  color: colors.brand.primary[500],
                  borderColor: colors.brand.primary[500],
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = colors.brand.primary[500];
                  e.currentTarget.style.color = colors.base.white;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.brand.primary[500];
                }}
              >
                Return home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
