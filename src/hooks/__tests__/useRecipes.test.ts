import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useRecipes } from "../useRecipes";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useErrorHandler
const mockHandleError = vi.fn();
const mockClearError = vi.fn();
vi.mock("../useErrorHandler", () => ({
  useErrorHandler: () => ({
    errorState: { errorMessage: null },
    handleError: mockHandleError,
    clearError: mockClearError,
  }),
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    search: "",
  },
  writable: true,
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock convertToUnifiedRecipe
vi.mock("@/types/recipe", () => ({
  convertToUnifiedRecipe: vi.fn((recipe) => recipe),
}));

describe("useRecipes", () => {
  const mockRecipes = [
    { id: "1", title: "Recipe 1", ingredients: ["ingredient1"] },
    { id: "2", title: "Recipe 2", ingredients: ["ingredient2"] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
    mockSessionStorage.setItem.mockImplementation(() => {});
    window.location.search = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("returns initial state", () => {
      const { result } = renderHook(() => useRecipes());

      expect(result.current.recipes).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.hasLoadedRecipes).toBe(false);
      expect(result.current.removingRecipeId).toBe(null);
      expect(result.current.activeIndex).toBe(0);
      expect(result.current.generateRecipes).toBeInstanceOf(Function);
      expect(result.current.removeRecipe).toBeInstanceOf(Function);
      expect(result.current.setActiveIndex).toBeInstanceOf(Function);
      expect(result.current.scrollToRecipe).toBeInstanceOf(Function);
      expect(result.current.clearError).toBeInstanceOf(Function);
    });
  });

  describe("Navigation", () => {
    it("sets active index", () => {
      const { result } = renderHook(() => useRecipes());

      act(() => {
        result.current.setActiveIndex(2);
      });

      expect(result.current.activeIndex).toBe(2);
    });

    it("scrolls to recipe", () => {
      const mockScrollIntoView = vi.fn();
      const mockElement = {
        scrollIntoView: mockScrollIntoView,
      };

      vi.spyOn(document, "getElementById").mockReturnValue(mockElement as any);

      const { result } = renderHook(() => useRecipes());

      act(() => {
        result.current.scrollToRecipe(1);
      });

      expect(document.getElementById).toHaveBeenCalledWith("recipe-1");
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "center",
      });
      expect(result.current.activeIndex).toBe(1);
    });

    it("handles scroll to non-existent recipe", () => {
      vi.spyOn(document, "getElementById").mockReturnValue(null);

      const { result } = renderHook(() => useRecipes());

      act(() => {
        result.current.scrollToRecipe(1);
      });

      expect(document.getElementById).toHaveBeenCalledWith("recipe-1");
      expect(result.current.activeIndex).toBe(0); // Should remain unchanged when element not found
    });
  });

  describe("Recipe Generation", () => {
    it("generates recipes successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recipes: mockRecipes }),
      });

      const { result } = renderHook(() => useRecipes());

      await act(async () => {
        await result.current.generateRecipes(["ingredient1"], 4);
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ["ingredient1"],
          servings: 4,
          count: 4,
        }),
      });

      expect(result.current.recipes).toEqual(mockRecipes);
      expect(result.current.hasLoadedRecipes).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        "currentRecipes",
        JSON.stringify(mockRecipes)
      );
    });

    it("handles generation errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => useRecipes());

      await act(async () => {
        await result.current.generateRecipes(["ingredient1"], 4);
      });

      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
      expect(result.current.loading).toBe(false);
    });

    it("handles empty recipes response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recipes: [] }),
      });

      const { result } = renderHook(() => useRecipes());

      await act(async () => {
        await result.current.generateRecipes(["ingredient1"], 4);
      });

      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
      expect(result.current.loading).toBe(false);
    });

    it("handles network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useRecipes());

      await act(async () => {
        await result.current.generateRecipes(["ingredient1"], 4);
      });

      expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
      expect(result.current.loading).toBe(false);
    });
  });

  describe("Recipe Removal", () => {
    it("removes recipe successfully", async () => {
      const { result } = renderHook(() => useRecipes());

      act(() => {
        result.current.removeRecipe("1");
      });

      expect(result.current.removingRecipeId).toBe("1");

      // Wait for the timeout to complete
      await waitFor(
        () => {
          expect(result.current.removingRecipeId).toBe(null);
        },
        { timeout: 1000 }
      );

      expect(mockSessionStorage.setItem).toHaveBeenCalled();
    });

    it("handles removal of non-existent recipe", async () => {
      const { result } = renderHook(() => useRecipes());

      act(() => {
        result.current.removeRecipe("non-existent");
      });

      expect(result.current.removingRecipeId).toBe("non-existent");

      await waitFor(
        () => {
          expect(result.current.removingRecipeId).toBe(null);
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Error Handling", () => {
    it("clears errors", () => {
      const { result } = renderHook(() => useRecipes());

      act(() => {
        result.current.clearError();
      });

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid state changes", () => {
      const { result } = renderHook(() => useRecipes());

      act(() => {
        result.current.setActiveIndex(1);
        result.current.setActiveIndex(2);
        result.current.setActiveIndex(0);
      });

      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe("Performance", () => {
    it("maintains function references across re-renders", () => {
      const { result, rerender } = renderHook(() => useRecipes());

      const initialGenerateRecipes = result.current.generateRecipes;
      const initialRemoveRecipe = result.current.removeRecipe;
      const initialScrollToRecipe = result.current.scrollToRecipe;

      rerender();

      expect(result.current.generateRecipes).toBe(initialGenerateRecipes);
      expect(result.current.removeRecipe).toBe(initialRemoveRecipe);
      expect(result.current.scrollToRecipe).toBe(initialScrollToRecipe);
    });
  });
});
