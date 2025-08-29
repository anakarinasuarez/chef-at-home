"use client";

import { useState } from "react";
import { colors, typography, spacingSystem } from "@/design-system";
import Button from "@/components/Button";
import Nav from "@/components/Nav";
import Image from "next/image";
import plateImage from "@/assets/images/plate.png";

interface Ingredient {
  id: string;
  name: string;
}

export default function HomePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Fresh basil" },
    { id: "2", name: "Olive oil" },
    { id: "3", name: "Pine nuts" },
    { id: "4", name: "Garlic" },
  ]);
  const [newIngredient, setNewIngredient] = useState("");
  const [selectedServings, setSelectedServings] = useState<number | null>(4);
  const [userName, setUserName] = useState("Anna");

  // Nuevo estado para comensales personalizados
  const [customServings, setCustomServings] = useState<number[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newCustomServing, setNewCustomServing] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const newIngredientObj: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.trim(),
      };
      setIngredients([...ingredients, newIngredientObj]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleCreateRecipe = () => {
    // Obtener todos los comensales (selección simple + personalizados)
    const allServings =
      customServings.length > 0 ? customServings : [selectedServings || 4];

    console.log("Creating recipe with:", {
      ingredients,
      servings: allServings,
      selectedSimpleServing: selectedServings,
      customServings: customServings,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  // Funciones para manejar comensales personalizados
  const handleAddCustomServing = () => {
    const serving = parseInt(newCustomServing);
    if (serving > 0 && !customServings.includes(serving)) {
      setCustomServings([...customServings, serving]);
      setNewCustomServing("");
      setShowCustomInput(false);
      setSelectedServings(null); // Limpiar selección simple cuando se agregan personalizados
    }
  };

  const handleRemoveCustomServing = (serving: number) => {
    setCustomServings(customServings.filter((s) => s !== serving));
  };

  const handleCustomServingKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCustomServing();
    }
  };

  // Función para resetear todo el estado
  const handleCancel = () => {
    console.log("handleCancel ejecutándose...");
    setIngredients([]); // Eliminar todos los ingredientes
    setNewIngredient("");
    setSelectedServings(null); // No seleccionar ningún botón
    setCustomServings([]);
    setShowCustomInput(false);
    setNewCustomServing("");
    console.log("Estado reseteado completamente");
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={userName} />
      <main className="flex min-h-[calc(100vh-120px)] pt-4">
        {/* Columna Izquierda - Interfaz de Creación de Recetas */}
        <div className="flex-1 flex flex-col justify-start px-8 lg:px-16 pt-4">
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
              fontFamily: typography.styles["title-1"].fontFamily.join(", "),
              marginBottom: spacingSystem.base[6],
              color: colors.interface.text.primary,
            }}
          >
            What ingredients do you have to create your recipe?
          </h1>

          {/* Sección de Agregar Ingrediente */}
          <div className="space-y-3 mb-6">
            <label
              className="block text-white font-medium"
              style={{
                fontSize: typography.styles["body"].fontSize,
                fontWeight: typography.styles["body"].fontWeight,
                color: colors.interface.text.primary,
              }}
            >
              Add Ingredient
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add Ingredient"
                className="w-80 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  fontSize: typography.styles["caption"].fontSize,
                  fontFamily:
                    typography.styles["caption"].fontFamily.join(", "),
                  fontWeight: typography.styles["caption"].fontWeight,
                  lineHeight: typography.styles["caption"].lineHeight,
                  letterSpacing: typography.styles["caption"].letterSpacing,
                }}
              />
              <button
                onClick={handleAddIngredient}
                className="w-12 h-12 bg-transparent text-white rounded-lg flex items-center justify-center transition-colors border"
                style={{
                  borderColor: colors.brand.primary[500],
                  color: colors.brand.primary[500],
                }}
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Lista de Ingredientes */}
          <div className="space-y-3 mb-6">
            <label
              className="block text-white font-medium"
              style={{
                fontSize: typography.styles["body"].fontSize,
                fontWeight: typography.styles["body"].fontWeight,
                color: colors.interface.text.primary,
              }}
            >
              Ingredients
            </label>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="relative px-4 py-2 bg-transparent text-white rounded-lg flex items-center justify-center border group"
                  style={{
                    borderColor: colors.brand.primary[500],
                    color: colors.brand.primary[500],
                  }}
                >
                  <span
                    className="text-center"
                    style={{
                      fontSize: typography.styles["caption"].fontSize,
                      fontFamily:
                        typography.styles["caption"].fontFamily.join(", "),
                    }}
                  >
                    {ingredient.name}
                  </span>
                  <button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-5 h-5 flex items-center justify-center rounded-sm z-10"
                    style={{
                      color: colors.brand.primary[500],
                      backgroundColor: colors.interface.background.primary,
                      border: `2px solid ${colors.brand.primary[500]}`,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de Cantidad de Porciones */}
          <div className="space-y-3 mb-6">
            <label
              className="block text-white font-medium"
              style={{
                fontSize: typography.styles["body"].fontSize,
                fontWeight: typography.styles["body"].fontWeight,
                color: colors.interface.text.primary,
              }}
            >
              Serving amount
            </label>

            {/* Selección simple de comensales (solo visible cuando no hay input personalizado) */}
            {!showCustomInput && (
              <div className="flex gap-3">
                {[2, 4, 6].map((serving) => (
                  <button
                    key={serving}
                    onClick={() => setSelectedServings(serving)}
                    className={`w-12 h-12 rounded-lg transition-colors border-2 flex items-center justify-center ${
                      selectedServings === serving
                        ? "bg-white"
                        : "bg-transparent"
                    }`}
                    style={{
                      borderColor: colors.brand.primary[500],
                      color:
                        selectedServings === serving
                          ? colors.interface.background.primary
                          : colors.brand.primary[500],
                    }}
                  >
                    {serving}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowCustomInput(true);
                    setSelectedServings(null); // Limpiar selección simple cuando se muestra input personalizado
                  }}
                  className="w-12 h-12 bg-transparent text-white rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    color: colors.brand.primary[500],
                  }}
                >
                  <span className="text-xl font-bold">+</span>
                </button>
              </div>
            )}

            {/* Input personalizado para comensales */}
            {showCustomInput && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newCustomServing}
                    onChange={(e) => setNewCustomServing(e.target.value)}
                    onKeyPress={handleCustomServingKeyPress}
                    placeholder="Add number"
                    className="w-32 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      fontSize: typography.styles["caption"].fontSize,
                      fontFamily:
                        typography.styles["caption"].fontFamily.join(", "),
                      fontWeight: typography.styles["caption"].fontWeight,
                      lineHeight: typography.styles["caption"].lineHeight,
                      letterSpacing: typography.styles["caption"].letterSpacing,
                    }}
                  />
                  <button
                    onClick={handleAddCustomServing}
                    className="w-12 h-12 bg-transparent text-white rounded-lg flex items-center justify-center transition-colors border"
                    style={{
                      borderColor: colors.brand.primary[500],
                      color: colors.brand.primary[500],
                    }}
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                  <button
                    onClick={() => setShowCustomInput(false)}
                    className="w-12 h-12 bg-transparent text-white rounded-lg flex items-center justify-center transition-colors border"
                    style={{
                      borderColor: colors.brand.primary[500],
                      color: colors.brand.primary[500],
                    }}
                  >
                    <span className="text-xl font-bold">×</span>
                  </button>
                </div>
              </div>
            )}

            {/* Lista de comensales personalizados */}
            {customServings.length > 0 && (
              <div className="space-y-2">
                <label className="block text-white font-medium text-sm">
                  Custom servings:
                </label>
                <div className="flex flex-wrap gap-2">
                  {customServings.map((serving) => (
                    <div
                      key={serving}
                      className="relative px-4 py-2 bg-transparent text-white rounded-lg flex items-center justify-center border group"
                      style={{
                        borderColor: colors.brand.primary[500],
                        color: colors.brand.primary[500],
                      }}
                    >
                      <span className="text-center">{serving}</span>
                      <button
                        onClick={() => handleRemoveCustomServing(serving)}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-5 h-5 flex items-center justify-center rounded-sm z-10"
                        style={{
                          color: colors.brand.primary[500],
                          backgroundColor: colors.interface.background.primary,
                          border: `2px solid ${colors.brand.primary[500]}`,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button onClick={handleCreateRecipe} variant="primary">
              Create recipe
            </Button>
            <Button
              onClick={() => {
                console.log("Botón cancel clickeado");
                handleCancel();
              }}
              variant="secondary"
            >
              cancel
            </Button>
          </div>
        </div>

        {/* Columna Derecha - Imagen Gourmet */}
        <div className="flex-1 flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <div
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px]"
            style={{
              width: "480px",
              height: "480px",
            }}
          >
            <Image
              src={plateImage}
              alt="Gourmet dish with steak and vegetables"
              fill
              className="object-cover rounded-2xl"
              style={{
                borderRadius: spacingSystem.components.card.borderRadius,
              }}
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
