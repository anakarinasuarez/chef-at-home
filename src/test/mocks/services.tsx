import { vi } from "vitest";

// Mock OpenAI service functions
export const mockGenerateRecipeImageWithOpenAI = vi.fn();
export const mockIsOpenAIImageServiceAvailable = vi.fn(() => true);
export const mockGetAvailableImageModels = vi.fn(() => ["dall-e-3", "dall-e-2"]);

export const mockGenerateRecipeWithOpenAI = vi.fn();
export const mockIsOpenAIServiceAvailable = vi.fn(() => true);

// Mock Gemini service functions
export const mockGenerateRecipeWithGemini = vi.fn();
export const mockGenerateMultipleRecipesWithGemini = vi.fn();
export const mockIsGeminiServiceAvailable = vi.fn(() => true);

// Mock Unsplash service
export const mockUnsplashService = {
  getRandomFoodImage: vi.fn(),
  searchImages: vi.fn(),
  isAvailable: true,
};

// Mock Recipe service functions
export const mockCreateRecipe = vi.fn();
export const mockGetPublicRecipes = vi.fn();
export const mockGetUserRecipes = vi.fn();
export const mockGetRecipeById = vi.fn();
export const mockUpdateRecipe = vi.fn();
export const mockDeleteRecipe = vi.fn();
export const mockGenerateRecipe = vi.fn();
export const mockGenerateMultipleRecipes = vi.fn();
export const mockSaveRecipe = vi.fn();
export const mockGetSavedRecipes = vi.fn();

// Mock Auth service functions
export const mockRegisterUser = vi.fn();
export const mockLoginUser = vi.fn();
export const mockGetUserById = vi.fn();

// Mock all services
vi.mock("@/services/openaiImageService", () => ({
  generateRecipeImageWithOpenAI: mockGenerateRecipeImageWithOpenAI,
  isOpenAIImageServiceAvailable: mockIsOpenAIImageServiceAvailable,
  getAvailableImageModels: mockGetAvailableImageModels,
}));

vi.mock("@/services/openaiRecipeService", () => ({
  generateRecipeWithOpenAI: mockGenerateRecipeWithOpenAI,
  isOpenAIServiceAvailable: mockIsOpenAIServiceAvailable,
}));

vi.mock("@/services/geminiService", () => ({
  generateRecipeWithGemini: mockGenerateRecipeWithGemini,
  generateMultipleRecipesWithGemini: mockGenerateMultipleRecipesWithGemini,
  isGeminiServiceAvailable: mockIsGeminiServiceAvailable,
}));

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

vi.mock("@/services/authService", () => ({
  registerUser: mockRegisterUser,
  loginUser: mockLoginUser,
  getUserById: mockGetUserById,
}));

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
