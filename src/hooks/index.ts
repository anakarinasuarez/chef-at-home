// Exportar todos los hooks de transición (Zustand)
export { useSavedRecipesTransition } from "./useSavedRecipesTransition";
export { useRecipesTransition } from "./useRecipesTransition";
export { useRecipesGenerationTransition } from "./useRecipesGenerationTransition";
export { useErrorHandlerTransition } from "./useErrorHandlerTransition";
export { useToastTransition } from "./useToastTransition";

// Hooks tradicionales (para compatibilidad)
export { useRecipesNavigation } from "./useRecipesNavigation";
export { useToast } from "./useToast";

// Unified auth hook (compatible with AuthContext)
export { useAuthUnified } from "./useAuthUnified";
