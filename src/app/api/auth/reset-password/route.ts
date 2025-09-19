import { NextRequest, NextResponse } from "next/server";
import {
  resetPasswordWithTokenSchema,
  safeValidateSchema,
  getFirstZodError,
} from "@/schemas";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar los datos de entrada con Zod
    const validation = safeValidateSchema(resetPasswordWithTokenSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: getFirstZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { token, password } = validation.data as {
      token: string;
      password: string;
    };

    // Buscar el usuario por token de reset
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Actualizar la contraseña y limpiar el token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message:
          "Password has been reset successfully. You can now log in with your new password.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
