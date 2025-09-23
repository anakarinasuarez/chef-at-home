"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRecipesStore } from "@/stores/recipesStore";
import { useRecipesGenerationStore } from "@/stores/recipesGenerationStore";
import { useSavedRecipesStore } from "@/stores/savedRecipesStore";
import { colors } from "@/design-system/colors";
import MainLayout from "@/components/layouts/MainLayout";

export default function TestZustandPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Obtener el estado actual directamente desde los stores
  const getCurrentState = useCallback(() => {
    return {
      auth: {
        user: useAuthStore.getState().user,
        isLoading: useAuthStore.getState().isLoading,
        error: useAuthStore.getState().error,
      },
      recipes: {
        recipes: useRecipesStore.getState().recipes,
        isLoading: useRecipesStore.getState().isLoading,
        error: useRecipesStore.getState().error,
        hasLoadedRecipes: useRecipesStore.getState().hasLoadedRecipes,
        activeIndex: useRecipesStore.getState().activeIndex,
      },
      recipesGeneration: {
        recipes: useRecipesGenerationStore.getState().recipes,
        isLoading: useRecipesGenerationStore.getState().isLoading,
        error: useRecipesGenerationStore.getState().error,
        hasLoadedRecipes: useRecipesGenerationStore.getState().hasLoadedRecipes,
      },
      savedRecipes: {
        savedRecipes: useSavedRecipesStore.getState().savedRecipes,
        isLoading: useSavedRecipesStore.getState().isLoading,
        error: useSavedRecipesStore.getState().error,
        removingRecipeId: useSavedRecipesStore.getState().removingRecipeId,
      },
    };
  }, []);

  // Obtener las acciones directamente desde los stores
  const getActions = useCallback(() => {
    return {
      auth: {
        setUser: useAuthStore.getState().setUser,
        setError: useAuthStore.getState().setError,
        clearError: useAuthStore.getState().clearError,
        logout: useAuthStore.getState().logout,
      },
      recipes: {
        addRecipe: useRecipesStore.getState().addRecipe,
        clearRecipes: useRecipesStore.getState().clearRecipes,
        generateRecipes: useRecipesStore.getState().generateRecipes,
      },
      recipesGeneration: {
        generateRecipes: useRecipesGenerationStore.getState().generateRecipes,
        clearCache: useRecipesGenerationStore.getState().clearCache,
      },
      savedRecipes: {
        saveRecipe: useSavedRecipesStore.getState().saveRecipe,
        removeRecipe: useSavedRecipesStore.getState().removeRecipe,
        clearSavedRecipes: useSavedRecipesStore.getState().clearSavedRecipes,
      },
    };
  }, []);

  const addTestResult = useCallback((result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  }, []);

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setTestResults([]);

    addTestResult("🧪 Iniciando tests de Zustand...");

    try {
      // Obtener estado y acciones actuales
      const currentState = getCurrentState();
      const actions = getActions();

      // Test 1: Verificar que los stores existen
      addTestResult("✅ Test 1: Stores creados correctamente");

      // Test 2: Verificar estado inicial
      addTestResult(
        `✅ Test 2: Estado inicial - Usuario: ${
          currentState.auth.user ? "Logueado" : "No logueado"
        }`
      );
      addTestResult(
        `✅ Test 2: Estado inicial - Recetas: ${currentState.recipes.recipes.length}`
      );
      addTestResult(
        `✅ Test 2: Estado inicial - Recetas guardadas: ${currentState.savedRecipes.savedRecipes.length}`
      );
      addTestResult(
        `✅ Test 2: Estado inicial - Recetas generación: ${currentState.recipesGeneration.recipes.length}`
      );

      // Test 3: Simular login
      addTestResult("🔄 Test 3: Simulando login...");
      actions.auth.setUser({
        id: "test-user-123",
        name: "Usuario Test",
        email: "test@example.com",
        createdAt: new Date(),
      });

      // Esperar un poco y verificar inmediatamente
      await new Promise((resolve) => setTimeout(resolve, 100));
      const stateAfterLogin = getCurrentState();
      if (stateAfterLogin.auth.user?.id === "test-user-123") {
        addTestResult("✅ Test 4: Usuario guardado correctamente");
      } else {
        addTestResult("❌ Test 4: Error al guardar usuario");
      }

      // Test 5: Simular agregar recetas
      addTestResult("🔄 Test 5: Simulando agregar recetas...");
      const testRecipe = {
        id: "test-recipe-1",
        title: "Receta Test",
        description: "Una receta de prueba",
        ingredients: "Ingredientes de prueba",
        instructions: "Instrucciones de prueba",
        cookingTime: 30,
        servings: 4,
        imageUrl: undefined,
        isPublic: true,
        userId: "test-user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: undefined,
        prepTime: "15 minutes",
        totalTime: "45 minutes",
        cuisine: "international",
        source: "test",
      } as any;

      actions.recipes.addRecipe(testRecipe);

      // Esperar un poco y verificar inmediatamente
      await new Promise((resolve) => setTimeout(resolve, 100));
      const stateAfterRecipe = getCurrentState();
      if (
        stateAfterRecipe.recipes.recipes.some((r) => r.id === "test-recipe-1")
      ) {
        addTestResult("✅ Test 6: Receta agregada correctamente");
      } else {
        addTestResult("❌ Test 6: Error al agregar receta");
      }

      // Test 7: Simular guardar receta
      addTestResult("🔄 Test 7: Simulando guardar receta...");
      const testSavedRecipe = {
        id: "test-saved-recipe-1",
        title: "Receta Guardada Test",
        servings: 2,
        cookingTime: "20 minutos",
        difficulty: "Fácil",
        image: "https://example.com/image.jpg",
        source: "test",
        ingredients: [{ name: "Ingrediente 1", quantity: 1, unit: "taza" }],
        instructions: ["Paso 1", "Paso 2"],
        description: "Una receta guardada de prueba",
        savedAt: new Date().toISOString(),
      };

      actions.savedRecipes.saveRecipe(testSavedRecipe, "test-user-123");

      // Esperar un poco y verificar inmediatamente
      await new Promise((resolve) => setTimeout(resolve, 100));
      const stateAfterSaved = getCurrentState();
      if (
        stateAfterSaved.savedRecipes.savedRecipes.some(
          (r) => r.id === "test-saved-recipe-1"
        )
      ) {
        addTestResult("✅ Test 8: Receta guardada correctamente");
      } else {
        addTestResult("❌ Test 8: Error al guardar receta");
      }

      // Test 9: Simular error
      addTestResult("🔄 Test 9: Simulando error...");
      actions.auth.setError("Error de prueba");

      // Esperar un poco y verificar inmediatamente
      await new Promise((resolve) => setTimeout(resolve, 100));
      const stateAfterError = getCurrentState();
      if (stateAfterError.auth.error === "Error de prueba") {
        addTestResult("✅ Test 9: Error establecido correctamente");
      } else {
        addTestResult("❌ Test 9: Error al establecer error");
      }

      // Test 10: Limpiar errores
      addTestResult("🔄 Test 10: Limpiando errores...");
      actions.auth.clearError();

      // Esperar un poco y verificar inmediatamente
      await new Promise((resolve) => setTimeout(resolve, 100));
      const stateAfterClear = getCurrentState();
      if (!stateAfterClear.auth.error) {
        addTestResult("✅ Test 10: Error limpiado correctamente");
      } else {
        addTestResult("❌ Test 10: Error al limpiar error");
      }

      // Test 11: Generar recetas con IA
      addTestResult("🔄 Test 11: Simulando generación de recetas...");
      try {
        await actions.recipesGeneration.generateRecipes();
        await new Promise((resolve) => setTimeout(resolve, 200));
        const stateAfterGeneration = getCurrentState();
        if (stateAfterGeneration.recipesGeneration.recipes.length > 0) {
          addTestResult("✅ Test 11: Recetas generadas correctamente");
        } else {
          addTestResult("❌ Test 11: Error al generar recetas");
        }
      } catch (error) {
        addTestResult("❌ Test 11: Error en generación de recetas");
      }

      // Test 12: Reset completo
      addTestResult("🔄 Test 12: Reseteando estado completo...");
      actions.auth.logout();
      actions.recipes.clearRecipes();
      actions.savedRecipes.clearSavedRecipes();

      // Esperar un poco y verificar inmediatamente
      await new Promise((resolve) => setTimeout(resolve, 100));
      const finalState = getCurrentState();
      if (
        !finalState.auth.user &&
        finalState.recipes.recipes.length === 0 &&
        finalState.savedRecipes.savedRecipes.length === 0
      ) {
        addTestResult("✅ Test 12: Estado reseteado correctamente");
      } else {
        addTestResult("❌ Test 12: Error al resetear estado");
      }

      addTestResult("🎉 ¡Todos los tests completados!");
      setIsRunning(false);
    } catch (error) {
      addTestResult(`❌ Error durante los tests: ${error}`);
      setIsRunning(false);
    }
  }, [getCurrentState, getActions, addTestResult]);

  return (
    <MainLayout currentPage="create">
      <div
        className="min-h-screen p-8"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: colors.interface.text.primary }}
          >
            🧪 Test de Stores de Zustand
          </h1>

          <div className="mb-8">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: isRunning
                  ? colors.interface.border.medium
                  : colors.brand.primary[500],
                color: colors.interface.text.inverse,
              }}
            >
              {isRunning ? "🔄 Ejecutando tests..." : "🚀 Ejecutar Tests"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Estado de Autenticación */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: colors.interface.text.primary }}
              >
                🔐 Autenticación
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  Usuario:{" "}
                  {getCurrentState().auth.user
                    ? getCurrentState().auth.user?.name
                    : "No logueado"}
                </div>
                <div>
                  Loading: {getCurrentState().auth.isLoading ? "Sí" : "No"}
                </div>
                <div>Error: {getCurrentState().auth.error || "Ninguno"}</div>
              </div>
            </div>

            {/* Estado de Recetas */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: colors.interface.text.primary }}
              >
                🍳 Recetas
              </h3>
              <div className="space-y-2 text-sm">
                <div>Cantidad: {getCurrentState().recipes.recipes.length}</div>
                <div>
                  Loading: {getCurrentState().recipes.isLoading ? "Sí" : "No"}
                </div>
                <div>
                  Cargadas:{" "}
                  {getCurrentState().recipes.hasLoadedRecipes ? "Sí" : "No"}
                </div>
                <div>
                  Índice activo: {getCurrentState().recipes.activeIndex}
                </div>
              </div>
            </div>

            {/* Estado de Generación de Recetas */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: colors.interface.text.primary }}
              >
                🤖 Generación de Recetas
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  Cantidad: {getCurrentState().recipesGeneration.recipes.length}
                </div>
                <div>
                  Loading:{" "}
                  {getCurrentState().recipesGeneration.isLoading ? "Sí" : "No"}
                </div>
                <div>
                  Cargadas:{" "}
                  {getCurrentState().recipesGeneration.hasLoadedRecipes
                    ? "Sí"
                    : "No"}
                </div>
                <div>
                  Error:{" "}
                  {getCurrentState().recipesGeneration.error || "Ninguno"}
                </div>
              </div>
            </div>

            {/* Estado de Recetas Guardadas */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.interface.border.light,
              }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: colors.interface.text.primary }}
              >
                💾 Recetas Guardadas
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  Cantidad: {getCurrentState().savedRecipes.savedRecipes.length}
                </div>
                <div>
                  Loading:{" "}
                  {getCurrentState().savedRecipes.isLoading ? "Sí" : "No"}
                </div>
                <div>
                  Eliminando:{" "}
                  {getCurrentState().savedRecipes.removingRecipeId || "Ninguna"}
                </div>
              </div>
            </div>
          </div>

          {/* Resultados de Tests */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: colors.interface.background.secondary,
              borderColor: colors.interface.border.light,
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: colors.interface.text.primary }}
            >
              📊 Resultados de Tests
            </h3>
            <div className="space-y-1 text-sm font-mono max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div style={{ color: colors.interface.text.secondary }}>
                  Haz clic en "Ejecutar Tests" para comenzar...
                </div>
              ) : (
                testResults.map((result, index) => (
                  <div
                    key={index}
                    style={{ color: colors.interface.text.primary }}
                  >
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
