import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UniversalCacheManager } from "@/lib/universal-cache";

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

export interface RecipesGenerationState {
  // Estado
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  hasLoadedRecipes: boolean;

  // Acciones
  setRecipes: (recipes: Recipe[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setHasLoadedRecipes: (loaded: boolean) => void;
  generateRecipes: () => Promise<void>;
  clearRecipes: () => void;
  clearCache: () => Promise<void>;
}

export const useRecipesGenerationStore = create<RecipesGenerationState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      recipes: [],
      isLoading: true,
      error: null,
      hasLoadedRecipes: false,

      // Acciones básicas
      setRecipes: (recipes) => set({ recipes, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setHasLoadedRecipes: (hasLoadedRecipes) => set({ hasLoadedRecipes }),
      clearRecipes: () => set({ recipes: [], hasLoadedRecipes: false }),

      // Generar recetas
      generateRecipes: async () => {
        console.log("🚀 generateRecipes function called");

        // Solo ejecutar en el cliente
        if (typeof window === "undefined") return;

        // Solo cargar desde sessionStorage si NO hay parámetros de generación
        const urlParams = new URLSearchParams(window.location.search);
        const forceGenerate = urlParams.get("force") === "true";
        const ingredientsParam = urlParams.get("ingredients");
        const servingsParam = urlParams.get("servings");

        const hasSpecificParams =
          ingredientsParam || servingsParam || forceGenerate;

        if (!hasSpecificParams) {
          // Verificar si hay recetas en sessionStorage solo si no hay parámetros específicos
          const savedRecipes = sessionStorage.getItem("currentRecipes");
          console.log("📦 Checking sessionStorage:", !!savedRecipes);

          if (savedRecipes) {
            try {
              const parsedRecipes = JSON.parse(savedRecipes);
              console.log(
                "📦 Loading recipes from sessionStorage:",
                parsedRecipes.length
              );
              set({
                recipes: parsedRecipes,
                hasLoadedRecipes: true,
                isLoading: false,
              });
              return;
            } catch (error) {
              console.error("Error parsing saved recipes:", error);
            }
          }
        }

        // Si ya hemos cargado recetas, no hacer nada
        const { hasLoadedRecipes } = get();
        if (hasLoadedRecipes) {
          console.log("📦 Recipes already loaded, skipping generation");
          set({ isLoading: false });
          return;
        }

        // Initialize cache manager
        await UniversalCacheManager.initialize();

        set({ isLoading: true, error: null });

        try {
          // Get ingredients from URL params or localStorage
          const savedRecipeId = urlParams.get("saved");

          let ingredients = [
            "pasta",
            "basil",
            "olive oil",
            "garlic",
            "tomatoes",
          ]; // fallback
          let servings = 4; // fallback

          console.log("🔍 URL Params Debug:", {
            ingredientsParam,
            servingsParam,
            forceGenerate,
            savedRecipeId,
            hasSpecificParams,
            currentUrl: window.location.href,
          });

          // Si se guardó una receta desde el detalle, solo loggear (no eliminar del sessionStorage)
          if (savedRecipeId) {
            console.log(
              "✅ Recipe saved from detail, keeping sessionStorage intact:",
              savedRecipeId
            );
          }

          if (!hasSpecificParams) {
            // Cargar recetas desde sessionStorage (ya sea después de guardar o normalmente)
            const savedRecipes = sessionStorage.getItem("currentRecipes");
            if (savedRecipes) {
              try {
                const parsedRecipes = JSON.parse(savedRecipes);
                console.log(
                  "📦 Loading recipes from sessionStorage:",
                  parsedRecipes.length
                );
                set({
                  recipes: parsedRecipes,
                  hasLoadedRecipes: true,
                  isLoading: false,
                });
                return;
              } catch (error) {
                console.error("Error parsing saved recipes:", error);
              }
            }

            console.log(
              "🔄 No specific params found, generating default recipes"
            );
            // Si no hay parámetros específicos, generar recetas por defecto
            // Usar ingredientes por defecto para generar nuevas recetas
            ingredients = ["pasta", "basil", "olive oil", "garlic", "tomatoes"];
            servings = 4;
            console.log(
              "🎯 Using default ingredients:",
              ingredients,
              "servings:",
              servings
            );

            // Limpiar cache para asegurar que se generen nuevas recetas
            try {
              await UniversalCacheManager.clearAllCache();
              sessionStorage.removeItem("currentRecipes");
              console.log("🧹 Cache cleared for default recipe generation");
            } catch (error) {
              console.log("❌ Error clearing cache:", error);
            }
          } else if (!forceGenerate) {
            try {
              console.log(
                "🔍 Checking cache for ingredients:",
                ingredients,
                "servings:",
                servings
              );
              const cachedRecipes =
                await UniversalCacheManager.getCachedRecipes(
                  ingredients,
                  servings
                );

              if (cachedRecipes && cachedRecipes.length > 0) {
                console.log(
                  "📦 Using cached recipes from UniversalCacheManager:",
                  cachedRecipes.length,
                  "recipes"
                );
                set({
                  recipes: cachedRecipes,
                  hasLoadedRecipes: true,
                  isLoading: false,
                });

                // Guardar en sessionStorage para mantenerlas al navegar
                sessionStorage.setItem(
                  "currentRecipes",
                  JSON.stringify(cachedRecipes)
                );
                return;
              } else {
                console.log("❌ No cached recipes found for these ingredients");
              }
            } catch (error) {
              console.log("❌ Error checking cache:", error);
            }
          } else {
            console.log("🔄 Force generating new recipes (ignoring cache)");
            // Limpiar cache cuando se fuerza la generación
            try {
              await UniversalCacheManager.clearAllCache();
              sessionStorage.removeItem("currentRecipes");
              console.log(
                "🧹 Cache and sessionStorage cleared for force generation"
              );
            } catch (error) {
              console.log("❌ Error clearing cache:", error);
            }
          }

          if (ingredientsParam) {
            try {
              ingredients = JSON.parse(decodeURIComponent(ingredientsParam));
              console.log("📝 Using ingredients from URL:", ingredients);
            } catch (e) {
              console.log("Could not parse ingredients from URL");
            }
          } else {
            console.log(
              "📝 No ingredients in URL, using fallback:",
              ingredients
            );
          }

          if (servingsParam) {
            servings = parseInt(servingsParam) || 4;
            console.log("📝 Using servings from URL:", servings);
          } else {
            console.log("📝 No servings in URL, using fallback:", servings);
          }

          console.log(
            "🎯 Final ingredients for generation:",
            ingredients,
            "servings:",
            servings
          );

          // Generate recipes using our new API route
          console.log("🚀 About to call API with:", {
            ingredients,
            servings,
            count: 4,
          });

          const response = await fetch("/api/recipes/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ingredients: ingredients,
              servings: servings,
              cuisine: "international",
              count: 4,
            }),
          });

          console.log("📡 API Response status:", response.status);

          if (!response.ok) {
            throw new Error(
              `Failed to generate recipes: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();
          console.log("Recipes generated successfully:", data);
          console.log("Number of recipes received:", data.recipes?.length || 0);

          // Convert API response to Recipe format
          const aiRecipes = data.recipes.map(
            (aiRecipe: unknown, index: number) => {
              const recipe = aiRecipe as Record<string, unknown>;
              return {
                id: `recipe_${Date.now()}_${index}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                title: (recipe.title as string) || `Recipe ${index + 1}`,
                servings: (recipe.servings as number) || servings,
                cookingTime: (recipe.cookingTime as string) || "30 minutes",
                image: (recipe.image as string) || null,
                source: (recipe.source as string) || "gemini",
                ingredients: (recipe.ingredients as string[]) || [],
                instructions: (recipe.instructions as string[]) || [],
              };
            }
          );

          console.log("Processed recipes:", aiRecipes);
          console.log("Setting recipes state with count:", aiRecipes.length);
          console.log("🔧 DEBUG: About to set recipes state");
          set({ recipes: aiRecipes, hasLoadedRecipes: true });
          console.log("🔧 DEBUG: Recipes state set");

          // Guardar en sessionStorage para mantenerlas al navegar
          sessionStorage.setItem("currentRecipes", JSON.stringify(aiRecipes));
          console.log("Recipes saved to sessionStorage");

          // Cache the recipes using UniversalCacheManager
          try {
            console.log(
              "💾 Caching recipes with ingredients:",
              ingredients,
              "servings:",
              servings
            );
            await UniversalCacheManager.cacheRecipes(
              ingredients,
              servings,
              aiRecipes
            );
            console.log(
              "✅ Recipes cached successfully using UniversalCacheManager"
            );
          } catch (error) {
            console.error("❌ Error caching recipes:", error);
          }
        } catch (error) {
          console.error("Error generating recipes:", error);
          set({ error: "Failed to generate recipes. Please try again." });

          // Fallback recipes if API fails
          const fallbackRecipes = [
            {
              id: "fallback-1",
              title: "Simple Pasta with Herbs",
              servings: 4,
              cookingTime: "20 minutes",
              image:
                "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              source: "fallback",
              ingredients: [
                { name: "Pasta", quantity: 400, unit: "g" },
                { name: "Olive Oil", quantity: 3, unit: "tbsp" },
                { name: "Garlic", quantity: 3, unit: "cloves" },
                { name: "Fresh Herbs", quantity: 1, unit: "cup" },
              ],
              instructions: [
                "Cook pasta according to package instructions",
                "Heat olive oil and sauté garlic",
                "Add herbs and toss with pasta",
                "Serve immediately",
              ],
            },
          ];
          set({ recipes: fallbackRecipes, hasLoadedRecipes: true });
        } finally {
          set({ isLoading: false });
        }
      },

      // Limpiar cache
      clearCache: async () => {
        try {
          // Limpiar sessionStorage
          sessionStorage.removeItem("currentRecipes");

          // Limpiar cache usando UniversalCacheManager
          await UniversalCacheManager.clearAllCache();

          // Limpiar TODO el localStorage (más agresivo)
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (
              key &&
              (key.startsWith("recipes_") ||
                key.startsWith("image_") ||
                key.includes("cache"))
            ) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key));
          console.log(
            `🗑️ Removed ${keysToRemove.length} localStorage keys:`,
            keysToRemove
          );

          // Limpiar estado
          set({
            recipes: [],
            hasLoadedRecipes: false,
            isLoading: true,
          });

          console.log("🧹 Cache cleared, reloading page...");

          // Recargar la página para generar nuevas recetas
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        } catch (error) {
          console.error("Error clearing cache:", error);
        }
      },
    }),
    {
      name: "recipes-generation-storage",
      partialize: (state) => ({
        recipes: state.recipes,
        hasLoadedRecipes: state.hasLoadedRecipes,
      }),
    }
  )
);

// Selectores para facilitar el uso
export const useRecipesGeneration = () =>
  useRecipesGenerationStore((state) => state.recipes);
export const useRecipesGenerationLoading = () =>
  useRecipesGenerationStore((state) => state.isLoading);
export const useRecipesGenerationError = () =>
  useRecipesGenerationStore((state) => state.error);
export const useHasLoadedRecipesGeneration = () =>
  useRecipesGenerationStore((state) => state.hasLoadedRecipes);
export const useRecipesGenerationActions = () =>
  useRecipesGenerationStore((state) => ({
    setRecipes: state.setRecipes,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    setHasLoadedRecipes: state.setHasLoadedRecipes,
    generateRecipes: state.generateRecipes,
    clearRecipes: state.clearRecipes,
  }));
