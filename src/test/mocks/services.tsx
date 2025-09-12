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

// Mock Recipe service
export const mockRecipeService = {
  generateRecipes: vi.fn(),
  getRecipeImage: vi.fn(),
  saveRecipe: vi.fn(),
  getSavedRecipes: vi.fn(),
  deleteRecipe: vi.fn(),
};

// Mock Auth service
export const mockAuthService = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
};

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
  default: mockRecipeService,
}));

vi.mock("@/services/authService", () => ({
  AuthService: mockAuthService,
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
