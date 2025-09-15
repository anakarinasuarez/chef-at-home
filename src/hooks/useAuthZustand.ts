import { useCallback } from "react";
import {
  useAppStore,
  useUser,
  useIsLoading,
  useError,
  useAppActions,
} from "@/stores/appStore";

// Types matching the existing AuthContext
interface UserResponse {
  id: string;
  name: string;
  email: string;
}

interface UseAuthReturn {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthZustand = (): UseAuthReturn => {
  const user = useUser();
  const isLoading = useIsLoading();
  const error = useError();
  const { setUser, setLoading, setError } = useAppActions();

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true);
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

        // Guardar usuario en estado y localStorage (manteniendo compatibilidad)
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return true;
      } catch (error) {
        setError("An unexpected error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true);
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

        // Guardar usuario en estado y localStorage (manteniendo compatibilidad)
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return true;
      } catch (error) {
        setError("An unexpected error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, [setUser]);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
