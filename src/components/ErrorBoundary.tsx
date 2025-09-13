"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { colors } from "@/design-system";
import Button from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorState {
  hasError: boolean;
  error?: Error;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
  onError,
}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
  });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("ErrorBoundary caught an error:", event.error);
      
      setErrorState({
        hasError: true,
        error: event.error,
      });

      if (onError) {
        onError(event.error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("ErrorBoundary caught an unhandled rejection:", event.reason);
      
      setErrorState({
        hasError: true,
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      });

      if (onError) {
        onError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [onError]);

  const handleReset = () => {
    setErrorState({ hasError: false, error: undefined });
  };

  if (errorState.hasError) {
    // Custom fallback UI
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default error UI
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😵</div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: colors.interface.text.primary }}
          >
            Oops! Something went wrong
          </h2>
          <p
            className="mb-6"
            style={{ color: colors.interface.text.secondary }}
          >
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleReset}
              variant="primary"
              className="px-6 py-3"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="px-6 py-3"
            >
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && errorState.error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                {errorState.error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
