"use client";

import { useAuthStore } from "@/stores/authStore";

/**
 * Hook unificado que proporciona la misma interfaz que AuthContext
 * pero usando Zustand store. Permite migración gradual sin romper funcionalidad.
 */
export const useAuthUnified = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};

export default useAuthUnified;
