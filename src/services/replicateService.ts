import Replicate from "replicate";

export interface RecipeImageRequest {
  recipeName: string;
  ingredients: string[];
  cuisine?: string;
  style?: "photorealistic" | "artistic" | "minimalist" | "gourmet";
}

class ReplicateService {
  private replicate: Replicate;
  private isAvailable: boolean = false;

  constructor() {
    // Inicializar Replicate con API key
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (apiKey) {
      this.replicate = new Replicate({
        auth: apiKey,
      });
      this.isAvailable = true;
      console.log("✅ Replicate service initialized");
    } else {
      console.warn("⚠️ REPLICATE_API_TOKEN not found, service unavailable");
      this.isAvailable = false;
    }
  }

  /**
   * Genera una imagen para una receta usando Replicate
   */
  async generateRecipeImage(
    request: RecipeImageRequest
  ): Promise<string | null> {
    if (!this.isAvailable) {
      console.warn("Replicate service not available");
      return null;
    }

    try {
      const prompt = this.buildPrompt(request);

      console.log(
        `🎨 Generating image with Replicate for: ${request.recipeName}`
      );

      // Usar el modelo Stable Diffusion de Replicate
      const output = await this.replicate.run(
        "stability-ai/stable-diffusion:db21e45d3f7023abc2e46e38e239e076f13da4de2264b21ca946cae7686b2ea",
        {
          input: {
            prompt: prompt,
            width: 512,
            height: 512,
            num_inference_steps: 20,
            guidance_scale: 7.5,
            num_outputs: 1,
          },
        }
      );

      if (Array.isArray(output) && output.length > 0) {
        console.log(`✅ Replicate image generated for: ${request.recipeName}`);
        return output[0] as string;
      }

      return null;
    } catch (error) {
      console.error("Error generating image with Replicate:", error);
      return null;
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
          "professional food photography, high resolution, detailed, appetizing, restaurant quality";
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

    return `${recipeName} with ${mainIngredients}${cuisineText}, ${stylePrompt}, food photography, well-lit, delicious looking, high quality`;
  }

  /**
   * Verifica si el servicio está disponible
   */
  async isServiceAvailable(): Promise<boolean> {
    return this.isAvailable;
  }

  /**
   * Obtiene información sobre los modelos disponibles
   */
  async getAvailableModels(): Promise<string[]> {
    if (!this.isAvailable) return [];
    return ["stability-ai/stable-diffusion"];
  }
}

// Instancia singleton del servicio
export const replicateService = new ReplicateService();
