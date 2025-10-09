import { useAuthUnified } from '@/hooks';
import { useSavedRecipesStore, useToastStore } from '@/stores';
import { RecipeCardData } from '@/types';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

interface UseRecipeCardProps {
  recipe: RecipeCardData;
  variant?: 'save' | 'my-recipes';
  onRemoveFromList?: (recipeId: string) => void;
}

interface UseRecipeCardReturn {
  // Estado
  isSaving: boolean;
  imageError: boolean;
  recipeId: string;
  isSaved: boolean;

  // Acciones
  handleCardClick: () => void;
  handleSaveClick: (e: React.MouseEvent) => void;
  handleImageError: () => void;
}

/**
 * Hook personalizado que maneja toda la lógica de negocio del RecipeCard
 * Separando la lógica de la presentación (SRP)
 */
export const useRecipeCard = ({
  recipe,
  variant = 'save',
  onRemoveFromList,
}: UseRecipeCardProps): UseRecipeCardReturn => {
  const router = useRouter();
  const { user } = useAuthUnified();
  const savedRecipes = useSavedRecipesStore(state => state.savedRecipes);
  const saveRecipe = useSavedRecipesStore(state => state.saveRecipe);
  const updateRecipe = useSavedRecipesStore(state => state.updateRecipe);
  const removeRecipe = useSavedRecipesStore(state => state.removeRecipe);
  const showSuccess = useToastStore(state => state.showSuccess);
  const showError = useToastStore(state => state.showError);

  // Estado local
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoizar el ID de la receta para evitar recálculos
  const recipeId = useMemo(() => recipe.id || Date.now().toString(), [recipe.id]);

  // Memoizar la verificación de si la receta está guardada
  const isSaved = useMemo(() => {
    if (!user) return false;

    // En modo edición, la receta generada NO está guardada hasta que se guarde explícitamente
    const isEditMode = (recipe as any).isEditMode && (recipe as any).originalId;
    if (isEditMode) {
      console.log('🔧 DEBUG: isSaved check (edit mode):', {
        recipeId,
        originalId: (recipe as any).originalId,
        isEditMode: true,
        savedRecipesCount: savedRecipes.length,
      });
      // En edit mode, la receta generada siempre aparece como NO guardada
      return false;
    }

    // Para recetas normales, verificar por el ID de la receta
    const saved = savedRecipes.some(r => r.id === recipeId);
    console.log('🔧 DEBUG: isSaved check (normal):', {
      recipeId,
      saved,
      savedRecipesCount: savedRecipes.length,
    });
    return saved;
  }, [user, recipeId, savedRecipes, recipe]);

  // Handler para click en la tarjeta (navegación)
  const handleCardClick = useCallback(() => {
    // Guardar los datos de la receta en localStorage para la página de detalle
    // Store recipe with userId to separate by user
    if (user?.id) {
      localStorage.setItem(`recipe-${user.id}-${recipeId}`, JSON.stringify(recipe));
    }

    // Verificar si es modo edición
    const isEditMode = (recipe as any).isEditMode && (recipe as any).originalId;

    // Si es variant "my-recipes", pasar el parámetro from=my-recipes
    if (variant === 'my-recipes') {
      router.push(`/recipes/${recipeId}?from=my-recipes`);
    } else if (isEditMode) {
      // Si es edit mode, pasar el parámetro fromEdit=true
      router.push(`/recipes/${recipeId}?fromEdit=true`);
    } else {
      router.push(`/recipes/${recipeId}`);
    }
  }, [recipeId, recipe, variant, router]);

  // Handler para guardar/eliminar receta
  const handleSaveClick = useCallback(
    (e: React.MouseEvent) => {
      e?.stopPropagation?.(); // Evitar que se active el click de la tarjeta

      if (!user) {
        router.push('/auth/login');
        return;
      }

      console.log('💾 Save clicked for recipe:', recipeId);
      console.log('💾 Variant:', variant);
      console.log('💾 onRemoveFromList function:', !!onRemoveFromList);
      console.log('💾 Recipe data:', recipe);
      console.log('💾 User ID:', user.id);
      console.log('💾 isSaved state:', isSaved);

      setIsSaving(true);

      try {
        let success = false;

        // Verificar si es modo edición
        const isEditMode = (recipe as any).isEditMode && (recipe as any).originalId;

        if (isEditMode) {
          // En modo edición: reemplazar la receta original con la nueva
          const originalId = (recipe as any).originalId;
          const recipeToSave = {
            ...recipe,
            difficulty: recipe.difficulty || 'medium',
          };

          console.log('💾 EDIT MODE: Replacing original recipe:', originalId);
          console.log('💾 EDIT MODE: New recipe ID:', recipeId);
          console.log('💾 EDIT MODE: onRemoveFromList function:', !!onRemoveFromList);

          // Reemplazar la receta original con la nueva (manteniendo el ID original)
          success = updateRecipe(originalId, recipeToSave, user.id);
          console.log('💾 EDIT MODE: Replace result:', success);

          if (success) {
            showSuccess('Recipe updated successfully!');

            // Eliminar de la lista y navegar
            if (onRemoveFromList) {
              console.log('🗑️ EDIT MODE: Calling onRemoveFromList with recipeId:', recipeId);
              console.log('🗑️ EDIT MODE: onRemoveFromList function type:', typeof onRemoveFromList);
              console.log('🗑️ EDIT MODE: Recipe data before removal:', recipe);

              // Llamar a onRemoveFromList inmediatamente
              onRemoveFromList(recipeId);
              console.log('🗑️ EDIT MODE: onRemoveFromList called successfully');

              setTimeout(() => {
                // Guardar la receta actualizada en localStorage para el detalle (usando ID original)
                if (user?.id) {
                  localStorage.setItem(
                    `recipe-${user.id}-${originalId}`,
                    JSON.stringify(recipeToSave)
                  );
                }
                // Limpiar sessionStorage para evitar regeneración
                sessionStorage.removeItem('currentRecipes');
                // Navegar a la receta original (que ahora tiene el contenido actualizado)
                // Agregar parámetro para indicar que venimos de edit mode
                router.push(`/recipes/${originalId}?fromEdit=true`);
              }, 700);
            } else {
              console.log('❌ EDIT MODE: onRemoveFromList is not available');
              // Si no hay onRemoveFromList, navegar directamente
              setTimeout(() => {
                if (user?.id) {
                  localStorage.setItem(
                    `recipe-${user.id}-${originalId}`,
                    JSON.stringify(recipeToSave)
                  );
                }
                // Limpiar sessionStorage para evitar regeneración
                sessionStorage.removeItem('currentRecipes');
                router.push(`/recipes/${originalId}?fromEdit=true`);
              }, 1000);
            }
          } else {
            showError('Failed to update recipe');
          }
        } else if (isSaved) {
          // Si ya está guardada, la removemos
          success = removeRecipe(recipeId, user.id);
          if (success) {
            showSuccess('Recipe removed from favorites');
          }
        } else {
          // Si no está guardada, la guardamos
          const recipeToSave = {
            ...recipe,
            difficulty: recipe.difficulty || 'medium',
          };

          console.log('💾 Saving recipe:', recipeToSave);
          success = saveRecipe(recipeToSave, user.id);
          console.log('💾 Save result:', success);

          if (success) {
            showSuccess('Recipe saved to favorites');

            // Si se guardó la receta desde Generated Recipes, eliminar de la lista
            if (variant === 'save' && onRemoveFromList) {
              console.log('🗑️ Removing recipe from list:', recipeId);
              onRemoveFromList(recipeId);

              // Navegar a la página de detalle después de eliminar
              setTimeout(() => {
                // Store recipe with userId to separate by user
                if (user?.id) {
                  localStorage.setItem(`recipe-${user.id}-${recipeId}`, JSON.stringify(recipe));
                }
                router.push(`/recipes/${recipeId}`);
              }, 100);
            } else {
              // Si se guardó desde otro lugar, redirigir normalmente
              setTimeout(() => {
                router.push('/my-recipes');
              }, 1000);
            }
          }
        }

        if (!success) {
          console.error('💾 Failed to save recipe');
          showError('Error saving recipe');
        } else {
          console.log('💾 Recipe saved successfully!');
        }
      } catch (error) {
        console.error('Error saving recipe:', error);
        showError('Error saving recipe');
      } finally {
        setIsSaving(false);
      }
    },
    [
      user,
      router,
      recipeId,
      variant,
      onRemoveFromList,
      recipe,
      saveRecipe,
      updateRecipe,
      removeRecipe,
      isSaved,
      showSuccess,
      showError,
    ]
  );

  // Handler para errores de imagen
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return {
    // Estado
    isSaving,
    imageError,
    recipeId,
    isSaved,

    // Acciones
    handleCardClick,
    handleSaveClick,
    handleImageError,
  };
};
