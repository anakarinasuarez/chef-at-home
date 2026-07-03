import { getFirstZodError, safeValidateSchema } from '@/schemas';
import {
  generateMultipleRecipesWithGemini,
  generateRecipeWithGemini,
} from '@/services/geminiService';
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

vi.mock('@/services/openaiRecipeService', () => ({
  generateRecipeWithOpenAI: vi.fn(),
  isOpenAIServiceAvailable: vi.fn(),
}));

const mockSafeValidateSchema = vi.mocked(safeValidateSchema);
const mockGetFirstZodError = vi.mocked(getFirstZodError);
const mockGenerateMultipleRecipesWithGemini = vi.mocked(generateMultipleRecipesWithGemini);
const mockGenerateRecipeWithGemini = vi.mocked(generateRecipeWithGemini);
const mockGenerateRecipeWithOpenAI = vi.mocked(generateRecipeWithOpenAI);
const mockIsOpenAIServiceAvailable = vi.mocked(isOpenAIServiceAvailable);

describe('/api/recipes/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear global server cache
    (global as any).serverCache = new Map();
  });

  describe('POST', () => {
    it('should generate recipes successfully with Gemini (primary)', async () => {
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

      mockGenerateRecipeWithGemini.mockResolvedValue({
        id: '1',
        title: 'Chicken Risotto',
        ingredients: [{ name: 'chicken', quantity: '500g', unit: 'g' }],
        instructions: ['Cook chicken', 'Add rice'],
        servings: 4,
        cookingTime: '30 minutes',
      } as unknown as Awaited<ReturnType<typeof generateRecipeWithGemini>>);

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.recipes[0].title).toBe('Chicken Risotto');
      expect(responseData.source).toBe('gemini');
      // Images are free stock food photos (no paid DALL-E)
      expect(responseData.recipes[0].image).toContain('loremflickr.com');
    });

    it('should fall back to OpenAI when Gemini fails', async () => {
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

      mockGenerateRecipeWithGemini.mockRejectedValue(new Error('Gemini error'));
      mockIsOpenAIServiceAvailable.mockReturnValue(true);
      mockGenerateRecipeWithOpenAI.mockResolvedValue({
        recipes: [
          {
            id: '1',
            title: 'Chicken Risotto',
            ingredients: [{ name: 'chicken', quantity: '500g', unit: 'g' }],
            instructions: ['Cook chicken', 'Add rice'],
            servings: 4,
            cookingTime: '30 minutes',
          },
        ],
      } as unknown as Awaited<ReturnType<typeof generateRecipeWithOpenAI>>);

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.source).toBe('openai-fallback');
    });

    it('should use Gemini as the primary source', async () => {
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

      mockGenerateRecipeWithGemini.mockResolvedValue({
        id: '1',
        title: 'Chicken Risotto',
        ingredients: [{ name: 'chicken', quantity: '500g', unit: 'g' }],
        instructions: ['Cook chicken', 'Add rice'],
        servings: 4,
        cookingTime: '30 minutes',
      } as unknown as Awaited<ReturnType<typeof generateRecipeWithGemini>>);

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.source).toBe('gemini');
      expect(mockGenerateRecipeWithOpenAI).not.toHaveBeenCalled();
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
      } as unknown as ReturnType<typeof safeValidateSchema>);

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
          ingredients: [{ name: 'chicken', quantity: '500g', unit: 'g' }],
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

    it('returns recipes with a free stock image (no paid image gen)', async () => {
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

      mockGenerateRecipeWithGemini.mockResolvedValue({
        id: '1',
        title: 'Chicken Risotto',
        ingredients: [{ name: 'chicken', quantity: '500g', unit: 'g' }],
        instructions: ['Cook chicken', 'Add rice'],
        servings: 4,
        cookingTime: '30 minutes',
      } as unknown as Awaited<ReturnType<typeof generateRecipeWithGemini>>);

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.recipes).toHaveLength(1);
      expect(responseData.recipes[0].image).toContain('loremflickr.com');
      expect(responseData.recipes[0].imageSource).toBe('stock');
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
