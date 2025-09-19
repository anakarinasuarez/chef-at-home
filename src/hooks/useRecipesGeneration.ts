import { useState, useEffect, useCallback } from "react";
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

interface UseRecipesGenerationReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  hasLoadedRecipes: boolean;
  generateRecipes: () => Promise<void>;
  clearCache: () => Promise<void>;
}

export const useRecipesGeneration = (): UseRecipesGenerationReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);

  const generateRecipes = useCallback(async () => {
    console.log("🚀 generateRecipes function called");

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
          setRecipes(parsedRecipes);
          setHasLoadedRecipes(true);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing saved recipes:", error);
        }
      }
    }

    // Si ya hemos cargado recetas, no hacer nada
    if (hasLoadedRecipes) {
      console.log("📦 Recipes already loaded, skipping generation");
      setLoading(false);
      return;
    }

    // Initialize cache manager
    await UniversalCacheManager.initialize();

    setLoading(true);
    setError(null);

    try {
      // Get ingredients from URL params or localStorage
      const savedRecipeId = urlParams.get("saved");

      let ingredients = ["pasta", "basil", "olive oil", "garlic", "tomatoes"]; // fallback
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
            setRecipes(parsedRecipes);
            setHasLoadedRecipes(true);
            setLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing saved recipes:", error);
          }
        }

        console.log("🔄 No specific params found, generating default recipes");
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
          const cachedRecipes = await UniversalCacheManager.getCachedRecipes(
            ingredients,
            servings
          );

          if (cachedRecipes && cachedRecipes.length > 0) {
            console.log(
              "📦 Using cached recipes from UniversalCacheManager:",
              cachedRecipes.length,
              "recipes"
            );
            setRecipes(cachedRecipes);
            setHasLoadedRecipes(true);
            setLoading(false);

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
        console.log("📝 No ingredients in URL, using fallback:", ingredients);
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
      const aiRecipes = data.recipes.map((aiRecipe: any, index: number) => ({
        id: `recipe_${Date.now()}_${index}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        title: aiRecipe.title || `Recipe ${index + 1}`,
        servings: aiRecipe.servings || servings,
        cookingTime: aiRecipe.cookingTime || "30 minutes",
        image: aiRecipe.image || null,
        source: aiRecipe.source || "gemini",
        ingredients: aiRecipe.ingredients || [],
        instructions: aiRecipe.instructions || [],
      }));

      console.log("Processed recipes:", aiRecipes);
      console.log("Setting recipes state with count:", aiRecipes.length);
      console.log("🔧 DEBUG: About to set recipes state");
      setRecipes(aiRecipes);
      setHasLoadedRecipes(true);
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
      setError("Failed to generate recipes. Please try again.");

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
      setRecipes(fallbackRecipes);
      setHasLoadedRecipes(true);
    } finally {
      setLoading(false);
    }
  }, [hasLoadedRecipes]);

  const clearCache = async () => {
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
      setRecipes([]);
      setHasLoadedRecipes(false);
      setLoading(true);

      console.log("🧹 Cache cleared, reloading page...");

      // Recargar la página para generar nuevas recetas
      window.location.reload();
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  // Generate recipes with AI when component mounts
  useEffect(() => {
    console.log("🚀 useEffect triggered - hasLoadedRecipes:", hasLoadedRecipes);
    generateRecipes();
  }, [generateRecipes, hasLoadedRecipes]); // Solo ejecutar una vez al montar el componente

  return {
    recipes,
    loading,
    error,
    hasLoadedRecipes,
    generateRecipes,
    clearCache,
  };
};
