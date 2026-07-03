import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createRecipe,
  getPublicRecipes,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  generateRecipe,
  generateMultipleRecipes,
  saveRecipe,
  getSavedRecipes,
} from "../recipeService";
import { prisma } from "@/lib/prisma";
import {
  isOpenAIServiceAvailable,
  generateRecipeWithOpenAI,
} from "../openaiRecipeService";
import {
  generateRecipeWithGemini,
  generateMultipleRecipesWithGemini,
} from "../geminiService";
import { generateRecipeImageWithOpenAI } from "../openaiImageService";
import type { Recipe as PrismaRecipe, User as PrismaUser } from "@prisma/client";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    recipe: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock external services
vi.mock("../geminiService", () => ({
  generateRecipeWithGemini: vi.fn(),
  generateMultipleRecipesWithGemini: vi.fn(),
}));

vi.mock("../openaiRecipeService", () => ({
  generateRecipeWithOpenAI: vi.fn(),
  isOpenAIServiceAvailable: vi.fn(),
}));

vi.mock("../openaiImageService", () => ({
  generateRecipeImageWithOpenAI: vi.fn(),
  isOpenAIImageServiceAvailable: vi.fn(),
}));

describe("recipeService", () => {
  const mockUser: PrismaUser = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    password: "hashedPassword",
    resetToken: null,
    resetTokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRecipe: PrismaRecipe & {
    user: { id: string; name: string; email: string };
  } = {
    id: "recipe-1",
    title: "Test Recipe",
    description: "A test recipe",
    ingredients: JSON.stringify(["ingredient1", "ingredient2"]),
    instructions: JSON.stringify(["step1", "step2"]),
    cookingTime: 30,
    difficulty: null,
    servings: 4,
    imageUrl: "https://example.com/image.jpg",
    isPublic: true,
    userId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createRecipe", () => {
    const createRecipeData = {
      title: "Test Recipe",
      description: "A test recipe",
      ingredients: JSON.stringify(["ingredient1", "ingredient2"]),
      instructions: JSON.stringify(["step1", "step2"]),
      cookingTime: 30,
      servings: 4,
      imageUrl: "https://example.com/image.jpg",
      isPublic: true,
      userId: "user-1",
    };

    it("creates recipe successfully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.recipe.create).mockResolvedValue(mockRecipe);

      const result = await createRecipe(createRecipeData);

      expect(result.success).toBe(true);
      expect(result.recipe).toBeDefined();
      expect(result.error).toBeUndefined();
      expect(vi.mocked(prisma).user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
      });
      expect(vi.mocked(prisma).recipe.create).toHaveBeenCalledWith({
        data: createRecipeData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    it("returns error when required fields are missing", async () => {
      const incompleteData = {
        title: "Test Recipe",
        // Missing ingredients, instructions, userId
      } as any;

      const result = await createRecipe(incompleteData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Title, ingredients, instructions and userId are required"
      );
      expect(vi.mocked(prisma).user.findUnique).not.toHaveBeenCalled();
    });

    it("returns error when user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await createRecipe(createRecipeData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
      expect(vi.mocked(prisma).recipe.create).not.toHaveBeenCalled();
    });

    it("handles database errors", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.recipe.create).mockRejectedValue(
        new Error("Database error")
      );

      const result = await createRecipe(createRecipeData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });
  });

  describe("getPublicRecipes", () => {
    it("returns public recipes successfully", async () => {
      const mockRecipes = [mockRecipe];
      vi.mocked(prisma.recipe.findMany).mockResolvedValue(mockRecipes);

      const result = await getPublicRecipes();

      expect(result.success).toBe(true);
      expect(result.recipes).toHaveLength(1);
      expect(result.error).toBeUndefined();
      expect(vi.mocked(prisma).recipe.findMany).toHaveBeenCalledWith({
        where: { isPublic: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("handles database errors", async () => {
      vi.mocked(prisma.recipe.findMany).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getPublicRecipes();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });
  });

  describe("getUserRecipes", () => {
    it("returns user recipes successfully", async () => {
      const mockRecipes = [mockRecipe];
      vi.mocked(prisma.recipe.findMany).mockResolvedValue(mockRecipes);

      const result = await getUserRecipes("user-1");

      expect(result.success).toBe(true);
      expect(result.recipes).toHaveLength(1);
      expect(result.error).toBeUndefined();
      expect(vi.mocked(prisma).recipe.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("handles database errors", async () => {
      vi.mocked(prisma.recipe.findMany).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getUserRecipes("user-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });
  });

  describe("getRecipeById", () => {
    it("returns recipe by ID successfully", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);

      const result = await getRecipeById("recipe-1");

      expect(result.success).toBe(true);
      expect(result.recipe).toBeDefined();
      expect(result.error).toBeUndefined();
      expect(vi.mocked(prisma).recipe.findUnique).toHaveBeenCalledWith({
        where: { id: "recipe-1" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    it("returns error when recipe not found", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(null);

      const result = await getRecipeById("nonexistent");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Recipe not found");
    });

    it("handles database errors", async () => {
      vi.mocked(prisma.recipe.findUnique).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getRecipeById("recipe-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });
  });

  describe("updateRecipe", () => {
    const updateData = {
      title: "Updated Recipe",
      description: "Updated description",
    };

    it("updates recipe successfully", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);
      vi.mocked(prisma.recipe.update).mockResolvedValue({
        ...mockRecipe,
        ...updateData,
      });

      const result = await updateRecipe("recipe-1", "user-1", updateData);

      expect(result.success).toBe(true);
      expect(result.recipe).toBeDefined();
      expect(result.error).toBeUndefined();
      expect(vi.mocked(prisma).recipe.update).toHaveBeenCalledWith({
        where: { id: "recipe-1" },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    it("returns error when recipe not found", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(null);

      const result = await updateRecipe("nonexistent", "user-1", updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Recipe not found");
    });

    it("returns error when user is not authorized", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue({
        ...mockRecipe,
        userId: "different-user",
      });

      const result = await updateRecipe("recipe-1", "user-1", updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized to update this recipe");
    });

    it("handles database errors", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);
      vi.mocked(prisma.recipe.update).mockRejectedValue(
        new Error("Database error")
      );

      const result = await updateRecipe("recipe-1", "user-1", updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });
  });

  describe("deleteRecipe", () => {
    it("deletes recipe successfully", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);
      vi.mocked(prisma.recipe.delete).mockResolvedValue(mockRecipe);

      const result = await deleteRecipe("recipe-1", "user-1");

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(vi.mocked(prisma).recipe.delete).toHaveBeenCalledWith({
        where: { id: "recipe-1" },
      });
    });

    it("returns error when recipe not found", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(null);

      const result = await deleteRecipe("nonexistent", "user-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Recipe not found");
    });

    it("returns error when user is not authorized", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue({
        ...mockRecipe,
        userId: "different-user",
      });

      const result = await deleteRecipe("recipe-1", "user-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized to delete this recipe");
    });

    it("handles database errors", async () => {
      vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);
      vi.mocked(prisma.recipe.delete).mockRejectedValue(
        new Error("Database error")
      );

      const result = await deleteRecipe("recipe-1", "user-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });
  });

  describe("generateRecipe", () => {
    const mockOpenAI = {
      generateRecipeWithOpenAI: vi.fn(),
      isOpenAIServiceAvailable: vi.fn(),
    };
    const mockGemini = {
      generateRecipeWithGemini: vi.fn(),
    };
    const mockImage = {
      generateRecipeImageWithOpenAI: vi.fn(),
    };

    beforeEach(() => {
      vi.mocked(isOpenAIServiceAvailable).mockReturnValue(false);
      vi.mocked(generateRecipeWithGemini).mockResolvedValue({
        title: "Generated Recipe",
        description: "A generated recipe",
        ingredients: [{ name: "ingredient1", quantity: "1", unit: "piece" }],
        instructions: ["step1", "step2"],
        prepTime: "10 minutes",
        cookingTime: "30 minutes",
        totalTime: "40 minutes",
        cuisine: "international",
        servings: 4,
        source: "gemini",
      });
      vi.mocked(generateRecipeImageWithOpenAI).mockResolvedValue(
        "https://example.com/image.jpg"
      );
    });

    it("generates recipe with Gemini fallback", async () => {
      const result = (await generateRecipe(
        ["ingredient1"],
        4,
        "international"
      ))!;

      expect(result.title).toBe("Generated Recipe");
      expect(result.source).toBe("gemini-fallback");
      expect(result.image).toBe("https://example.com/image.jpg");
    });

    it("generates recipe with OpenAI when available", async () => {
      vi.mocked(isOpenAIServiceAvailable).mockReturnValue(true);
      vi.mocked(generateRecipeWithOpenAI).mockResolvedValue({
        recipes: [
          {
            title: "OpenAI Recipe",
            description: "An OpenAI recipe",
            ingredients: [
              { name: "ingredient1", quantity: "1", unit: "piece" },
            ],
            instructions: ["step1", "step2"],
            cookingTime: "30 minutes",
            cuisine: "international",
            servings: 4,
          },
        ],
        count: 1,
        source: "openai-gpt4",
      });

      const result = (await generateRecipe(
        ["ingredient1"],
        4,
        "international"
      ))!;

      expect(result.title).toBe("OpenAI Recipe");
      expect(result.source).toBe("openai-gpt4");
    });

    it("falls back to custom recipe on error", async () => {
      vi.mocked(generateRecipeWithGemini).mockRejectedValue(
        new Error("API error")
      );

      const result = (await generateRecipe(
        ["ingredient1"],
        4,
        "international"
      ))!;

      expect(result.title).toContain("Special");
      expect(result.source).toBe("fallback-template");
    });
  });

  describe("generateMultipleRecipes", () => {
    beforeEach(() => {
      vi.mocked(isOpenAIServiceAvailable).mockReturnValue(false);
      vi.mocked(generateMultipleRecipesWithGemini).mockResolvedValue([
        {
          title: "Recipe 1",
          description: "Recipe 1 description",
          ingredients: [{ name: "ingredient1", quantity: "1", unit: "piece" }],
          instructions: ["step1"],
          prepTime: "10 minutes",
          cookingTime: "30 minutes",
          totalTime: "40 minutes",
          cuisine: "international",
          servings: 4,
          source: "gemini",
        },
        {
          title: "Recipe 2",
          description: "Recipe 2 description",
          ingredients: [{ name: "ingredient1", quantity: "1", unit: "piece" }],
          instructions: ["step1"],
          prepTime: "10 minutes",
          cookingTime: "30 minutes",
          totalTime: "40 minutes",
          cuisine: "international",
          servings: 4,
          source: "gemini",
        },
      ]);
      vi.mocked(generateRecipeImageWithOpenAI).mockResolvedValue(
        "https://example.com/image.jpg"
      );
    });

    it("generates multiple recipes with Gemini", async () => {
      const result = await generateMultipleRecipes(["ingredient1"], 4, 2);

      expect(result).toHaveLength(2);
      expect(result[0].source).toBe("gemini-fallback");
      expect(result[1].source).toBe("gemini-fallback");
    });

    it("generates multiple recipes with OpenAI when available", async () => {
      vi.mocked(isOpenAIServiceAvailable).mockReturnValue(true);
      vi.mocked(generateRecipeWithOpenAI).mockResolvedValue({
        recipes: [
          {
            title: "OpenAI Recipe 1",
            description: "OpenAI Recipe 1 description",
            ingredients: [
              { name: "ingredient1", quantity: "1", unit: "piece" },
            ],
            instructions: ["step1"],
            cookingTime: "30 minutes",
            cuisine: "international",
            servings: 4,
          },
          {
            title: "OpenAI Recipe 2",
            description: "OpenAI Recipe 2 description",
            ingredients: [
              { name: "ingredient1", quantity: "1", unit: "piece" },
            ],
            instructions: ["step1"],
            cookingTime: "30 minutes",
            cuisine: "international",
            servings: 4,
          },
        ],
        count: 2,
        source: "openai-gpt4",
      });

      const result = await generateMultipleRecipes(["ingredient1"], 4, 2);

      expect(result).toHaveLength(2);
      expect(result[0].source).toBe("openai-gpt4");
      expect(result[1].source).toBe("openai-gpt4");
    });

    it("falls back to custom recipes on error", async () => {
      vi.mocked(generateMultipleRecipesWithGemini).mockRejectedValue(
        new Error("API error")
      );

      const result = await generateMultipleRecipes(["ingredient1"], 4, 2);

      expect(result).toHaveLength(2);
      expect(result[0].source).toBe("fallback-template");
      expect(result[1].source).toBe("fallback-template");
    });
  });

  describe("saveRecipe", () => {
    const mockRecipeToSave = {
      id: "recipe-1",
      title: "Test Recipe",
      ingredients: ["ingredient1"],
      instructions: ["step1"],
      servings: 4,
      duration: 30,
      imageUrl: "https://example.com/image.jpg",
    };

    it("saves recipe successfully", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await saveRecipe("user-1", mockRecipeToSave);

      expect(consoleSpy).toHaveBeenCalledWith("Saving recipe:", {
        userId: "user-1",
        recipe: mockRecipeToSave,
      });

      consoleSpy.mockRestore();
    });

    it("handles save errors", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        throw new Error("Save error");
      });

      await expect(saveRecipe("user-1", mockRecipeToSave)).rejects.toThrow(
        "Failed to save recipe"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getSavedRecipes", () => {
    it("returns empty array (not implemented)", async () => {
      const result = await getSavedRecipes("user-1");

      expect(result).toEqual([]);
    });

    it("returns empty array consistently", async () => {
      const result1 = await getSavedRecipes("user-1");
      const result2 = await getSavedRecipes("user-2");

      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
    });
  });
});
