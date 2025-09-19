import { NextRequest, NextResponse } from "next/server";
import {
  resetPasswordSchema,
  safeValidateSchema,
  getFirstZodError,
} from "@/schemas";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar los datos de entrada con Zod
    const validation = safeValidateSchema(resetPasswordSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: getFirstZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { email } = validation.data as { email: string };

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Siempre devolver éxito para evitar email enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, we've sent a password reset link.",
          success: true,
        },
        { status: 200 }
      );
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar el token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // En un entorno de producción, aquí enviarías un email real
    // Por ahora, solo logueamos el token para desarrollo
    console.log(`🔐 Password reset token for ${email}: ${resetToken}`);
    console.log(
      `🔗 Reset URL: ${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/auth/reset-password?token=${resetToken}`
    );

    // TODO: Enviar email real con el token
    // await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, we've sent a password reset link.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
