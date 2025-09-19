import { useAuthStore } from "./authStore";
import { useRecipesStore } from "./recipesStore";
import { useSavedRecipesStore } from "./savedRecipesStore";

/**
 * Store Coordinador - Conecta todos los stores especializados
 *
 * Este archivo proporciona funciones para sincronizar datos entre stores
 * y mantener la consistencia del estado global.
 */

// Función para sincronizar el usuario entre stores
export const syncUserAcrossStores = (user: any) => {
  useAuthStore.getState().setUser(user);

  // Si el usuario cambia, limpiar datos relacionados
  if (!user) {
    useRecipesStore.getState().clearRecipes();
    useSavedRecipesStore.getState().clearSavedRecipes();
  }
};

// Función para sincronizar errores entre stores
export const syncErrorAcrossStores = (error: string | null) => {
  useAuthStore.getState().setError(error);
  useRecipesStore.getState().setError(error);
  useSavedRecipesStore.getState().setError(error);
};

// Función para limpiar todos los errores
export const clearAllErrors = () => {
  useAuthStore.getState().clearError();
  useRecipesStore.getState().clearError();
  useSavedRecipesStore.getState().clearError();
};

// Función para obtener el estado completo de la aplicación
export const getAppState = () => {
  const authState = useAuthStore.getState();
  const recipesState = useRecipesStore.getState();
  const savedRecipesState = useSavedRecipesStore.getState();

  return {
    auth: {
      user: authState.user,
      isLoading: authState.isLoading,
      error: authState.error,
    },
    recipes: {
      recipes: recipesState.recipes,
      isLoading: recipesState.isLoading,
      error: recipesState.error,
      hasLoadedRecipes: recipesState.hasLoadedRecipes,
      activeIndex: recipesState.activeIndex,
    },
    savedRecipes: {
      savedRecipes: savedRecipesState.savedRecipes,
      isLoading: savedRecipesState.isLoading,
      error: savedRecipesState.error,
      removingRecipeId: savedRecipesState.removingRecipeId,
    },
  };
};

// Función para resetear todo el estado de la aplicación
export const resetAppState = () => {
  useAuthStore.getState().logout();
  useRecipesStore.getState().clearRecipes();
  useSavedRecipesStore.getState().clearSavedRecipes();
};

// Hook personalizado para acceder a todos los stores
export const useAllStores = () => {
  const authState = useAuthStore();
  const recipesState = useRecipesStore();
  const savedRecipesState = useSavedRecipesStore();

  return {
    auth: authState,
    recipes: recipesState,
    savedRecipes: savedRecipesState,
  };
};

// Hook para obtener solo los datos (sin acciones)
export const useAppData = () => {
  const authData = useAuthStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const recipesData = useRecipesStore((state) => ({
    recipes: state.recipes,
    isLoading: state.isLoading,
    error: state.error,
    hasLoadedRecipes: state.hasLoadedRecipes,
    activeIndex: state.activeIndex,
  }));

  const savedRecipesData = useSavedRecipesStore((state) => ({
    savedRecipes: state.savedRecipes,
    isLoading: state.isLoading,
    error: state.error,
    removingRecipeId: state.removingRecipeId,
  }));

  return {
    auth: authData,
    recipes: recipesData,
    savedRecipes: savedRecipesData,
  };
};

// Hook para obtener solo las acciones
export const useAppActions = () => {
  const authActions = useAuthStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    logout: state.logout,
  }));

  const recipesActions = useRecipesStore((state) => ({
    setRecipes: state.setRecipes,
    addRecipe: state.addRecipe,
    removeRecipe: state.removeRecipe,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    setHasLoadedRecipes: state.setHasLoadedRecipes,
    setActiveIndex: state.setActiveIndex,
    clearRecipes: state.clearRecipes,
  }));

  const savedRecipesActions = useSavedRecipesStore((state) => ({
    loadSavedRecipes: state.loadSavedRecipes,
    saveRecipe: state.saveRecipe,
    removeRecipe: state.removeRecipe,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    setRemovingRecipeId: state.setRemovingRecipeId,
    clearSavedRecipes: state.clearSavedRecipes,
  }));

  return {
    auth: authActions,
    recipes: recipesActions,
    savedRecipes: savedRecipesActions,
  };
};
