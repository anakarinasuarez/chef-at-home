import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppError {
  id: string;
  message: string;
  code?: string;
  details?: unknown;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  context?: string;
  userId?: string;
  stack?: string;
}

// Estado inicial estandarizado
const initialState = {
  errors: [] as AppError[],
  currentError: null as AppError | null,
  isRetrying: false,
  retryCount: 0,
  maxRetries: 3,
};

export interface ErrorState {
  // Estado
  errors: AppError[];
  currentError: AppError | null;
  isRetrying: boolean;
  retryCount: number;
  maxRetries: number;

  // Acciones básicas
  addError: (error: Omit<AppError, "id" | "timestamp">) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
  setCurrentError: (error: AppError | null) => void;
  setRetrying: (isRetrying: boolean) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;

  // Acciones específicas
  handleError: (error: unknown, context?: string) => void;
  retry: () => void;
  dismissError: () => void;
  getErrorsBySeverity: (severity: AppError["severity"]) => AppError[];
  getRecentErrors: (limit?: number) => AppError[];
}

export const useErrorStore = create<ErrorState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones básicas
      addError: (errorData) => {
        const error: AppError = {
          ...errorData,
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        set((state) => ({
          errors: [...state.errors, error],
          currentError: error,
        }));

        // Auto-dismiss low severity errors after 5 seconds
        if (error.severity === "low") {
          setTimeout(() => {
            get().removeError(error.id);
          }, 5000);
        }
      },

      removeError: (errorId) => {
        set((state) => ({
          errors: state.errors.filter((error) => error.id !== errorId),
          currentError:
            state.currentError?.id === errorId ? null : state.currentError,
        }));
      },

      clearErrors: () => {
        set({
          errors: [],
          currentError: null,
          retryCount: 0,
          isRetrying: false,
        });
      },

      setCurrentError: (error) => {
        set({ currentError: error });
      },

      setRetrying: (isRetrying) => {
        set({ isRetrying });
      },

      incrementRetryCount: () => {
        set((state) => ({
          retryCount: state.retryCount + 1,
        }));
      },

      resetRetryCount: () => {
        set({ retryCount: 0 });
      },

      // Acciones específicas
      handleError: (error: unknown, context?: string) => {
        console.error("Error handled by store:", error);

        let errorMessage = "An unexpected error occurred";
        let errorCode = "UNKNOWN_ERROR";
        let severity: AppError["severity"] = "medium";
        let details: unknown = undefined;

        if (error instanceof Error) {
          errorMessage = error.message;
          errorCode = error.name;
          details = {
            stack: error.stack,
            name: error.name,
          };
        } else if (typeof error === "string") {
          errorMessage = error;
          errorCode = "STRING_ERROR";
        } else if (typeof error === "object" && error !== null) {
          const errorObj = error as Record<string, unknown>;
          errorMessage = (errorObj.message as string) || "Unknown error";
          errorCode = (errorObj.code as string) || "OBJECT_ERROR";
          details = errorObj;
        }

        // Determine severity based on error type
        if (errorCode.includes("NETWORK") || errorCode.includes("FETCH")) {
          severity = "high";
        } else if (
          errorCode.includes("AUTH") ||
          errorCode.includes("PERMISSION")
        ) {
          severity = "critical";
        } else if (errorCode.includes("VALIDATION")) {
          severity = "low";
        }

        get().addError({
          message: errorMessage,
          code: errorCode,
          details,
          severity,
          context,
        });
      },

      retry: () => {
        const state = get();

        if (state.retryCount >= state.maxRetries) {
          get().addError({
            message: "Maximum retry attempts reached",
            code: "MAX_RETRIES_EXCEEDED",
            severity: "critical",
            context: "ErrorStore.retry",
          });
          return;
        }

        set({ isRetrying: true });
        get().incrementRetryCount();

        // Simulate retry delay
        setTimeout(() => {
          set({ isRetrying: false });
        }, 1000);
      },

      dismissError: () => {
        const { currentError } = get();
        if (currentError) {
          get().removeError(currentError.id);
        }
      },

      getErrorsBySeverity: (severity) => {
        return get().errors.filter((error) => error.severity === severity);
      },

      getRecentErrors: (limit = 10) => {
        return get()
          .errors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit);
      },
    }),
    {
      name: "error-storage",
      partialize: (state) => ({
        errors: state.errors.slice(-50), // Solo persistir los últimos 50 errores
        maxRetries: state.maxRetries,
      }),
    }
  )
);

// Selectores para facilitar el uso
export const useErrors = () => useErrorStore((state) => state.errors);
export const useCurrentError = () =>
  useErrorStore((state) => state.currentError);
export const useIsRetrying = () => useErrorStore((state) => state.isRetrying);
export const useRetryCount = () => useErrorStore((state) => state.retryCount);
export const useErrorActions = () =>
  useErrorStore((state) => ({
    addError: state.addError,
    removeError: state.removeError,
    clearErrors: state.clearErrors,
    setCurrentError: state.setCurrentError,
    setRetrying: state.setRetrying,
    incrementRetryCount: state.incrementRetryCount,
    resetRetryCount: state.resetRetryCount,
    handleError: state.handleError,
    retry: state.retry,
    dismissError: state.dismissError,
    getErrorsBySeverity: state.getErrorsBySeverity,
    getRecentErrors: state.getRecentErrors,
  }));
