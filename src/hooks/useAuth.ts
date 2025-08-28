"use client";

import { useState, useEffect } from "react";
import { UserResponse } from "@/types";

interface UseAuthReturn {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay un usuario logueado al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Aquí podrías verificar un token en localStorage o hacer una llamada a /api/auth/me
        const token = localStorage.getItem("auth-token");
        if (token) {
          // Verificar token con el backend
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            localStorage.removeItem("auth-token");
          }
        }
      } catch (err) {
        console.error("Error checking auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return false;
      }

      // Guardar token (cuando implementemos JWT)
      // localStorage.setItem('auth-token', data.token);

      setUser(data.user);
      return true;
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return false;
      }

      // No logueamos automáticamente después del registro
      // El usuario debe hacer login
      return true;
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
