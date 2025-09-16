"use client";

import React, { ReactNode } from "react";
import { ErrorBoundaryAdvanced } from "./ErrorBoundaryAdvanced";
import { colors } from "@/design-system";
import { FiRefreshCw, FiAlertTriangle } from "react-icons/fi";

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showRetry?: boolean;
}

export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  componentName = "Component",
  fallback,
  onError,
  showRetry = true,
}) => {
  const defaultFallback = (
    <div
      className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed"
      style={{
        backgroundColor: colors.interface.background.secondary,
        borderColor: colors.interface.text.tertiary,
        minHeight: "200px",
      }}
    >
      <div className="text-center">
        <FiAlertTriangle
          className="text-4xl mx-auto mb-4"
          style={{ color: colors.interface.text.warning }}
        />

        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: colors.interface.text.primary }}
        >
          {componentName} Error
        </h3>

        <p
          className="text-sm mb-4"
          style={{ color: colors.interface.text.secondary }}
        >
          This component encountered an error and couldn't load properly.
        </p>

        {showRetry && (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: colors.brand.primary[500],
              color: colors.base.white,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.brand.primary[600];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.brand.primary[500];
            }}
          >
            <FiRefreshCw className="text-sm" />
            Retry
          </button>
        )}
      </div>
    </div>
  );

  return (
    <ErrorBoundaryAdvanced
      level="component"
      errorBoundaryName={`ComponentErrorBoundary-${componentName}`}
      fallback={fallback || defaultFallback}
      onError={onError}
      allowRetry={showRetry}
      showDetails={process.env.NODE_ENV === "development"}
    >
      {children}
    </ErrorBoundaryAdvanced>
  );
};

export default ComponentErrorBoundary;
