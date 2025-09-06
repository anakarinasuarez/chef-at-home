import { colors } from "@/design-system";

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

class StableDiffusionMockService {
  private isAvailable: boolean = true;

  /**
   * Simula la generación de imagen para una receta
   */
  async generateRecipeImage(
    request: RecipeImageRequest
  ): Promise<string | null> {
    // Simular delay de generación
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generar imagen mock basada en la receta
    const mockImage = this.generateMockImage(request);

    console.log(
      `🎨 Mock Stable Diffusion: Generated image for "${request.recipeName}"`
    );
    return mockImage;
  }

  /**
   * Genera una imagen mock usando CSS gradients
   */
  private generateMockImage(request: RecipeImageRequest): string {
    const { recipeName, ingredients, style = "photorealistic" } = request;

    // Crear un canvas con gradiente basado en los ingredientes
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    if (!ctx) return "/images/plate.png";

    // Gradiente basado en el estilo
    let gradient;
    switch (style) {
      case "photorealistic":
        gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, "#8B4513"); // Brown
        gradient.addColorStop(0.5, "#FF6347"); // Tomato
        gradient.addColorStop(1, "#32CD32"); // Green
        break;
      case "artistic":
        gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, "#FF69B4"); // Pink
        gradient.addColorStop(0.7, "#9370DB"); // Purple
        gradient.addColorStop(1, "#4169E1"); // Blue
        break;
      case "minimalist":
        gradient = ctx.createLinearGradient(0, 0, 512, 0);
        gradient.addColorStop(0, "#F5F5F5"); // Light gray
        gradient.addColorStop(1, "#E0E0E0"); // Darker gray
        break;
      case "gourmet":
        gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, "#2F4F4F"); // Dark slate
        gradient.addColorStop(0.5, "#8B4513"); // Brown
        gradient.addColorStop(1, "#000000"); // Black
        break;
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Agregar texto con el nombre de la receta
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(recipeName, 256, 256);

    // Agregar ingredientes
    ctx.font = "16px Arial";
    ingredients.slice(0, 3).forEach((ingredient, index) => {
      ctx.fillText(ingredient, 256, 300 + index * 25);
    });

    return canvas.toDataURL();
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
    return ["mock-model-v1", "mock-model-v2"];
  }
}

// Instancia singleton del servicio mock
export const stableDiffusionMockService = new StableDiffusionMockService();
