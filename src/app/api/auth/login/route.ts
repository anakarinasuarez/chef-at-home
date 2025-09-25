import { NextRequest, NextResponse } from "next/server";
import { authBackendService } from "@/services/authBackendService";
import { loginSchema, safeValidateSchema, getFirstZodError } from "@/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar los datos de entrada con Zod
    const validation = safeValidateSchema(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: getFirstZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data as {
      email: string;
      password: string;
    };

    // Usar el servicio de autenticación backend
    const result = await authBackendService.login({ email, password });

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
