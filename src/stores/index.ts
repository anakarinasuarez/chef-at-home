// Exportar todos los stores especializados
export * from "./authStore";
export * from "./recipesStore";
export * from "./recipesGenerationStore";
export * from "./savedRecipesStore";
export * from "./errorStore";
export * from "./toastStore";

// Exportar el store global unificado
export * from "./globalAppStore";

// Exportar el coordinador de stores
export * from "./storeCoordinator";

// Exportar el store principal (para compatibilidad)
export { useAppStore } from "./appStore";
