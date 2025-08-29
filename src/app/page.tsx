"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors, typography, spacingSystem } from "@/design-system";
import Button from "@/components/Button";
import Nav from "@/components/Nav";
import Image from "next/image";
import plateImage from "@/assets/images/plate.png";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Mostrar spinner de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div
        className="min-h-screen text-white flex items-center justify-center"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está logueado, mostrar la interfaz de crear recetas
  if (user) {
    return <CreateRecipePage userName={user.name} />;
  }

  // Si no está logueado, mostrar la página de landing
  return <LandingPage />;
}

// Componente para la página de landing (cuando no está logueado)
function LandingPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      {/* Nav sin menú para usuarios no logueados */}
      <Nav showMenu={false} />

      <main className="flex min-h-[calc(100vh-120px)] pt-4">
        {/* Columna Izquierda - Contenido de Landing */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 pt-4">
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
            Turn your everyday ingredients
            <br />
            into gourmet masterpieces with
            <br />
            AI driven recipes
          </h1>

          {/* Lista de características */}
          <div className="mb-8 space-y-4">
            <div
              className="flex items-start space-x-3"
              style={{
                fontSize: typography.styles["body-large"].fontSize,
                fontWeight: typography.styles["body-large"].fontWeight,
                color: colors.interface.text.primary,
              }}
            >
              <span className="text-primary-500 text-xl">•</span>
              <span>
                Reduce waste, save money, and
                <br />
                cook like a pro
              </span>
            </div>
            <div
              className="flex items-start space-x-3"
              style={{
                fontSize: typography.styles["body-large"].fontSize,
                fontWeight: typography.styles["body-large"].fontWeight,
                color: colors.interface.text.primary,
              }}
            >
              <span className="text-primary-500 text-xl">•</span>
              <span>
                Unleash your inner chef and create
                <br />
                magic in the kitchen!
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={() => router.push("/auth/signup")}
            >
              Sign up free
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          </div>
        </div>

        {/* Columna Derecha - Imagen */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
          <div className="relative w-full max-w-lg">
            <Image
              src={plateImage}
              alt="Gourmet dish"
              className="w-full h-auto rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente para la página de crear recetas (cuando está logueado)
function CreateRecipePage({ userName }: { userName: string }) {
  const [ingredients, setIngredients] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [selectedServings, setSelectedServings] = useState<number | null>(null);

  // Nuevo estado para comensales personalizados
  const [customServings, setCustomServings] = useState<number[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newCustomServing, setNewCustomServing] = useState("");

  // Nuevo estado para loading
  const [isCreating, setIsCreating] = useState(false);

  // Nuevo estado para notificaciones
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    show: boolean;
  } | null>(null);

  // Función helper para mostrar notificaciones
  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setNotification({ message, type, show: true });
    // Auto-hide después de 3 segundos
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Función para normalizar texto (remover acentos y convertir a minúsculas)
  const normalizeText = (text: string): string => {
    return text
      .normalize("NFD") // Descompone los caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remueve los diacríticos (acentos)
      .toLowerCase() // Convierte a minúsculas
      .trim(); // Remueve espacios en blanco
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      // Verificar si el ingrediente ya existe (normalizando acentos y case)
      const normalizedNewIngredient = normalizeText(newIngredient);
      const ingredientExists = ingredients.some(
        (ing) => normalizeText(ing.name) === normalizedNewIngredient
      );

      if (ingredientExists) {
        showNotification("This ingredient is already in your list!", "error");
        return;
      }

      const newIngredientObj = {
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

  const handleCreateRecipe = async () => {
    // Validar que haya ingredientes
    if (ingredients.length === 0) {
      showNotification("Please add at least one ingredient", "error");
      return;
    }

    // Validar que haya comensales seleccionados
    const allServings =
      customServings.length > 0 ? customServings : [selectedServings || 4];
    if (!selectedServings && customServings.length === 0) {
      showNotification("Please select the number of servings", "error");
      return;
    }

    // Activar loading
    setIsCreating(true);

    try {
      // Simular proceso de creación (aquí irá la llamada a la API)
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 segundos de simulación

      console.log("Creating recipe with:", {
        ingredients,
        servings: allServings,
      });

      // Aquí irá la lógica para guardar la receta
      showNotification("Recipe created successfully!", "success");
    } catch (error) {
      console.error("Error creating recipe:", error);
      showNotification("Error creating recipe. Please try again.", "error");
    } finally {
      // Desactivar loading
      setIsCreating(false);
    }
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
      setSelectedServings(null);
    } else if (serving > 0 && customServings.includes(serving)) {
      showNotification("This serving amount is already selected!", "error");
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
    setIngredients([]);
    setNewIngredient("");
    setSelectedServings(null);
    setCustomServings([]);
    setShowCustomInput(false);
    setNewCustomServing("");
  };

  // Si está creando la receta, mostrar loading
  if (isCreating) {
    return (
      <div
        className="min-h-screen text-white"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        {/* Nav con menú para usuarios logueados */}
        <Nav showMenu={true} userName={userName} />

        <main className="flex min-h-[calc(100vh-120px)] pt-4">
          {/* Columna Izquierda - Loading */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16 pt-4">
            {/* Loading Spinner */}
            <div className="mb-6">
              <div
                className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: `${colors.brand.primary[500]} transparent ${colors.brand.primary[500]} ${colors.brand.primary[500]}`,
                }}
              ></div>
            </div>

            {/* Mensaje de Loading */}
            <h2
              className="text-center"
              style={{
                fontSize: typography.styles["title-2"].fontSize,
                fontWeight: typography.styles["title-2"].fontWeight,
                color: colors.interface.text.primary,
              }}
            >
              Creating flavor...
            </h2>

            {/* Mensaje adicional */}
            <p
              className="text-center mt-4 opacity-80"
              style={{
                fontSize: typography.styles["body"].fontSize,
                color: colors.interface.text.secondary,
              }}
            >
              Please wait while we craft your perfect recipe
            </p>
          </div>

          {/* Columna Derecha - Imagen (mantener igual) */}
          <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
            <div className="relative w-full max-w-lg">
              <Image
                src={plateImage}
                alt="Gourmet dish"
                className="w-full h-auto rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Renderizado normal cuando no está creando
  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      {/* Nav con menú para usuarios logueados */}
      <Nav showMenu={true} userName={userName} />

      {/* Notificación */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
          style={{
            backgroundColor:
              notification.type === "error"
                ? "#EF4444"
                : notification.type === "success"
                ? "#10B981"
                : "#3B82F6",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
              color: colors.interface.text.primary,
            }}
          >
            Create your perfect recipe
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
                className="flex-1 px-4 py-3 bg-background-secondary border border-outline rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                style={{
                  fontSize: typography.styles["caption"].fontSize,
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
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="relative bg-background-secondary border border-primary-500 rounded-lg px-3 py-2 text-primary-500 flex items-center"
                  style={{
                    fontSize: typography.styles["body"].fontSize,
                  }}
                >
                  <span>{ingredient.name}</span>
                  <button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className="ml-2 w-5 h-5 bg-primary-500 text-background-primary rounded-full flex items-center justify-center text-sm hover:bg-primary-600 transition-colors absolute -top-2 -right-2 z-10"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de Comensales */}
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

            {/* Selección simple */}
            {!showCustomInput && (
              <div className="flex gap-2 mb-4">
                {[2, 4, 6, 8].map((serving) => (
                  <button
                    key={serving}
                    onClick={() => setSelectedServings(serving)}
                    className="w-12 h-12 rounded-lg border-2 transition-colors"
                    style={{
                      fontSize: typography.styles["body"].fontSize,
                      backgroundColor:
                        selectedServings === serving
                          ? colors.app.button.secondary.hover
                          : "transparent",
                      borderColor:
                        selectedServings === serving
                          ? colors.app.button.secondary.hover
                          : colors.interface.border.light,
                      color:
                        selectedServings === serving
                          ? colors.interface.background.primary
                          : colors.interface.text.primary,
                    }}
                  >
                    {serving}
                  </button>
                ))}
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-12 h-12 border-2 rounded-lg transition-colors flex items-center justify-center"
                  style={{
                    borderColor: colors.brand.primary[500],
                    color: colors.brand.primary[500],
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.brand.primary[500];
                    e.currentTarget.style.color =
                      colors.interface.background.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.brand.primary[500];
                  }}
                >
                  +
                </button>
              </div>
            )}

            {/* Input personalizado */}
            {showCustomInput && (
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={newCustomServing}
                  onChange={(e) => setNewCustomServing(e.target.value)}
                  onKeyPress={handleCustomServingKeyPress}
                  placeholder="Custom servings..."
                  className="flex-1 px-4 py-3 bg-background-secondary border border-outline rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  style={{
                    fontSize: typography.styles["caption"].fontSize,
                  }}
                />
                <Button
                  variant="secondary"
                  onClick={handleAddCustomServing}
                  className="px-6"
                >
                  +
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowCustomInput(false);
                    setNewCustomServing("");
                  }}
                  className="px-6"
                >
                  ×
                </Button>
              </div>
            )}

            {/* Comensales personalizados */}
            {customServings.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customServings.map((serving) => (
                  <div
                    key={serving}
                    className="bg-background-secondary border border-primary-500 rounded-lg px-3 py-2 text-primary-500 flex items-center"
                    style={{
                      fontSize: typography.styles["body"].fontSize,
                    }}
                  >
                    <span>{serving} servings</span>
                    <button
                      onClick={() => handleRemoveCustomServing(serving)}
                      className="ml-2 w-5 h-5 bg-primary-500 text-background-primary rounded-full flex items-center justify-center text-sm hover:bg-primary-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button variant="primary" onClick={handleCreateRecipe}>
              Create recipe
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Columna Derecha - Imagen */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
          <div className="relative w-full max-w-lg">
            <Image
              src={plateImage}
              alt="Gourmet dish"
              className="w-full h-auto rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
