import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  try {
    console.log("🧪 Testing OpenAI Simple...");

    const apiKey = process.env.OPENAI_API_KEY;
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey?.length);

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: "No API key found",
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log("🎨 Testing simple image generation...");

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A simple red apple on a white background",
      size: "1024x1024",
      quality: "hd",
      n: 1,
    });

    console.log("📊 Response:", JSON.stringify(response, null, 2));

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;
      return NextResponse.json({
        success: true,
        message: "Image generated successfully",
        imageUrl: imageUrl,
      });
    }

    return NextResponse.json({
      success: false,
      message: "No image data in response",
      response: response,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      success: false,
      message: "Error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
