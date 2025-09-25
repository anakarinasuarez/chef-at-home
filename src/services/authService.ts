import { UserResponse } from "@/types/auth";

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
 * Servicio para manejar la autenticación de usuarios
 * Maneja toda la lógica de negocio relacionada con login, registro y logout
 */
export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Realiza el login del usuario
   */
  public async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Login failed",
        };
      }

      return {
        success: true,
        user: data.user,
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
   * Registra un nuevo usuario
   */
  public async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Registration failed",
        };
      }

      return {
        success: true,
        user: data.user,
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
   * Guarda el usuario en localStorage
   */
  public saveUserToStorage(user: UserResponse): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  /**
   * Recupera el usuario desde localStorage
   */
  public getUserFromStorage(): UserResponse | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  }

  /**
   * Elimina el usuario del localStorage
   */
  public removeUserFromStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }

  /**
   * Verifica si hay un usuario guardado
   */
  public hasStoredUser(): boolean {
    return this.getUserFromStorage() !== null;
  }
}

// Exportar instancia singleton
export const authService = AuthService.getInstance();

// Funciones de conveniencia para compatibilidad con el código existente
export const loginUser = async (
  request: LoginRequest
): Promise<AuthResponse> => {
  return authService.login(request);
};

export const registerUser = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  return authService.register(request);
};
