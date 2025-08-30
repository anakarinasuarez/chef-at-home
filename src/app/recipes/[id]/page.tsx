"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiPlus, BiShareAlt, BiTime, BiUser } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import Nav from "@/components/Nav";
import { colors } from "@/design-system";
import { typography } from "@/design-system";
import { useAuth } from "@/contexts/AuthContext";

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
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = () => {
      try {
        setLoading(true);

        const savedRecipe = localStorage.getItem(`recipe-${params.id}`);

        if (savedRecipe) {
          const recipeData = JSON.parse(savedRecipe);
          console.log("Loaded recipe from localStorage:", recipeData);

          setRecipe(recipeData);
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Recipe Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
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
              <div>
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

            <div className="flex gap-3">
              <button
                className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
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
                <BiPlus className="text-lg" />
                Save
              </button>
              <button
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Recipe Image - LEFT COLUMN (2/3 del ancho - más grande) */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden h-[500px] w-full">
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: colors.interface.background.secondary,
                  }}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p
                      className="text-gray-400"
                      style={{ color: colors.interface.text.secondary }}
                    >
                      No image available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients - RIGHT COLUMN (al lado de la imagen) */}
          <div className="lg:col-span-1">
            <div
              className="rounded-xl pt-12 pb-6 px-6 shadow-lg w-full h-[500px] min-w-96"
              style={{ backgroundColor: colors.interface.background.secondary }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.interface.text.primary }}
                >
                  Ingredients
                </h2>
                <div
                  className="px-4 py-2 rounded-full flex items-center gap-2 ml-8"
                  style={{
                    backgroundColor: colors.interface.background.tertiary,
                    border: "none",
                    color: colors.interface.text.primary,
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: colors.interface.background.secondary,
                      color: colors.interface.text.primary,
                    }}
                  >
                    {recipe.servings}
                  </span>
                  <span
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: colors.interface.text.primary }}
                  >
                    Serving amount
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.brand.primary[500] }}
                        ></div>
                        <span
                          className="text-lg"
                          style={{
                            color: colors.interface.text.primary,
                            fontSize: typography.styles["body"].fontSize,
                            fontWeight: typography.styles["body"].fontWeight,
                            lineHeight: typography.styles["body"].lineHeight,
                          }}
                        >
                          {ingredient.name}
                        </span>
                      </div>
                      <span
                        className="font-medium"
                        style={{ color: colors.interface.text.secondary }}
                      >
                        {ingredient.quantity}
                        {ingredient.unit}
                      </span>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-gray-400"
                    style={{ color: colors.interface.text.secondary }}
                  >
                    No ingredients available
                  </p>
                )}
              </div>
            </div>
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
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: colors.interface.text.primary }}
                    >
                      Step {index + 1}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: colors.interface.text.secondary }}
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
    </div>
  );
}
