"use client";

import { useCallback } from "react";
import { useToastStore, Toast } from "@/stores/toastStore";

interface UseToastTransitionReturn {
  toasts: Toast[];
  
  showSuccess: (message: string, options?: Partial<Toast>) => void;
  showError: (message: string, options?: Partial<Toast>) => void;
  showWarning: (message: string, options?: Partial<Toast>) => void;
  showInfo: (message: string, options?: Partial<Toast>) => void;
  
  addToast: (toast: Omit<Toast, "id" | "timestamp">) => void;
  removeToast: (toastId: string) => void;
  clearToasts: () => void;
  updateToast: (toastId: string, updates: Partial<Toast>) => void;
  dismissToast: (toastId: string) => void;
  getToastsByType: (type: Toast["type"]) => Toast[];
}

/**
 * Hook de transición que proporciona la misma interfaz que useToast
 * pero usando el nuevo toastStore de Zustand.
 *
 * Esto permite migración gradual sin romper la funcionalidad existente.
 */
export const useToastTransition = (): UseToastTransitionReturn => {
  // Obtener estado del store
  const toasts = useToastStore((state) => state.toasts);

  // Obtener acciones del store
  const showSuccessAction = useToastStore((state) => state.showSuccess);
  const showErrorAction = useToastStore((state) => state.showError);
  const showWarningAction = useToastStore((state) => state.showWarning);
  const showInfoAction = useToastStore((state) => state.showInfo);
  const addToastAction = useToastStore((state) => state.addToast);
  const removeToastAction = useToastStore((state) => state.removeToast);
  const clearToastsAction = useToastStore((state) => state.clearToasts);
  const updateToastAction = useToastStore((state) => state.updateToast);
  const dismissToastAction = useToastStore((state) => state.dismissToast);
  const getToastsByTypeAction = useToastStore((state) => state.getToastsByType);

  // Wrappers para las acciones
  const showSuccess = useCallback(
    (message: string, options?: Partial<Toast>) => {
      showSuccessAction(message, options);
    },
    [showSuccessAction]
  );

  const showError = useCallback(
    (message: string, options?: Partial<Toast>) => {
      showErrorAction(message, options);
    },
    [showErrorAction]
  );

  const showWarning = useCallback(
    (message: string, options?: Partial<Toast>) => {
      showWarningAction(message, options);
    },
    [showWarningAction]
  );

  const showInfo = useCallback(
    (message: string, options?: Partial<Toast>) => {
      showInfoAction(message, options);
    },
    [showInfoAction]
  );

  const addToast = useCallback(
    (toast: Omit<Toast, "id" | "timestamp">) => {
      addToastAction(toast);
    },
    [addToastAction]
  );

  const removeToast = useCallback(
    (toastId: string) => {
      removeToastAction(toastId);
    },
    [removeToastAction]
  );

  const clearToasts = useCallback(() => {
    clearToastsAction();
  }, [clearToastsAction]);

  const updateToast = useCallback(
    (toastId: string, updates: Partial<Toast>) => {
      updateToastAction(toastId, updates);
    },
    [updateToastAction]
  );

  const dismissToast = useCallback(
    (toastId: string) => {
      dismissToastAction(toastId);
    },
    [dismissToastAction]
  );

  const getToastsByType = useCallback(
    (type: Toast["type"]) => {
      return getToastsByTypeAction(type);
    },
    [getToastsByTypeAction]
  );

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    addToast,
    removeToast,
    clearToasts,
    updateToast,
    dismissToast,
    getToastsByType,
  };
};

export default useToastTransition;
