// Mock response objects for services
export const createSuccessResponse = <T>(data: T) => ({
  success: true,
  data,
  error: null,
});

export const createErrorResponse = (error: string) => ({
  success: false,
  data: null,
  error,
});

// Mock data
export const mockUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockRecipe = {
  id: "recipe-1",
  title: "Test Recipe",
  description: "A test recipe",
  ingredients: JSON.stringify([
    { name: "Ingredient 1", quantity: 1, unit: "cup" },
  ]),
  instructions: JSON.stringify(["Step 1", "Step 2"]),
  cookingTime: 30,
  servings: 4,
  imageUrl: "https://example.com/image.jpg",
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "user-1",
  user: mockUser,
};

export const mockGeneratedRecipe = {
  id: "generated-1",
  title: "Generated Recipe",
  description: "A generated recipe",
  ingredients: [{ name: "Ingredient 1", quantity: 1, unit: "cup" }],
  instructions: ["Step 1", "Step 2"],
  prepTime: "10 minutes",
  cookingTime: "20 minutes",
  totalTime: "30 minutes",
  servings: 4,
  cuisine: "international",
  image: "https://example.com/image.jpg",
  source: "gemini-fallback",
};

export const mockCustomRecipe = {
  title: "Custom Recipe",
  ingredients: [{ name: "Ingredient 1", quantity: 1, unit: "cup" }],
  instructions: ["Step 1", "Step 2"],
  prepTime: "10 minutes",
  totalTime: "35 minutes",
  servings: 4,
  cuisine: "international",
  image: "https://example.com/image.jpg",
  source: "template",
};
