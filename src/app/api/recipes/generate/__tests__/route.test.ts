import { getFirstZodError, safeValidateSchema } from '@/schemas';
import {
  generateMultipleRecipesWithGemini,
  generateRecipeWithGemini,
} from '@/services/geminiService';
import { generateRecipeImageWithOpenAI } from '@/services/openaiImageService';
import { generateRecipeWithOpenAI, isOpenAIServiceAvailable } from '@/services/openaiRecipeService';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../route';

// Mock the dependencies
vi.mock('@/schemas', () => ({
  safeValidateSchema: vi.fn(),
  getFirstZodError: vi.fn(),
  generateRecipeRequestSchema: {},
}));

vi.mock('@/services/geminiService', () => ({
  generateMultipleRecipesWithGemini: vi.fn(),
  generateRecipeWithGemini: vi.fn(),
}));

vi.mock('@/services/openaiImageService', () => ({
  generateRecipeImageWithOpenAI: vi.fn(),
}));

vi.mock('@/services/openaiRecipeService', () => ({
  generateRecipeWithOpenAI: vi.fn(),
  isOpenAIServiceAvailable: vi.fn(),
}));

const mockSafeValidateSchema = vi.mocked(safeValidateSchema);
const mockGetFirstZodError = vi.mocked(getFirstZodError);
const mockGenerateMultipleRecipesWithGemini = vi.mocked(generateMultipleRecipesWithGemini);
const mockGenerateRecipeWithGemini = vi.mocked(generateRecipeWithGemini);
const mockGenerateRecipeImageWithOpenAI = vi.mocked(generateRecipeImageWithOpenAI);
const mockGenerateRecipeWithOpenAI = vi.mocked(generateRecipeWithOpenAI);
const mockIsOpenAIServiceAvailable = vi.mocked(isOpenAIServiceAvailable);

describe('/api/recipes/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear global server cache
    (global as any).serverCache = new Map();
  });

  describe('POST', () => {
    it('should generate recipes successfully with OpenAI', async () => {
      const requestBody = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
        cuisine: 'italian',
        count: 1,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      mockIsOpenAIServiceAvailable.mockReturnValue(true);
      mockGenerateRecipeWithOpenAI.mockResolvedValue({
        recipes: [
          {
            id: '1',
            title: 'Chicken Risotto',
            ingredients: [{ name: 'chicken', quantity: '500g' }],
            instructions: ['Cook chicken', 'Add rice'],
            servings: 4,
            cookingTime: '30 minutes',
          },
        ],
      });

      mockGenerateRecipeImageWithOpenAI.mockResolvedValue('https://example.com/image.jpg');

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.recipes[0].title).toBe('Chicken Risotto');
      expect(responseData.recipes[0].image).toBe('https://example.com/image.jpg');
      expect(responseData.source).toBe('openai-gpt4');
    });

    it('should fallback to Gemini when OpenAI fails', async () => {
      const requestBody = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
        cuisine: 'italian',
        count: 1,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      mockIsOpenAIServiceAvailable.mockReturnValue(true);
      mockGenerateRecipeWithOpenAI.mockRejectedValue(new Error('OpenAI error'));

      mockGenerateRecipeWithGemini.mockResolvedValue({
        id: '1',
        title: 'Chicken Risotto',
        ingredients: [{ name: 'chicken', quantity: '500g' }],
        instructions: ['Cook chicken', 'Add rice'],
        servings: 4,
        cookingTime: '30 minutes',
      });

      mockGenerateRecipeImageWithOpenAI.mockResolvedValue('https://example.com/image.jpg');

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.source).toBe('gemini-fallback');
    });

    it('should use Gemini when OpenAI is not available', async () => {
      const requestBody = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
        cuisine: 'italian',
        count: 1,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      mockIsOpenAIServiceAvailable.mockReturnValue(false);

      mockGenerateRecipeWithGemini.mockResolvedValue({
        id: '1',
        title: 'Chicken Risotto',
        ingredients: [{ name: 'chicken', quantity: '500g' }],
        instructions: ['Cook chicken', 'Add rice'],
        servings: 4,
        cookingTime: '30 minutes',
      });

      mockGenerateRecipeImageWithOpenAI.mockResolvedValue('https://example.com/image.jpg');

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.source).toBe('gemini-fallback');
    });

    it('should return validation error for invalid input', async () => {
      const requestBody = {
        ingredients: [],
        servings: 0,
        cuisine: 'invalid',
        count: -1,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Ingredients are required' }] },
      });

      mockGetFirstZodError.mockReturnValue('Ingredients are required');

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'Validation failed',
        details: 'Ingredients are required',
      });
    });

    it('should return cached recipes when available', async () => {
      const requestBody = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
        cuisine: 'italian',
        count: 1,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      // Set up cache
      const cacheKey = `recipes_chicken,rice_4`;
      const cachedRecipes = [
        {
          id: 'cached-1',
          title: 'Cached Chicken Risotto',
          ingredients: [{ name: 'chicken', quantity: '500g' }],
          instructions: ['Cook chicken', 'Add rice'],
          servings: 4,
          cookingTime: '30 minutes',
        },
      ];

      (global as any).serverCache = new Map();
      (global as any).serverCache.set(cacheKey, cachedRecipes);

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toEqual(cachedRecipes);
      expect(responseData.source).toBe('server-cache');
      expect(mockGenerateRecipeWithOpenAI).not.toHaveBeenCalled();
    });

    it('should handle image generation failure gracefully', async () => {
      const requestBody = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
        cuisine: 'italian',
        count: 1,
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      mockIsOpenAIServiceAvailable.mockReturnValue(true);
      mockGenerateRecipeWithOpenAI.mockResolvedValue({
        recipes: [
          {
            id: '1',
            title: 'Chicken Risotto',
            ingredients: [{ name: 'chicken', quantity: '500g' }],
            instructions: ['Cook chicken', 'Add rice'],
            servings: 4,
            cookingTime: '30 minutes',
          },
        ],
      });

      mockGenerateRecipeImageWithOpenAI.mockRejectedValue(new Error('Image generation failed'));

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.recipes[0].image).toBe('/images/plate.png');
      expect(responseData.recipes[0].imageSource).toBe('fallback');
    });

    it('should handle internal server error', async () => {
      const requestBody = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
        cuisine: 'italian',
        count: 1,
      };

      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Network error')),
      } as unknown as NextRequest;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200); // Should fallback to template generation
      expect(responseData.source).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalledWith('Error generating recipe:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
