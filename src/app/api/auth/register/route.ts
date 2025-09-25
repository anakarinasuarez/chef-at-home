import { NextRequest, NextResponse } from "next/server";
import { authBackendService } from "@/services/authBackendService";
import {
  registerSchema,
  safeValidateSchema,
  getFirstZodError,
} from "@/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar los datos de entrada con Zod
    const validation = safeValidateSchema(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: getFirstZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data as {
      name: string;
      email: string;
      password: string;
    };

    // Usar el servicio de autenticación backend
    const result = await authBackendService.register({ name, email, password });

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
