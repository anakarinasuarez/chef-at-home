import { NextRequest, NextResponse } from "next/server";
import { openaiImageService } from "@/services/openaiImageService";

export async function GET() {
  try {
    console.log("🧪 Testing OpenAI Image Service...");

    const isAvailable = await openaiImageService.isServiceAvailable();
    console.log("OpenAI Image Service Available:", isAvailable);

    if (!isAvailable) {
      return NextResponse.json({
        success: false,
        message: "OpenAI Image Service not available",
        available: false,
      });
    }

    // Test image generation
    const testRequest = {
      recipeName: "Test Recipe",
      ingredients: ["chicken", "rice"],
      cuisine: "asian",
      style: "photorealistic" as const,
    };

    console.log("🎨 Testing image generation...");
    const imageUrl = await openaiImageService.generateRecipeImage(testRequest);

    return NextResponse.json({
      success: true,
      message: "OpenAI Image Service working",
      available: true,
      testImage: imageUrl,
    });
  } catch (error) {
    console.error("Error testing OpenAI Image Service:", error);
    return NextResponse.json({
      success: false,
      message: "Error testing OpenAI Image Service",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
