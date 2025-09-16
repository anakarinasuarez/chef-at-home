"use client";

import { useAppStore } from "@/stores/appStore";

/**
 * Hook unificado que proporciona la misma interfaz que AuthContext
 * pero usando Zustand store. Permite migración gradual sin romper funcionalidad.
 */
export const useAuthUnified = () => {
  const user = useAppStore((state) => state.user);
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.error);
  const login = useAppStore((state) => state.login);
  const register = useAppStore((state) => state.register);
  const logout = useAppStore((state) => state.logout);

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
