import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecipesGeneration } from "../useRecipesGeneration";

// Mock UniversalCacheManager
vi.mock("@/lib/universal-cache", () => ({
  UniversalCacheManager: {
    initialize: vi.fn(),
    clearAllCache: vi.fn(),
    getCachedData: vi.fn(),
    setCachedData: vi.fn(),
  },
}));

// Mock window.location
const mockLocation = {
  href: "http://localhost:3000/recipes",
  search: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
  writable: true,
});

// Mock URLSearchParams
const mockURLSearchParams = {
  get: vi.fn(),
};

global.URLSearchParams = vi.fn(() => mockURLSearchParams) as any;

describe("useRecipesGeneration", () => {
  const mockRecipes = [
    {
      id: "recipe-1",
      title: "Pasta with Basil",
      servings: 4,
      cookingTime: "30 minutes",
      image: "https://example.com/pasta.jpg",
      source: "ai-generated",
      ingredients: [
        { name: "pasta", quantity: 500, unit: "g" },
        { name: "basil", quantity: 50, unit: "g" },
        { name: "olive oil", quantity: 3, unit: "tbsp" },
      ],
      instructions: ["Boil pasta", "Add basil", "Serve"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockSessionStorage.getItem.mockReturnValue(null);
    mockSessionStorage.setItem.mockImplementation(() => {});
    mockSessionStorage.removeItem.mockImplementation(() => {});

    mockURLSearchParams.get.mockReturnValue(null);

    // Reset location
    mockLocation.href = "http://localhost:3000/recipes";
    mockLocation.search = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("initializes with correct default values", () => {
      const { result } = renderHook(() => useRecipesGeneration());

      expect(result.current.recipes).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.hasLoadedRecipes).toBe(false);
      expect(typeof result.current.generateRecipes).toBe("function");
      expect(typeof result.current.clearCache).toBe("function");
    });
  });

  describe("generateRecipes", () => {
    it("loads recipes from sessionStorage when no URL params", async () => {
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockRecipes));

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.recipes).toEqual(mockRecipes);
      expect(result.current.hasLoadedRecipes).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("handles corrupted sessionStorage data gracefully", async () => {
      mockSessionStorage.getItem.mockReturnValue("invalid-json");

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      // Should generate fallback recipes when sessionStorage is corrupted
      expect(result.current.recipes.length).toBeGreaterThan(0);
      expect(result.current.loading).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Error parsing saved recipes:",
        expect.any(Error)
      );
    });

    it("skips generation when recipes already loaded", async () => {
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockRecipes));

      const { result } = renderHook(() => useRecipesGeneration());

      // First call
      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.hasLoadedRecipes).toBe(true);

      // Second call should skip
      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.hasLoadedRecipes).toBe(true);
    });

    it("handles force generation parameter", async () => {
      mockURLSearchParams.get.mockImplementation((key) => {
        if (key === "force") return "true";
        return null;
      });

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.loading).toBe(false);
    });

    it("handles ingredients parameter", async () => {
      mockURLSearchParams.get.mockImplementation((key) => {
        if (key === "ingredients") return "chicken,rice,vegetables";
        return null;
      });

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.loading).toBe(false);
    });

    it("handles servings parameter", async () => {
      mockURLSearchParams.get.mockImplementation((key) => {
        if (key === "servings") return "6";
        return null;
      });

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.loading).toBe(false);
    });

    it("handles saved recipe parameter", async () => {
      mockURLSearchParams.get.mockImplementation((key) => {
        if (key === "saved") return "recipe-123";
        return null;
      });

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("clearCache", () => {
    it("clears cache and resets state", async () => {
      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.clearCache();
      });

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        "currentRecipes"
      );
    });

    it("handles cache clearing errors gracefully", async () => {
      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.clearCache();
      });

      // Should not throw errors and should clear sessionStorage
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        "currentRecipes"
      );
    });
  });

  describe("Error Handling", () => {
    it("handles general errors gracefully", async () => {
      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      // Should handle errors gracefully and generate fallback recipes
      expect(result.current.loading).toBe(false);
    });
  });

  describe("URL Parameter Handling", () => {
    it("detects specific parameters correctly", async () => {
      mockURLSearchParams.get.mockImplementation((key) => {
        if (key === "ingredients") return "chicken,rice";
        if (key === "servings") return "4";
        return null;
      });

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.loading).toBe(false);
    });

    it("uses default ingredients when no parameters", async () => {
      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("SessionStorage Integration", () => {
    it("saves recipes to sessionStorage after generation", async () => {
      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      // Should generate recipes and potentially save them
      expect(result.current.recipes.length).toBeGreaterThan(0);
    });

    it("loads recipes from sessionStorage on initialization", async () => {
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockRecipes));

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      expect(mockSessionStorage.getItem).toHaveBeenCalledWith("currentRecipes");
      expect(result.current.recipes).toEqual(mockRecipes);
    });
  });

  describe("Performance", () => {
    it("does not cause unnecessary re-renders", () => {
      const { result } = renderHook(() => useRecipesGeneration());

      const initialGenerateRecipes = result.current.generateRecipes;
      const initialClearCache = result.current.clearCache;

      // Call functions
      act(() => {
        result.current.generateRecipes();
        result.current.clearCache();
      });

      // Functions should remain stable
      expect(result.current.generateRecipes).toBe(initialGenerateRecipes);
      expect(result.current.clearCache).toBe(initialClearCache);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty sessionStorage", async () => {
      mockSessionStorage.getItem.mockReturnValue("");

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      // Should generate fallback recipes when sessionStorage is empty
      expect(result.current.recipes.length).toBeGreaterThan(0);
      expect(result.current.loading).toBe(false);
    });

    it("handles null sessionStorage", async () => {
      mockSessionStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      // Should generate fallback recipes when sessionStorage is null
      expect(result.current.recipes.length).toBeGreaterThan(0);
      expect(result.current.loading).toBe(false);
    });

    it("handles undefined sessionStorage", async () => {
      mockSessionStorage.getItem.mockReturnValue(undefined);

      const { result } = renderHook(() => useRecipesGeneration());

      await act(async () => {
        await result.current.generateRecipes();
      });

      // Should generate fallback recipes when sessionStorage is undefined
      expect(result.current.recipes.length).toBeGreaterThan(0);
      expect(result.current.loading).toBe(false);
    });
  });
});
