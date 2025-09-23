import { vi } from "vitest";
import { setupDefaultMocks } from "./serviceMocks";

// Setup default mocks
const mocks = setupDefaultMocks();

// Export mocks for individual test configuration
export const {
  mockRegisterUser,
  mockLoginUser,
  mockGetUserById,
  mockCreateRecipe,
  mockGetPublicRecipes,
  mockGetUserRecipes,
  mockGetRecipeById,
  mockUpdateRecipe,
  mockDeleteRecipe,
  mockGenerateRecipe,
  mockGenerateMultipleRecipes,
  mockSaveRecipe,
  mockGetSavedRecipes,
  mockGenerateRecipeWithGemini,
  mockGenerateMultipleRecipesWithGemini,
  mockGenerateRecipeWithOpenAI,
  mockGenerateRecipeImageWithOpenAI,
  mockIsGeminiServiceAvailable,
  mockIsOpenAIServiceAvailable,
  mockIsOpenAIImageServiceAvailable,
} = mocks;

// Mock Unsplash service
export const mockUnsplashService = {
  getRandomFoodImage: vi.fn(),
  searchImages: vi.fn(),
  isAvailable: true,
};

// Mock additional functions
export const mockGetAvailableImageModels = vi.fn(() => [
  "dall-e-3",
  "dall-e-2",
]);

// Mock all services - but only if not already mocked in individual tests
if (
  !vi.isMockFunction(
    require("@/services/openaiImageService").generateRecipeImageWithOpenAI
  )
) {
  vi.mock("@/services/openaiImageService", () => ({
    generateRecipeImageWithOpenAI: mockGenerateRecipeImageWithOpenAI,
    isOpenAIImageServiceAvailable: mockIsOpenAIImageServiceAvailable,
    getAvailableImageModels: mockGetAvailableImageModels,
  }));
}

if (
  !vi.isMockFunction(
    require("@/services/openaiRecipeService").generateRecipeWithOpenAI
  )
) {
  vi.mock("@/services/openaiRecipeService", () => ({
    generateRecipeWithOpenAI: mockGenerateRecipeWithOpenAI,
    isOpenAIServiceAvailable: mockIsOpenAIServiceAvailable,
  }));
}

if (
  !vi.isMockFunction(
    require("@/services/geminiService").generateRecipeWithGemini
  )
) {
  vi.mock("@/services/geminiService", () => ({
    generateRecipeWithGemini: mockGenerateRecipeWithGemini,
    generateMultipleRecipesWithGemini: mockGenerateMultipleRecipesWithGemini,
    isGeminiServiceAvailable: mockIsGeminiServiceAvailable,
  }));
}

if (!vi.isMockFunction(require("@/services/recipeService").createRecipe)) {
  vi.mock("@/services/recipeService", () => ({
    createRecipe: mockCreateRecipe,
    getPublicRecipes: mockGetPublicRecipes,
    getUserRecipes: mockGetUserRecipes,
    getRecipeById: mockGetRecipeById,
    updateRecipe: mockUpdateRecipe,
    deleteRecipe: mockDeleteRecipe,
    generateRecipe: mockGenerateRecipe,
    generateMultipleRecipes: mockGenerateMultipleRecipes,
    saveRecipe: mockSaveRecipe,
    getSavedRecipes: mockGetSavedRecipes,
  }));
}

if (!vi.isMockFunction(require("@/services/authService").registerUser)) {
  vi.mock("@/services/authService", () => ({
    registerUser: mockRegisterUser,
    loginUser: mockLoginUser,
    getUserById: mockGetUserById,
  }));
}

// Mock React Icons
vi.mock("react-icons/bi", () => ({
  BiTime: ({ ...props }) => <div data-testid="bi-time" {...props} />,
  BiUser: ({ ...props }) => <div data-testid="bi-user" {...props} />,
  BiStar: ({ ...props }) => <div data-testid="bi-star" {...props} />,
  BiBookmark: ({ ...props }) => <div data-testid="bi-bookmark" {...props} />,
  BiShare: ({ ...props }) => <div data-testid="bi-share" {...props} />,
}));

vi.mock("react-icons/fa6", () => ({
  FaPencil: ({ ...props }) => <div data-testid="fa-pencil" {...props} />,
}));

vi.mock("react-icons/md", () => ({
  MdDelete: ({ ...props }) => <div data-testid="md-delete" {...props} />,
}));
