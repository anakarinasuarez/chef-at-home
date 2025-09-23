import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserResponse } from "@/types/auth";

export interface AuthState {
  // Estado
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      isLoading: false,
      error: null,

      // Acciones
      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      logout: () => set({ user: null, error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // Solo persistir el usuario
    }
  )
);

// Selectores para facilitar el uso
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    logout: state.logout,
  }));
