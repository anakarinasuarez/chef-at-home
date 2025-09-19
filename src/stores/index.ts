// Exportar todos los stores especializados
export * from "./authStore";
export * from "./recipesStore";
export * from "./savedRecipesStore";

// Exportar el coordinador de stores
export * from "./storeCoordinator";

// Exportar el store principal (para compatibilidad)
export { useAppStore } from "./appStore";
