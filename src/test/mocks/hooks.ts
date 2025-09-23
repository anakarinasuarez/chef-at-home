import { vi } from "vitest";

// Mock data
const mockSavedRecipes = [
  {
    id: "recipe-1",
    title: "Test Recipe 1",
    servings: 4,
    cookingTime: "30 minutes",
    image: "https://example.com/image1.jpg",
    source: "test-source",
    ingredients: [
      { name: "Ingredient 1", quantity: 1, unit: "cup" },
      { name: "Ingredient 2", quantity: 2, unit: "tbsp" },
    ],
    instructions: ["Step 1", "Step 2"],
  },
  {
    id: "recipe-2",
    title: "Test Recipe 2",
    servings: 2,
    cookingTime: "20 minutes",
    image: "https://example.com/image2.jpg",
    source: "test-source",
    ingredients: [{ name: "Ingredient 3", quantity: 3, unit: "cups" }],
    instructions: ["Step 1"],
  },
];

// Mock useSavedRecipesTransition
export const mockUseSavedRecipesTransition = () => ({
  savedRecipes: mockSavedRecipes,
  loading: false,
  error: null,
  saveRecipe: vi.fn().mockResolvedValue(true),
  removeRecipe: vi.fn().mockResolvedValue(true),
  updateRecipe: vi.fn().mockResolvedValue(true),
  toggleSaveRecipe: vi.fn().mockResolvedValue(true),
  loadSavedRecipes: vi.fn(),
  clearError: vi.fn(),
});

// Mock useRecipesTransition
export const mockUseRecipesTransition = () => ({
  recipes: mockSavedRecipes,
  loading: false,
  error: null,
  hasLoadedRecipes: true,
  activeIndex: 0,
  removingRecipeId: null,
  generateRecipes: vi.fn().mockResolvedValue(true),
  scrollToRecipe: vi.fn(),
  setRemovingRecipeId: vi.fn(),
  clearError: vi.fn(),
});

// Mock useRecipesGenerationTransition
export const mockUseRecipesGenerationTransition = () => ({
  loading: false,
  error: null,
  generateRecipes: vi.fn().mockResolvedValue(true),
  useFallbackRecipes: vi.fn(),
  clearError: vi.fn(),
});

// Mock useErrorHandlerTransition
export const mockUseErrorHandlerTransition = () => ({
  error: null,
  setError: vi.fn(),
  clearError: vi.fn(),
  retryLastAction: vi.fn(),
  addErrorToHistory: vi.fn(),
});

// Mock useToastTransition
export const mockUseToastTransition = () => ({
  toasts: [],
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showWarning: vi.fn(),
  showInfo: vi.fn(),
  addToast: vi.fn(),
  removeToast: vi.fn(),
  clearToasts: vi.fn(),
  updateToast: vi.fn(),
  dismissToast: vi.fn(),
  getToastsByType: vi.fn().mockReturnValue([]),
});

// Mock useAuthUnified
export const mockUseAuthUnified = () => ({
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  },
  isLoading: false,
  error: null,
  login: vi.fn().mockResolvedValue(true),
  register: vi.fn().mockResolvedValue(true),
  logout: vi.fn().mockResolvedValue(true),
});

// Mock all hooks
vi.mock("@/hooks", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    // Transition hooks (Zustand)
    useSavedRecipesTransition: mockUseSavedRecipesTransition,
    useRecipesTransition: mockUseRecipesTransition,
    useRecipesGenerationTransition: mockUseRecipesGenerationTransition,
    useErrorHandlerTransition: mockUseErrorHandlerTransition,
    useToastTransition: mockUseToastTransition,

    // Unified auth hook
    useAuthUnified: mockUseAuthUnified,
  };
});
