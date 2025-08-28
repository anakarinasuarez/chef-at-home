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
  const [selectedServings, setSelectedServings] = useState(4);
  const [userName, setUserName] = useState("Anna");

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
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleCreateRecipe = () => {
    // TODO: Implementar lógica de creación de receta
    console.log("Creating recipe with:", { ingredients, servings: selectedServings });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} />
      <main className="flex min-h-[calc(100vh-120px)] pt-8">
        {/* Columna Izquierda - Interfaz de Creación de Recetas */}
        <div className="flex-1 flex flex-col justify-start px-8 lg:px-16 pt-8">
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
            className="mb-8 text-center lg:text-left leading-tight"
            style={{
              fontSize: typography.styles["title-1"].fontSize,
              fontWeight: typography.styles["title-1"].fontWeight,
              lineHeight: typography.styles["title-1"].lineHeight,
              letterSpacing: typography.styles["title-1"].letterSpacing,
              fontFamily: typography.styles["title-1"].fontFamily.join(", "),
              marginBottom: spacingSystem.base[8],
              color: colors.interface.text.primary,
            }}
          >
            What ingredients do you have to create your recipe?
          </h1>

          {/* Sección de Agregar Ingrediente */}
          <div className="space-y-4 mb-8">
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
                  fontFamily: typography.styles["caption"].fontFamily.join(", "),
                  fontWeight: typography.styles["caption"].fontWeight,
                  lineHeight: typography.styles["caption"].lineHeight,
                  letterSpacing: typography.styles["caption"].letterSpacing,
                }}
              />
              <button
                onClick={handleAddIngredient}
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: colors.interface.background.secondary,
                }}
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Lista de Ingredientes */}
          <div className="space-y-4 mb-8">
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
                  className="px-4 py-2 bg-transparent text-white rounded-lg flex items-center gap-2 border"
                  style={{
                    borderColor: colors.brand.primary[500],
                    color: colors.brand.primary[500],
                  }}
                >
                  <span
                    style={{
                      fontSize: typography.styles["caption"].fontSize,
                      fontFamily: typography.styles["caption"].fontFamily.join(", "),
                    }}
                  >
                    {ingredient.name}
                  </span>
                  <button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                    style={{
                      color: colors.brand.primary[500],
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de Cantidad de Porciones */}
          <div className="space-y-4 mb-8">
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
            <div className="flex gap-3">
              {[2, 4, 6].map((serving) => (
                <button
                  key={serving}
                  onClick={() => setSelectedServings(serving)}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    selectedServings === serving
                      ? "bg-gray-600 text-white"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  style={{
                    backgroundColor: selectedServings === serving 
                      ? colors.interface.background.surface
                      : colors.interface.background.secondary,
                  }}
                >
                  {serving}
                </button>
              ))}
              <button
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: colors.interface.background.secondary,
                }}
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleCreateRecipe}
              variant="primary"
            >
              Create recipe
            </Button>
            <Button href="/" variant="secondary">
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
