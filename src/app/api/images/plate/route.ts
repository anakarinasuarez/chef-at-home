import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    // Ruta absoluta a la imagen
    const imagePath = join(process.cwd(), "public", "images", "plate.png");

    // Leer la imagen como buffer
    const imageBuffer = readFileSync(imagePath);

    // Retornar la imagen con el tipo MIME correcto
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
