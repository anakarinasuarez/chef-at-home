"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors, typography, spacingSystem } from "@/design-system";
import Button from "@/components/Button";
import MainLayout from "@/components/layouts/MainLayout";
import { useSavedRecipes } from "@/hooks";

interface CreateRecipePageProps {
  userName: string;
  user: any;
}

export default function CreateRecipePage({
  userName,
  user,
}: CreateRecipePageProps) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [selectedServings, setSelectedServings] = useState<number | null>(null);
  const [customServings, setCustomServings] = useState<number[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newCustomServing, setNewCustomServing] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { updateRecipe } = useSavedRecipes();

  // Cargar datos de edición si existe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get("edit") === "true";

    if (isEditMode) {
      const editData = localStorage.getItem("editRecipeData");
      if (editData) {
        try {
          const parsedData = JSON.parse(editData);
          setIsEditing(true);
          setEditingRecipeId(parsedData.originalId);

          // Cargar ingredientes
          if (parsedData.ingredients && parsedData.ingredients.length > 0) {
            const formattedIngredients = parsedData.ingredients.map(
              (ing: any) => ({
                id: Date.now().toString() + Math.random(),
                name: ing.name || ing,
              })
            );
            setIngredients(formattedIngredients);
          }

          // Cargar servings
          if (parsedData.servings) {
            setSelectedServings(parsedData.servings);
          }

          // Limpiar localStorage después de cargar
          localStorage.removeItem("editRecipeData");
        } catch (error) {
          console.error("Error loading edit data:", error);
        }
      }
    }
  }, []);

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const newIngredientObj = {
        id: Date.now().toString() + Math.random(),
        name: newIngredient.trim(),
      };
      setIngredients([...ingredients, newIngredientObj]);
      setNewIngredient("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  const handleServingsChange = (servings: number) => {
    setSelectedServings(servings);
    setShowCustomInput(false);
  };

  const handleCustomServings = () => {
    if (newCustomServing.trim()) {
      const customValue = parseInt(newCustomServing);
      if (!isNaN(customValue) && customValue > 0) {
        setSelectedServings(customValue);
        setShowCustomInput(false);
        setNewCustomServing("");
      }
    }
  };

  const handleCreateRecipe = async () => {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    if (!selectedServings) {
      alert("Please select the number of servings");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredients.map((ing) => ing.name),
          servings: selectedServings,
          count: 4, // Generar 4 recetas para que coincida con la página de recetas
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipes");
      }

      const data = await response.json();
      console.log("Recetas generadas:", data);

      // Redirigir a la página de recetas
      router.push("/recipes");
    } catch (error) {
      console.error("Error generating recipes:", error);
      alert("Error generating recipes. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <MainLayout showMenu={true} userName={userName} currentPage="create">
      {/* Mensaje de Bienvenida */}
      <h2
        className="mb-4 text-white"
        style={{
          fontSize: typography.styles["body-large"].fontSize,
          fontWeight: typography.styles["body-large"].fontWeight,
          color: colors.interface.text.primary,
        }}
      >
        Welcome {userName}
      </h2>

      {/* Título Principal */}
      <h1
        className="mb-6 text-center lg:text-left leading-tight"
        style={{
          fontSize: typography.styles["title-1"].fontSize,
          fontWeight: typography.styles["title-1"].fontWeight,
          lineHeight: typography.styles["title-1"].lineHeight,
          letterSpacing: typography.styles["title-1"].letterSpacing,
          color: colors.interface.text.primary,
        }}
      >
        {isEditing ? "Edit your recipe" : "Create your perfect recipe"}
      </h1>

      {/* Sección de Ingredientes */}
      <div className="mb-8">
        <h3
          className="mb-4"
          style={{
            fontSize: typography.styles["title-3"].fontSize,
            fontWeight: typography.styles["title-3"].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          Ingredients
        </h3>

        {/* Input para agregar ingredientes */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add an ingredient..."
            className="w-80 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            style={{
              fontSize: typography.styles["body"].fontSize,
            }}
          />
          <Button
            variant="secondary"
            onClick={handleAddIngredient}
            className="px-6"
          >
            +
          </Button>
        </div>

        {/* Lista de ingredientes */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="group relative flex items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: colors.interface.background.secondary,
                }}
              >
                <span
                  className="text-sm text-center"
                  style={{ color: colors.brand.primary[500] }}
                >
                  {ingredient.name}
                </span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  style={{
                    backgroundColor: colors.interface.background.secondary,
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: colors.brand.primary[500] }}
                  >
                    ×
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Servings */}
      <div className="mb-8">
        <h3
          className="mb-4"
          style={{
            fontSize: typography.styles["title-3"].fontSize,
            fontWeight: typography.styles["title-3"].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          Servings
        </h3>

        {/* Botones de selección rápida - solo se muestran si no está en modo custom */}
        {!showCustomInput && (
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 4, 6, 8].map((servings) => (
              <button
                key={servings}
                onClick={() => handleServingsChange(servings)}
                className="px-4 py-2 rounded-lg border transition-colors duration-200"
                style={{
                  backgroundColor:
                    selectedServings === servings
                      ? colors.brand.primary[500]
                      : colors.interface.background.secondary,
                  borderColor: colors.brand.primary[500],
                  color:
                    selectedServings === servings
                      ? colors.interface.text.primary
                      : colors.interface.text.primary,
                }}
              >
                {servings}
              </button>
            ))}
            <button
              onClick={() => setShowCustomInput(true)}
              className="px-4 py-2 rounded-lg border transition-colors duration-200"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.brand.primary[500],
                color: colors.interface.text.primary,
              }}
            >
              +
            </button>
          </div>
        )}

        {/* Input personalizado - solo se muestra cuando está en modo custom */}
        {showCustomInput && (
          <div className="flex gap-2">
            <input
              type="number"
              value={newCustomServing}
              onChange={(e) => setNewCustomServing(e.target.value)}
              placeholder="Add numberts"
              className="w-40 px-3 py-2 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
            />
            <button
              onClick={() => setShowCustomInput(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border transition-colors duration-200"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.brand.primary[500],
                color: colors.interface.text.primary,
              }}
            >
              ×
            </button>
            <button
              onClick={handleCustomServings}
              className="w-10 h-10 flex items-center justify-center rounded-lg border transition-colors duration-200"
              style={{
                backgroundColor: colors.interface.background.secondary,
                borderColor: colors.brand.primary[500],
                color: colors.interface.text.primary,
              }}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Botón de Crear Receta */}
      <div className="flex gap-4">
        <Button
          variant="primary"
          onClick={handleCreateRecipe}
          disabled={isCreating || ingredients.length === 0 || !selectedServings}
          className="px-8 py-3"
        >
          {isCreating
            ? "Creating recipe..."
            : isEditing
            ? "Update Recipe"
            : "Create Recipe"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push("/my-recipes")}
          className="px-6 py-3"
        >
          My Recipes
        </Button>
      </div>
    </MainLayout>
  );
}
