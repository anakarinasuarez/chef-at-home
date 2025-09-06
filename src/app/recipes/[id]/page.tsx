"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiPlus, BiShareAlt, BiTime, BiUser } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { BiShare } from "react-icons/bi";
import Nav from "@/components/Nav";
import IngredientsCard from "@/components/IngredientsCard";
import { colors } from "@/design-system";
import { typography } from "@/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedRecipes } from "@/hooks";
import { useNotification } from "@/contexts/NotificationContext";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import ImagePlaceholder from "@/components/ImagePlaceholder";

interface Recipe {
  id: string;
  title: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  cookingTime: string;
  difficulty: string;
  cuisine?: string;
  servings: number;
  image?: string;
  source: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isRecipeSaved, removeRecipe, toggleSaveRecipe } = useSavedRecipes();
  const { showNotification } = useNotification();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFromMyRecipes, setIsFromMyRecipes] = useState(false);
  const [isRecipeSavedState, setIsRecipeSavedState] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadRecipe = () => {
      try {
        setLoading(true);

        // Verificar si viene desde My Recipes
        const urlParams = new URLSearchParams(window.location.search);
        const isFromMyRecipesParam = urlParams.get("from") === "my-recipes";
        const referrer = document.referrer;
        const isFromMyRecipesReferrer = referrer.includes("/my-recipes");

        const isFromMyRecipesPage =
          isFromMyRecipesParam || isFromMyRecipesReferrer;
        setIsFromMyRecipes(isFromMyRecipesPage);

        console.log("Current URL:", window.location.href);
        console.log("URL params:", urlParams.toString());
        console.log("From My Recipes param:", isFromMyRecipesParam);
        console.log("From My Recipes referrer:", isFromMyRecipesReferrer);
        console.log("From My Recipes final:", isFromMyRecipesPage);

        const savedRecipe = localStorage.getItem(`recipe-${params.id}`);

        if (savedRecipe) {
          const recipeData = JSON.parse(savedRecipe);
          console.log("Loaded recipe from localStorage:", recipeData);

          setRecipe(recipeData);

          // Verificar si la receta está guardada
          if (user) {
            const isSaved = isRecipeSaved(recipeData.id);
            // Si viene de My Recipes, forzar que se considere como guardada
            const finalSavedState = isFromMyRecipesPage || isSaved;
            setIsRecipeSavedState(finalSavedState);
            console.log("Recipe saved status on load:", isSaved);
            console.log(
              "Final saved state (with My Recipes override):",
              finalSavedState
            );
          }
        } else {
          console.log("No recipe found in localStorage for ID:", params.id);
          router.push("/recipes");
          return;
        }
      } catch (error) {
        console.error("Error loading recipe:", error);
        router.push("/recipes");
        return;
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.id, router]);

  // Debug useEffect para monitorear cambios
  useEffect(() => {
    console.log(
      "Button condition - isFromMyRecipes:",
      isFromMyRecipes,
      "isRecipeSavedState:",
      isRecipeSavedState,
      "Final condition:",
      isFromMyRecipes || isRecipeSavedState
    );
  }, [isFromMyRecipes, isRecipeSavedState]);

  const handleSaveRecipe = () => {
    if (!recipe) {
      console.log("No recipe available");
      return;
    }

    if (!user) {
      console.log("No user available");
      showNotification("Please log in to save recipes", "error");
      return;
    }

    console.log("Saving recipe:", recipe.title, "with ID:", recipe.id);

    try {
      const success = toggleSaveRecipe(recipe);
      console.log("Toggle save result:", success);

      if (success) {
        // Actualizar el estado local
        const newSavedState = !isRecipeSavedState;
        setIsRecipeSavedState(newSavedState);

        const message = newSavedState
          ? "Recipe saved to favorites!"
          : "Recipe removed from favorites!";
        showNotification(message, newSavedState ? "success" : "info");

        console.log("Recipe saved status updated:", newSavedState);
      } else {
        showNotification("Error saving recipe", "error");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      showNotification("Error saving recipe", "error");
    }
  };

  const handleEditRecipe = () => {
    if (!recipe) return;

    // Guardar los datos de la receta en localStorage para editarlos
    const editData = {
      title: recipe.title,
      ingredients: recipe.ingredients || [],
      servings: recipe.servings,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty || "medium",
      cuisine: "international",
      instructions: recipe.instructions || [],
      isEditing: true,
      originalId: recipe.id,
    };

    localStorage.setItem("editRecipeData", JSON.stringify(editData));
    router.push("/?edit=true");
  };

  const handleDeleteRecipe = () => {
    if (!recipe) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!recipe) return;
    removeRecipe(recipe.id);
    setShowDeleteModal(false);
    router.push("/my-recipes");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleShareRecipe = () => {
    if (!recipe) return;

    // Implementar funcionalidad de compartir
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Recipe link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user?.name || "User"} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.brand.primary[500] }}
            ></div>
            <p
              className="text-lg"
              style={{ color: colors.interface.text.primary }}
            >
              Loading recipe...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <Nav showMenu={true} userName={user?.name || "User"} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              Recipe not found
            </h1>
            <button
              onClick={() => router.push("/recipes")}
              className="px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: colors.brand.primary[500],
                color: colors.base.white,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.brand.primary[500];
              }}
            >
              Back to Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={user?.name || "User"} />

      <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
        {/* Recipe Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg transition-colors mt-1"
                style={{
                  backgroundColor: colors.interface.background.tertiary,
                  color: colors.base.white,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.interface.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.interface.background.tertiary;
                }}
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              <div className="flex-1">
                <h1
                  className="text-4xl font-bold mb-4"
                  style={{ color: colors.interface.text.primary }}
                >
                  {recipe.title}
                </h1>
                <div
                  className="flex items-center gap-6"
                  style={{ color: colors.interface.text.secondary }}
                >
                  <div className="flex items-center gap-2">
                    <BiUser style={{ color: colors.brand.primary[500] }} />
                    <span>for {recipe.servings} people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BiTime style={{ color: colors.brand.primary[500] }} />
                    <span>duration {recipe.cookingTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              {/* Forzar botones de receta guardada si viene de My Recipes */}
              {isFromMyRecipes || isRecipeSavedState ? (
                // Si la receta está guardada, mostrar Edit/Delete/Share
                <>
                  <button
                    onClick={() => handleEditRecipe()}
                    className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium border"
                    style={{
                      backgroundColor: "transparent",
                      color: colors.brand.primary[500],
                      borderColor: colors.brand.primary[500],
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.brand.primary[500];
                      e.currentTarget.style.color = colors.base.white;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.brand.primary[500];
                      e.currentTarget.style.borderColor =
                        colors.brand.primary[500];
                    }}
                  >
                    <FaPencil
                      className="text-lg"
                      style={{ color: colors.brand.primary[500] }}
                    />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe()}
                    className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium border"
                    style={{
                      backgroundColor: "transparent",
                      color: colors.brand.primary[500],
                      borderColor: colors.brand.primary[500],
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#EF4444";
                      e.currentTarget.style.color = colors.base.white;
                      e.currentTarget.style.borderColor = "#EF4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.brand.primary[500];
                      e.currentTarget.style.borderColor =
                        colors.brand.primary[500];
                    }}
                  >
                    <MdDelete
                      className="text-lg"
                      style={{ color: colors.brand.primary[500] }}
                    />
                    Delete
                  </button>
                  <button
                    onClick={() => handleShareRecipe()}
                    className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium border"
                    style={{
                      backgroundColor: "transparent",
                      color: colors.brand.primary[500],
                      borderColor: colors.brand.primary[500],
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.interface.background.tertiary;
                      e.currentTarget.style.color =
                        colors.interface.text.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.brand.primary[500];
                    }}
                  >
                    <BiShare
                      className="text-lg"
                      style={{ color: colors.brand.primary[500] }}
                    />
                    Share
                  </button>
                </>
              ) : (
                // Si la receta NO está guardada, mostrar Save/Share
                <>
                  <button
                    onClick={() => handleSaveRecipe()}
                    className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    style={{
                      backgroundColor: isRecipeSavedState
                        ? colors.interface.background.tertiary
                        : colors.brand.primary[500],
                      color: isRecipeSavedState
                        ? colors.brand.primary[500]
                        : colors.base.white,
                      border: isRecipeSavedState
                        ? `2px solid ${colors.brand.primary[500]}`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isRecipeSavedState) {
                        e.currentTarget.style.backgroundColor =
                          colors.brand.primary[600];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRecipeSavedState) {
                        e.currentTarget.style.backgroundColor =
                          colors.brand.primary[500];
                      }
                    }}
                  >
                    {isRecipeSavedState ? (
                      <span className="text-lg">✓</span>
                    ) : (
                      <BiPlus className="text-lg" />
                    )}
                    {isRecipeSavedState ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={() => handleShareRecipe()}
                    className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium border"
                    style={{
                      backgroundColor: "transparent",
                      color: colors.brand.primary[500],
                      borderColor: colors.brand.primary[500],
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.brand.primary[500];
                      e.currentTarget.style.color = colors.base.white;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.brand.primary[500];
                    }}
                  >
                    <BiShareAlt className="text-lg" />
                    Share
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 overflow-hidden">
          {/* Recipe Image - LEFT COLUMN (2/3 del ancho - más grande) */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden h-[500px] w-full">
              {recipe.image && !imageError ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImagePlaceholder
                  title={recipe.title}
                  cuisine={recipe.cuisine || "International"}
                  className="h-[500px] w-full"
                  ingredients={recipe.ingredients.map((ing) => ing.name)}
                />
              )}
            </div>
          </div>

          {/* Ingredients - RIGHT COLUMN (al lado de la imagen) */}
          <div className="lg:col-span-1 min-w-0">
            <IngredientsCard
              ingredients={recipe.ingredients || []}
              servings={recipe.servings}
              imageHeight={500}
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h2
            className="text-2xl font-bold mb-8"
            style={{ color: colors.interface.text.primary }}
          >
            Instructions
          </h2>

          <div className="space-y-6">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold"
                    style={{
                      backgroundColor: colors.brand.primary[500],
                      color: colors.base.white,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p
                      className="leading-relaxed text-lg"
                      style={{ color: colors.interface.text.primary }}
                    >
                      {instruction}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p
                className="text-gray-400"
                style={{ color: colors.interface.text.secondary }}
              >
                No instructions available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={recipe?.title || ""}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
