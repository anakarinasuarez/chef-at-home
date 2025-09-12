import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterData, LoginData, UserResponse, AuthResponse } from "@/types";

// Register a new user
export const registerUser = async (data: RegisterData): Promise<{
  success: boolean;
  user?: UserResponse;
  error?: string;
}> => {
  try {
    // Validaciones
    if (!data.name || !data.email || !data.password) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    if (data.password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email is already registered",
      };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Error in user registration:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Authenticate an existing user
export const loginUser = async (data: LoginData): Promise<{
  success: boolean;
  user?: UserResponse;
  error?: string;
}> => {
  try {
    // Validaciones
    if (!data.email || !data.password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error("Error in user login:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<{
  success: boolean;
  user?: UserResponse;
  error?: string;
}> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};