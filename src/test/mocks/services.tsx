import { vi } from "vitest";

// Mock OpenAI service
export const mockOpenAIImageService = {
  generateRecipeImage: vi.fn(),
  isAvailable: true,
};

export const mockOpenAIRecipeService = {
  generateRecipes: vi.fn(),
  isAvailable: true,
};

// Mock Gemini service
export const mockGeminiService = {
  generateRecipes: vi.fn(),
  isAvailable: true,
};

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
  openaiImageService: mockOpenAIImageService,
}));

vi.mock("@/services/openaiRecipeService", () => ({
  openaiRecipeService: mockOpenAIRecipeService,
}));

vi.mock("@/services/geminiService", () => ({
  default: mockGeminiService,
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
