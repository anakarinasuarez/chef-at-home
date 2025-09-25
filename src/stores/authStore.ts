import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserResponse } from "@/types/auth";
import { authService } from "@/services/authService";

// Estado inicial estandarizado
const initialState = {
  user: null as UserResponse | null,
  isLoading: false,
  error: null as string | null,
};

export interface AuthState {
  // Estado
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;

  // Acciones básicas
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;

  // Acciones específicas de autenticación
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones básicas
      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      logout: () => {
        set({ user: null, error: null });
        authService.removeUserFromStorage();
      },

      // Login - Usa el servicio externo
      login: async (email: string, password: string): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });

          const result = await authService.login({ email, password });

          if (result.success && result.user) {
            set({ user: result.user, isLoading: false });
            authService.saveUserToStorage(result.user);
            return true;
          } else {
            set({ error: result.error || "Login failed", isLoading: false });
            return false;
          }
        } catch (error) {
          console.error("Login error:", error);
          set({ error: "An unexpected error occurred", isLoading: false });
          return false;
        }
      },

      // Register - Usa el servicio externo
      register: async (
        name: string,
        email: string,
        password: string
      ): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });

          const result = await authService.register({ name, email, password });

          if (result.success) {
            set({ isLoading: false });
            return true;
          } else {
            set({
              error: result.error || "Registration failed",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          console.error("Registration error:", error);
          set({ error: "An unexpected error occurred", isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // Solo persistir el usuario
    }
  )
);

// Selectores estandarizados para evitar renders innecesarios
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Selector de acciones
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    logout: state.logout,
    login: state.login,
    register: state.register,
  }));
