import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/services";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Usar el servicio de autenticación
    const result = await loginUser({ email, password });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: result.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
