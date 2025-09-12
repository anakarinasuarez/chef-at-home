import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Usar el servicio de autenticación
    const result = await registerUser({ name, email, password });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "User successfully registered",
        user: result.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
