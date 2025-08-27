"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function RecipesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white text-xl flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white text-xl flex items-center justify-center">
        Please log in to view recipes
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
            >
              ←
            </button>
            <h1 className="text-2xl font-semibold text-white">
              {user.name} these are the recipe options
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-white">
            What would you like to do today?
          </h2>
        </div>

        {/* Recipe Cards - Horizontal Layout */}
        <div className="relative">
          <div
            className="flex gap-6 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Recipe Card 1 - Pesto Pasta */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-base font-bold text-white mb-4">
                  Pesto Pasta
                </h3>
                <div className="space-y-2 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>for 4 people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>duration 10 minutes</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-700 rounded-lg mb-4 flex-shrink-0"></div>
                <div className="mt-auto">
                  <button
                    className="px-4 py-2 border border-green-500 text-green-500 bg-gray-800 hover:bg-green-500 hover:text-white rounded-lg text-sm transition-colors"
                    style={{ borderColor: "#10b981", color: "#10b981" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Recipe Card 2 - Pasta with Basil and Lemon */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-base font-bold text-white mb-4">
                  Pasta with Basil and Lemon
                </h3>
                <div className="space-y-2 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>for 4 people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>duration 12 minutes</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-700 rounded-lg mb-4 flex-shrink-0"></div>
                <div className="mt-auto">
                  <button
                    className="px-4 py-2 border border-green-500 text-green-500 bg-gray-800 hover:bg-green-500 hover:text-white rounded-lg text-sm transition-colors"
                    style={{ borderColor: "#10b981", color: "#10b981" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Recipe Card 3 - Margherita Pizza with Pesto */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-base font-bold text-white mb-4">
                  Margherita Pizza with Pesto
                </h3>
                <div className="space-y-2 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>for 3 people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>duration 15 minutes</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-700 rounded-lg mb-4 flex-shrink-0"></div>
                <div className="mt-auto">
                  <button
                    className="px-4 py-2 border border-green-500 text-green-500 bg-gray-800 hover:bg-green-500 hover:text-white rounded-lg text-sm transition-colors"
                    style={{ borderColor: "#10b981", color: "#10b981" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Recipe Card 4 - Bruschetta with Tomato */}
            <div className="flex-shrink-0 w-80">
              <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-base font-bold text-white mb-4">
                  Bruschetta with Tomato
                </h3>
                <div className="space-y-2 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>for 2 people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>duration 8 minutes</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-700 rounded-lg mb-4 flex-shrink-0"></div>
                <div className="mt-auto">
                  <button
                    className="px-4 py-2 border border-green-500 text-green-500 bg-gray-800 hover:bg-green-500 hover:text-white rounded-lg text-sm transition-colors"
                    style={{ borderColor: "#10b981", color: "#10b981" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
              <span>← Desliza para ver más recetas →</span>
            </div>
          </div>
        </div>

        {/* Debug info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-white text-sm">
            Debug: Página funcionando - 4 tarjetas en layout horizontal
          </p>
        </div>
      </main>
    </div>
  );
}
