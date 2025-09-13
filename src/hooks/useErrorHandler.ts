import { useCallback, useState } from "react";

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorMessage: string;
}

interface UseErrorHandlerReturn {
  errorState: ErrorState;
  handleError: (error: Error | string) => void;
  clearError: () => void;
  isError: (error: Error | string) => boolean;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorMessage: "",
  });

  const handleError = useCallback((error: Error | string) => {
    const errorObj = error instanceof Error ? error : new Error(error);
    
    console.error("Error handled:", errorObj);
    
    setErrorState({
      hasError: true,
      error: errorObj,
      errorMessage: errorObj.message,
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorMessage: "",
    });
  }, []);

  const isError = useCallback((error: Error | string) => {
    const errorObj = error instanceof Error ? error : new Error(error);
    return errorState.error?.message === errorObj.message;
  }, [errorState.error]);

  return {
    errorState,
    handleError,
    clearError,
    isError,
  };
};
