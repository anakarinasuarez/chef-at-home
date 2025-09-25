import { UserResponse } from "@/types/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserResponse;
  error?: string;
}

/**
 * Servicio de autenticación para el backend (API routes)
 * Maneja la lógica de base de datos directamente sin fetch
 */
export class AuthBackendService {
  private static instance: AuthBackendService;

  private constructor() {}

  public static getInstance(): AuthBackendService {
    if (!AuthBackendService.instance) {
      AuthBackendService.instance = new AuthBackendService();
    }
    return AuthBackendService.instance;
  }

  /**
   * Realiza el login del usuario verificando credenciales en la base de datos
   */
  public async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const { email, password } = request;

      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      // Retornar usuario sin la contraseña
      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      return {
        success: true,
        user: userResponse,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  /**
   * Registra un nuevo usuario en la base de datos
   */
  public async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const { name, email, password } = request;

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        };
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Retornar usuario sin la contraseña
      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      return {
        success: true,
        user: userResponse,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  /**
   * Busca un usuario por ID
   */
  public async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("Get user by ID error:", error);
      return null;
    }
  }
}

// Exportar instancia singleton
export const authBackendService = AuthBackendService.getInstance();
