"use client";

import {
  useUser,
  useIsLoading,
  useError,
  useAuthActions,
} from "@/stores/appStore";

/**
 * Hook unificado que proporciona la misma interfaz que AuthContext
 * pero usando Zustand store. Permite migración gradual sin romper funcionalidad.
 */
export const useAuthUnified = () => {
  const user = useUser();
  const isLoading = useIsLoading();
  const error = useError();
  const { login, register, logout } = useAuthActions();

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
