import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";

// Importar todos los stores especializados
import { useAuthStore, AuthState } from "./authStore";
import { useRecipesStore, RecipesState } from "./recipesStore";
import { useRecipesGenerationStore, RecipesGenerationState } from "./recipesGenerationStore";
import { useSavedRecipesStore, SavedRecipesState } from "./savedRecipesStore";
import { useErrorStore, ErrorState } from "./errorStore";
import { useToastStore, ToastState } from "./toastStore";

// Interface para el estado global unificado
interface GlobalAppState {
  // Estado de la aplicación
  isInitialized: boolean;
  isLoading: boolean;
  lastActivity: Date;
  
  // Sub-stores (combinados)
  auth: AuthState;
  recipes: RecipesState;
  recipesGeneration: RecipesGenerationState;
  savedRecipes: SavedRecipesState;
  error: ErrorState;
  toast: ToastState;
  
  // Acciones globales
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  updateLastActivity: () => void;
  reset: () => void;
  
  // Acciones de conveniencia
  isAuthenticated: () => boolean;
  getCurrentUser: () => AuthState["user"];
  hasActiveErrors: () => boolean;
  getActiveToasts: () => ToastState["toasts"];
}

// Crear el store global unificado
export const useGlobalAppStore = create<GlobalAppState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Estado inicial
        isInitialized: false,
        isLoading: false,
        lastActivity: new Date(),
        
        // Sub-stores inicializados
        auth: useAuthStore.getState(),
        recipes: useRecipesStore.getState(),
        recipesGeneration: useRecipesGenerationStore.getState(),
        savedRecipes: useSavedRecipesStore.getState(),
        error: useErrorStore.getState(),
        toast: useToastStore.getState(),
        
        // Acciones globales
        initialize: async () => {
          set({ isLoading: true });
          
          try {
            // Inicializar todos los stores
            await Promise.all([
              // Los stores se inicializan automáticamente
              Promise.resolve(),
            ]);
            
            set({ 
              isInitialized: true, 
              isLoading: false,
              lastActivity: new Date(),
            });
            
            console.log("🚀 Global app store initialized successfully");
          } catch (error) {
            console.error("❌ Error initializing global app store:", error);
            set({ isLoading: false });
            throw error;
          }
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading });
        },
        
        updateLastActivity: () => {
          set({ lastActivity: new Date() });
        },
        
        reset: () => {
          // Resetear todos los stores
          useAuthStore.getState().logout();
          useRecipesStore.getState().clearRecipes();
          useRecipesGenerationStore.getState().clearRecipes();
          useSavedRecipesStore.getState().clearSavedRecipes();
          useErrorStore.getState().clearErrors();
          useToastStore.getState().clearToasts();
          
          set({
            isInitialized: false,
            isLoading: false,
            lastActivity: new Date(),
          });
        },
        
        // Acciones de conveniencia
        isAuthenticated: () => {
          return !!get().auth.user;
        },
        
        getCurrentUser: () => {
          return get().auth.user;
        },
        
        hasActiveErrors: () => {
          return get().error.errors.length > 0;
        },
        
        getActiveToasts: () => {
          return get().toast.toasts;
        },
      }),
      {
        name: "global-app-storage",
        partialize: (state) => ({
          isInitialized: state.isInitialized,
          lastActivity: state.lastActivity,
          // Los sub-stores manejan su propia persistencia
        }),
      }
    )
  )
);

// Selectores para facilitar el uso
export const useGlobalAppState = () => useGlobalAppStore((state) => ({
  isInitialized: state.isInitialized,
  isLoading: state.isLoading,
  lastActivity: state.lastActivity,
}));

export const useGlobalAppActions = () => useGlobalAppStore((state) => ({
  initialize: state.initialize,
  setLoading: state.setLoading,
  updateLastActivity: state.updateLastActivity,
  reset: state.reset,
  isAuthenticated: state.isAuthenticated,
  getCurrentUser: state.getCurrentUser,
  hasActiveErrors: state.hasActiveErrors,
  getActiveToasts: state.getActiveToasts,
}));

// Hook de conveniencia que combina estado y acciones
export const useGlobalApp = () => {
  const state = useGlobalAppState();
  const actions = useGlobalAppActions();
  
  return {
    ...state,
    ...actions,
  };
};

// Función para sincronizar sub-stores con el store global
export const syncSubStores = () => {
  const globalStore = useGlobalAppStore.getState();
  
  // Suscribirse a cambios en cada sub-store
  const unsubscribeAuth = useAuthStore.subscribe((state) => {
    useGlobalAppStore.setState({ auth: state });
  });
  
  const unsubscribeRecipes = useRecipesStore.subscribe((state) => {
    useGlobalAppStore.setState({ recipes: state });
  });
  
  const unsubscribeRecipesGeneration = useRecipesGenerationStore.subscribe((state) => {
    useGlobalAppStore.setState({ recipesGeneration: state });
  });
  
  const unsubscribeSavedRecipes = useSavedRecipesStore.subscribe((state) => {
    useGlobalAppStore.setState({ savedRecipes: state });
  });
  
  const unsubscribeError = useErrorStore.subscribe((state) => {
    useGlobalAppStore.setState({ error: state });
  });
  
  const unsubscribeToast = useToastStore.subscribe((state) => {
    useGlobalAppStore.setState({ toast: state });
  });
  
  // Retornar función para limpiar suscripciones
  return () => {
    unsubscribeAuth();
    unsubscribeRecipes();
    unsubscribeRecipesGeneration();
    unsubscribeSavedRecipes();
    unsubscribeError();
    unsubscribeToast();
  };
};

// Inicializar sincronización automáticamente
if (typeof window !== "undefined") {
  syncSubStores();
}
