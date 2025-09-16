import { useCallback, useState } from "react";
import { errorLogger } from "@/lib/errorLogger";

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorMessage: string;
  errorId?: string;
}

interface UseErrorHandlerOptions {
  componentName?: string;
  severity?: "low" | "medium" | "high" | "critical";
  logError?: boolean;
  context?: Record<string, any>;
}

interface UseErrorHandlerReturn {
  errorState: ErrorState;
  handleError: (
    error: Error | string,
    options?: UseErrorHandlerOptions
  ) => void;
  clearError: () => void;
  isError: (error: Error | string) => boolean;
  retry: () => void;
}

export const useErrorHandler = (
  defaultOptions?: UseErrorHandlerOptions
): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorMessage: "",
  });

  const handleError = useCallback(
    (error: Error | string, options?: UseErrorHandlerOptions) => {
      const errorObj = error instanceof Error ? error : new Error(error);
      const errorId = `error_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const mergedOptions = { ...defaultOptions, ...options };

      console.error("Error handled:", errorObj);

      setErrorState({
        hasError: true,
        error: errorObj,
        errorMessage: errorObj.message,
        errorId,
      });

      // Log error if enabled
      if (mergedOptions.logError !== false) {
        errorLogger.logError(
          {
            message: errorObj.message,
            stack: errorObj.stack,
            severity: mergedOptions.severity || "medium",
            userId: mergedOptions.context?.userId,
          },
          mergedOptions.componentName
        );

        // Track user action
        if (mergedOptions.componentName) {
          errorLogger.trackUserAction(
            `Error in ${mergedOptions.componentName}: ${errorObj.message}`
          );
        }
      }
    },
    [defaultOptions]
  );

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorMessage: "",
      errorId: undefined,
    });
  }, []);

  const isError = useCallback(
    (error: Error | string) => {
      const errorObj = error instanceof Error ? error : new Error(error);
      return errorState.error?.message === errorObj.message;
    },
    [errorState.error]
  );

  const retry = useCallback(() => {
    clearError();
    errorLogger.trackUserAction(
      `Retry requested for ${defaultOptions?.componentName || "component"}`
    );
  }, [clearError, defaultOptions?.componentName]);

  return {
    errorState,
    handleError,
    clearError,
    isError,
    retry,
  };
};
