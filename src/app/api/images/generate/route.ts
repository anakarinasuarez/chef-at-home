import { NextRequest, NextResponse } from "next/server";
import { stableDiffusionService } from "@/services/stableDiffusionService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeName, ingredients, cuisine, style } = body;

    // Validar datos de entrada
    if (!recipeName || !ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "Missing required fields: recipeName and ingredients" },
        { status: 400 }
      );
    }

    // Generar imagen usando Stable Diffusion
    const imageData = await stableDiffusionService.generateRecipeImage({
      recipeName,
      ingredients,
      cuisine,
      style: style || "photorealistic",
    });

    if (!imageData) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: imageData,
      recipeName,
      ingredients,
    });
  } catch (error) {
    console.error("Error in image generation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verificar si el servicio está disponible
    const isAvailable = await stableDiffusionService.isServiceAvailable();
    const models = await stableDiffusionService.getAvailableModels();

    return NextResponse.json({
      serviceAvailable: isAvailable,
      models: models,
      message: isAvailable
        ? "Stable Diffusion service is running"
        : "Stable Diffusion service is not available",
    });
  } catch (error) {
    console.error("Error checking Stable Diffusion service:", error);
    return NextResponse.json(
      { error: "Failed to check service status" },
      { status: 500 }
    );
  }
}
