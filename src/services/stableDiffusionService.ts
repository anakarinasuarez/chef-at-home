import { colors } from "@/design-system";
import { stableDiffusionMockService } from "./stableDiffusionMockService";
import { openaiImageService } from "./openaiImageService";

export interface StableDiffusionRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
  sampler_name?: string;
  batch_size?: number;
}

export interface StableDiffusionResponse {
  images: string[];
  parameters: any;
  info: string;
}

export interface RecipeImageRequest {
  recipeName: string;
  ingredients: string[];
  cuisine?: string;
  style?: "photorealistic" | "artistic" | "minimalist" | "gourmet";
}

class StableDiffusionService {
  private baseUrl: string;
  private isAvailable: boolean = false;

  constructor() {
    // URL del servicio de Stable Diffusion
    this.baseUrl =
      process.env.NEXT_PUBLIC_STABLE_DIFFUSION_URL || "http://localhost:7861";
    this.checkAvailability();
  }

  /**
   * Verifica si el servicio de Stable Diffusion está disponible
   */
  private async checkAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sdapi/v1/sd-models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.isAvailable = response.ok;
    } catch (error) {
      console.warn("Stable Diffusion service not available:", error);
      this.isAvailable = false;
    }
  }

  /**
   * Genera una imagen para una receta usando Stable Diffusion
   */
  async generateRecipeImage(
    request: RecipeImageRequest
  ): Promise<string | null> {
    console.log(`🎨 Generating image for: ${request.recipeName}`);

    // Primero intentar con OpenAI DALL-E (mejor calidad)
    try {
      const openaiImage = await openaiImageService.generateRecipeImage(request);
      if (openaiImage) {
        console.log(
          `✅ OpenAI DALL-E image generated for: ${request.recipeName}`
        );
        return openaiImage;
      }
    } catch (error) {
      console.warn(`⚠️ OpenAI DALL-E failed for: ${request.recipeName}`, error);
    }

    // Si OpenAI no está disponible, usar imagen de fallback
    console.warn(
      `⚠️ OpenAI DALL-E not available for: ${request.recipeName}, using fallback`
    );

    // Si Replicate no está disponible, intentar con servicio local
    if (!this.isAvailable) {
      console.warn(
        "Stable Diffusion service not available, using mock service"
      );
      return stableDiffusionMockService.generateRecipeImage(request);
    }

    try {
      const prompt = this.buildPrompt(request);
      const negativePrompt = this.buildNegativePrompt();

      const sdRequest: StableDiffusionRequest = {
        prompt,
        negative_prompt: negativePrompt,
        width: 512,
        height: 512,
        steps: 20,
        cfg_scale: 7,
        sampler_name: "DPM++ 2M Karras",
        batch_size: 1,
      };

      const response = await fetch(`${this.baseUrl}/sdapi/v1/txt2img`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sdRequest),
      });

      if (!response.ok) {
        throw new Error(`Stable Diffusion API error: ${response.status}`);
      }

      const data: StableDiffusionResponse = await response.json();

      if (data.images && data.images.length > 0) {
        // Convertir base64 a URL de datos
        return `data:image/png;base64,${data.images[0]}`;
      }

      return null;
    } catch (error) {
      console.error("Error generating recipe image:", error);
      return this.getFallbackImage(request.recipeName);
    }
  }

  /**
   * Construye el prompt para Stable Diffusion basado en la receta
   */
  private buildPrompt(request: RecipeImageRequest): string {
    const {
      recipeName,
      ingredients,
      cuisine,
      style = "photorealistic",
    } = request;

    const mainIngredients = ingredients.slice(0, 3).join(", ");
    const cuisineText = cuisine ? `, ${cuisine} cuisine` : "";

    let stylePrompt = "";
    switch (style) {
      case "photorealistic":
        stylePrompt =
          "professional food photography, high resolution, detailed, appetizing";
        break;
      case "artistic":
        stylePrompt = "artistic food illustration, watercolor style, elegant";
        break;
      case "minimalist":
        stylePrompt = "minimalist food presentation, clean background, simple";
        break;
      case "gourmet":
        stylePrompt =
          "gourmet restaurant presentation, fine dining, elegant plating";
        break;
    }

    return `${recipeName} with ${mainIngredients}${cuisineText}, ${stylePrompt}, food photography, well-lit, appetizing, delicious looking`;
  }

  /**
   * Construye el negative prompt para evitar elementos no deseados
   */
  private buildNegativePrompt(): string {
    return "blurry, low quality, distorted, ugly, bad anatomy, bad proportions, deformed, disfigured, poorly drawn, amateur, unprofessional, dirty, messy, unappetizing, burnt, overcooked, undercooked";
  }

  /**
   * Obtiene una imagen de fallback cuando Stable Diffusion no está disponible
   */
  private getFallbackImage(recipeName: string): string {
    // Usar la imagen de plato existente como fallback
    return "/images/plate.png";
  }

  /**
   * Verifica si el servicio está disponible
   */
  async isServiceAvailable(): Promise<boolean> {
    await this.checkAvailability();
    return this.isAvailable;
  }

  /**
   * Obtiene información sobre los modelos disponibles
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sdapi/v1/sd-models`);
      if (response.ok) {
        const models = await response.json();
        return models.map((model: any) => model.title);
      }
      return [];
    } catch (error) {
      console.error("Error fetching models:", error);
      return [];
    }
  }
}

// Instancia singleton del servicio
export const stableDiffusionService = new StableDiffusionService();
