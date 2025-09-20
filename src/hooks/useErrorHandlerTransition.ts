"use client";

import { useCallback } from "react";
import { useErrorStore, AppError } from "@/stores/errorStore";

interface UseErrorHandlerTransitionReturn {
  error: AppError | null;
  errors: AppError[];
  isRetrying: boolean;
  retryCount: number;
  
  handleError: (error: unknown, context?: string) => void;
  retry: () => void;
  dismissError: () => void;
  clearErrors: () => void;
  getErrorsBySeverity: (severity: AppError["severity"]) => AppError[];
  getRecentErrors: (limit?: number) => AppError[];
}

/**
 * Hook de transición que proporciona la misma interfaz que useErrorHandler
 * pero usando el nuevo errorStore de Zustand.
 *
 * Esto permite migración gradual sin romper la funcionalidad existente.
 */
export const useErrorHandlerTransition = (): UseErrorHandlerTransitionReturn => {
  // Obtener estado del store
  const currentError = useErrorStore((state) => state.currentError);
  const errors = useErrorStore((state) => state.errors);
  const isRetrying = useErrorStore((state) => state.isRetrying);
  const retryCount = useErrorStore((state) => state.retryCount);

  // Obtener acciones del store
  const handleErrorAction = useErrorStore((state) => state.handleError);
  const retryAction = useErrorStore((state) => state.retry);
  const dismissErrorAction = useErrorStore((state) => state.dismissError);
  const clearErrorsAction = useErrorStore((state) => state.clearErrors);
  const getErrorsBySeverityAction = useErrorStore((state) => state.getErrorsBySeverity);
  const getRecentErrorsAction = useErrorStore((state) => state.getRecentErrors);

  // Wrapper para handleError
  const handleError = useCallback(
    (error: unknown, context?: string) => {
      handleErrorAction(error, context);
    },
    [handleErrorAction]
  );

  // Wrapper para retry
  const retry = useCallback(() => {
    retryAction();
  }, [retryAction]);

  // Wrapper para dismissError
  const dismissError = useCallback(() => {
    dismissErrorAction();
  }, [dismissErrorAction]);

  // Wrapper para clearErrors
  const clearErrors = useCallback(() => {
    clearErrorsAction();
  }, [clearErrorsAction]);

  // Wrapper para getErrorsBySeverity
  const getErrorsBySeverity = useCallback(
    (severity: AppError["severity"]) => {
      return getErrorsBySeverityAction(severity);
    },
    [getErrorsBySeverityAction]
  );

  // Wrapper para getRecentErrors
  const getRecentErrors = useCallback(
    (limit?: number) => {
      return getRecentErrorsAction(limit);
    },
    [getRecentErrorsAction]
  );

  return {
    error: currentError,
    errors,
    isRetrying,
    retryCount,
    handleError,
    retry,
    dismissError,
    clearErrors,
    getErrorsBySeverity,
    getRecentErrors,
  };
};

export default useErrorHandlerTransition;
