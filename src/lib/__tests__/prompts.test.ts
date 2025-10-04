import { describe, expect, it } from 'vitest';
import {
  buildFallbackRecipePrompt,
  buildUnifiedImagePrompt,
  buildUnifiedRecipePrompt,
  getSystemPrompt,
  type ImagePromptParams,
  type RecipePromptParams,
} from '../prompts';

describe('Prompts', () => {
  describe('buildUnifiedRecipePrompt', () => {
    it('should build recipe prompt with basic parameters', () => {
      const params: RecipePromptParams = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
      };

      const result = buildUnifiedRecipePrompt(params);

      expect(result).toContain('chicken, rice');
      expect(result).toContain('4 people');
      expect(result).toContain('international');
      expect(result).toContain('JSON');
    });

    it('should build recipe prompt with custom cuisine', () => {
      const params: RecipePromptParams = {
        ingredients: ['pasta', 'tomato'],
        servings: 2,
        cuisine: 'italian',
      };

      const result = buildUnifiedRecipePrompt(params);

      expect(result).toContain('pasta, tomato');
      expect(result).toContain('2 people');
      expect(result).toContain('italian');
    });

    it('should include all required sections', () => {
      const params: RecipePromptParams = {
        ingredients: ['beef', 'potatoes'],
        servings: 6,
        cuisine: 'american',
      };

      const result = buildUnifiedRecipePrompt(params);

      expect(result).toContain('CORE REQUIREMENTS');
      expect(result).toContain('RECIPE STRUCTURE');
      expect(result).toContain('QUALITY STANDARDS');
      expect(result).toContain('Return ONLY valid JSON');
    });

    it('should format ingredients correctly', () => {
      const params: RecipePromptParams = {
        ingredients: ['onion', 'garlic', 'carrot'],
        servings: 3,
      };

      const result = buildUnifiedRecipePrompt(params);

      expect(result).toContain('onion, garlic, carrot');
    });

    it('should include JSON structure template', () => {
      const params: RecipePromptParams = {
        ingredients: ['fish'],
        servings: 1,
      };

      const result = buildUnifiedRecipePrompt(params);

      expect(result).toContain('"title":');
      expect(result).toContain('"description":');
      expect(result).toContain('"ingredients":');
      expect(result).toContain('"instructions":');
      expect(result).toContain('"cuisine":');
      expect(result).toContain('"servings":');
    });
  });

  describe('buildUnifiedImagePrompt', () => {
    it('should build image prompt with photorealistic style', () => {
      const params: ImagePromptParams = {
        recipeName: 'Chicken Curry',
        ingredients: ['chicken', 'coconut milk', 'spices'],
        cuisine: 'indian',
        style: 'photorealistic',
      };

      const result = buildUnifiedImagePrompt(params);

      expect(result).toContain('Chicken Curry');
      expect(result).toContain('chicken, coconut milk, spices');
      expect(result).toContain('indian cuisine');
      expect(result).toContain('ultra-realistic food photography');
    });

    it('should build image prompt with artistic style', () => {
      const params: ImagePromptParams = {
        recipeName: 'Pasta Carbonara',
        ingredients: ['pasta', 'eggs', 'cheese'],
        style: 'artistic',
      };

      const result = buildUnifiedImagePrompt(params);

      expect(result).toContain('Pasta Carbonara');
      expect(result).toContain('pasta, eggs, cheese');
      expect(result).toContain('artistic food illustration');
    });

    it('should build image prompt with minimalist style', () => {
      const params: ImagePromptParams = {
        recipeName: 'Salad',
        ingredients: ['lettuce', 'tomato'],
        style: 'minimalist',
      };

      const result = buildUnifiedImagePrompt(params);

      expect(result).toContain('minimalist food presentation');
      expect(result).toContain('clean neutral background');
    });

    it('should build image prompt with gourmet style', () => {
      const params: ImagePromptParams = {
        recipeName: 'Beef Wellington',
        ingredients: ['beef', 'puff pastry'],
        style: 'gourmet',
      };

      const result = buildUnifiedImagePrompt(params);

      expect(result).toContain('fine dining presentation');
      expect(result).toContain('luxury plating');
    });

    it('should use default photorealistic style when not specified', () => {
      const params: ImagePromptParams = {
        recipeName: 'Pizza',
        ingredients: ['dough', 'cheese', 'tomato'],
      };

      const result = buildUnifiedImagePrompt(params);

      expect(result).toContain('ultra-realistic food photography');
    });

    it('should handle missing cuisine gracefully', () => {
      const params: ImagePromptParams = {
        recipeName: 'Soup',
        ingredients: ['vegetables'],
      };

      const result = buildUnifiedImagePrompt(params);

      expect(result).not.toContain('undefined');
      expect(result).toContain('Soup');
    });

    it('should limit ingredients to first 3', () => {
      const params: ImagePromptParams = {
        recipeName: 'Stew',
        ingredients: ['beef', 'carrot', 'potato', 'onion', 'garlic'],
      };

      const result = buildUnifiedImagePrompt(params);

      expect(result).toContain('beef, carrot, potato');
      expect(result).not.toContain('onion');
      expect(result).not.toContain('garlic');
    });
  });

  describe('getSystemPrompt', () => {
    it('should return OpenAI system prompt', () => {
      const result = getSystemPrompt('openai');

      expect(result).toContain('world-class professional chef');
      expect(result).toContain('valid JSON format');
      expect(result).toContain('unique and creative');
    });

    it('should return Gemini system prompt', () => {
      const result = getSystemPrompt('gemini');

      expect(result).toContain('world-class professional chef');
      expect(result).toContain('valid JSON format');
      expect(result).toContain('authentic cultural cooking methods');
    });

    it('should return base prompt for unknown model', () => {
      const result = getSystemPrompt('unknown' as any);

      expect(result).toContain('world-class professional chef');
      expect(result).not.toContain('valid JSON format');
    });
  });

  describe('buildFallbackRecipePrompt', () => {
    it('should build fallback prompt with basic parameters', () => {
      const params: RecipePromptParams = {
        ingredients: ['chicken', 'rice'],
        servings: 4,
      };

      const result = buildFallbackRecipePrompt(params);

      expect(result).toContain('chicken, rice');
      expect(result).toContain('4 people');
      expect(result).toContain('international');
    });

    it('should build fallback prompt with custom cuisine', () => {
      const params: RecipePromptParams = {
        ingredients: ['pasta', 'tomato'],
        servings: 2,
        cuisine: 'italian',
      };

      const result = buildFallbackRecipePrompt(params);

      expect(result).toContain('pasta, tomato');
      expect(result).toContain('2 people');
      expect(result).toContain('italian');
    });

    it('should be simpler than unified prompt', () => {
      const params: RecipePromptParams = {
        ingredients: ['beef'],
        servings: 1,
      };

      const unifiedResult = buildUnifiedRecipePrompt(params);
      const fallbackResult = buildFallbackRecipePrompt(params);

      expect(fallbackResult.length).toBeLessThan(unifiedResult.length);
      expect(fallbackResult).not.toContain('CORE REQUIREMENTS');
      expect(fallbackResult).not.toContain('JSON');
    });
  });
});
