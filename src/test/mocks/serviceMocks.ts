import { vi } from "vitest";
import {
  createSuccessResponse,
  createErrorResponse,
  mockUser,
  mockRecipe,
  mockGeneratedRecipe,
  mockCustomRecipe,
} from "./serviceResponses";

// Configure service mocks with proper responses
export const configureServiceMocks = () => {
  // Auth service mocks
  const mockRegisterUser = vi.fn();
  const mockLoginUser = vi.fn();
  const mockGetUserById = vi.fn();

  // Recipe service mocks
  const mockCreateRecipe = vi.fn();
  const mockGetPublicRecipes = vi.fn();
  const mockGetUserRecipes = vi.fn();
  const mockGetRecipeById = vi.fn();
  const mockUpdateRecipe = vi.fn();
  const mockDeleteRecipe = vi.fn();
  const mockGenerateRecipe = vi.fn();
  const mockGenerateMultipleRecipes = vi.fn();
  const mockSaveRecipe = vi.fn();
  const mockGetSavedRecipes = vi.fn();

  // AI service mocks
  const mockGenerateRecipeWithGemini = vi.fn();
  const mockGenerateMultipleRecipesWithGemini = vi.fn();
  const mockGenerateRecipeWithOpenAI = vi.fn();
  const mockGenerateRecipeImageWithOpenAI = vi.fn();

  // Service availability mocks
  const mockIsGeminiServiceAvailable = vi.fn(() => false);
  const mockIsOpenAIServiceAvailable = vi.fn(() => false);
  const mockIsOpenAIImageServiceAvailable = vi.fn(() => false);

  return {
    // Auth service
    mockRegisterUser,
    mockLoginUser,
    mockGetUserById,

    // Recipe service
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

    // AI services
    mockGenerateRecipeWithGemini,
    mockGenerateMultipleRecipesWithGemini,
    mockGenerateRecipeWithOpenAI,
    mockGenerateRecipeImageWithOpenAI,

    // Service availability
    mockIsGeminiServiceAvailable,
    mockIsOpenAIServiceAvailable,
    mockIsOpenAIImageServiceAvailable,
  };
};

// Default mock implementations
export const setupDefaultMocks = () => {
  const mocks = configureServiceMocks();

  // Auth service defaults
  mocks.mockRegisterUser.mockImplementation((data) => {
    if (!data || !data.name || !data.email || !data.password) {
      return Promise.resolve(createErrorResponse("All fields are required"));
    }
    if (data.password.length < 6) {
      return Promise.resolve(
        createErrorResponse("Password must be at least 6 characters")
      );
    }
    return Promise.resolve(createSuccessResponse(mockUser));
  });

  mocks.mockLoginUser.mockImplementation((data) => {
    if (!data || !data.email || !data.password) {
      return Promise.resolve(
        createErrorResponse("Email and password are required")
      );
    }
    return Promise.resolve(createSuccessResponse(mockUser));
  });

  mocks.mockGetUserById.mockImplementation((id) => {
    if (!id) {
      return Promise.resolve(createErrorResponse("User not found"));
    }
    return Promise.resolve(createSuccessResponse(mockUser));
  });

  // Recipe service defaults
  mocks.mockCreateRecipe.mockImplementation((data) => {
    if (
      !data ||
      !data.title ||
      !data.ingredients ||
      !data.instructions ||
      !data.userId
    ) {
      return Promise.resolve(
        createErrorResponse(
          "Title, ingredients, instructions and userId are required"
        )
      );
    }
    return Promise.resolve(createSuccessResponse(mockRecipe));
  });

  mocks.mockGetPublicRecipes.mockImplementation(() => {
    return Promise.resolve(createSuccessResponse([mockRecipe]));
  });

  mocks.mockGetUserRecipes.mockImplementation((userId) => {
    return Promise.resolve(createSuccessResponse([mockRecipe]));
  });

  mocks.mockGetRecipeById.mockImplementation((id) => {
    if (!id) {
      return Promise.resolve(createErrorResponse("Recipe not found"));
    }
    return Promise.resolve(createSuccessResponse(mockRecipe));
  });

  mocks.mockUpdateRecipe.mockImplementation((id, userId, data) => {
    if (!id) {
      return Promise.resolve(createErrorResponse("Recipe not found"));
    }
    return Promise.resolve(createSuccessResponse(mockRecipe));
  });

  mocks.mockDeleteRecipe.mockImplementation((id, userId) => {
    if (!id) {
      return Promise.resolve(createErrorResponse("Recipe not found"));
    }
    return Promise.resolve(createSuccessResponse(null));
  });

  mocks.mockGenerateRecipe.mockImplementation(() => {
    return Promise.resolve(mockGeneratedRecipe);
  });

  mocks.mockGenerateMultipleRecipes.mockImplementation(() => {
    return Promise.resolve([mockGeneratedRecipe, mockGeneratedRecipe]);
  });

  mocks.mockSaveRecipe.mockImplementation(() => {
    console.log("Saving recipe:", { userId: "user-1", recipe: mockRecipe });
    return Promise.resolve();
  });

  mocks.mockGetSavedRecipes.mockImplementation(() => {
    return Promise.resolve([]);
  });

  // AI service defaults
  mocks.mockGenerateRecipeWithGemini.mockImplementation(() => {
    if (!mocks.mockIsGeminiServiceAvailable()) {
      throw new Error("Gemini service not available");
    }
    return Promise.resolve(mockGeneratedRecipe);
  });

  mocks.mockGenerateMultipleRecipesWithGemini.mockImplementation(() => {
    if (!mocks.mockIsGeminiServiceAvailable()) {
      throw new Error("Gemini service not available");
    }
    return Promise.resolve([mockGeneratedRecipe, mockGeneratedRecipe]);
  });

  mocks.mockGenerateRecipeWithOpenAI.mockImplementation(() => {
    if (!mocks.mockIsOpenAIServiceAvailable()) {
      throw new Error("OpenAI Recipe service not available");
    }
    return Promise.resolve(mockGeneratedRecipe);
  });

  mocks.mockGenerateRecipeImageWithOpenAI.mockImplementation(() => {
    if (!mocks.mockIsOpenAIImageServiceAvailable()) {
      return Promise.resolve(null);
    }
    return Promise.resolve("https://example.com/generated-image.jpg");
  });

  return mocks;
};
