"use client";

import React, { Component, ReactNode, ErrorInfo } from "react";
import { colors, typography } from "@/design-system";
import Button from "./Button";
import { errorLogger } from "@/lib/errorLogger";

interface ErrorBoundaryAdvancedProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  errorBoundaryName?: string;
  level?: "page" | "component" | "critical";
  showDetails?: boolean;
  allowRetry?: boolean;
}

interface ErrorBoundaryAdvancedState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  retryCount: number;
}

export class ErrorBoundaryAdvanced extends Component<
  ErrorBoundaryAdvancedProps,
  ErrorBoundaryAdvancedState
> {
  private maxRetries = 3;

  constructor(props: ErrorBoundaryAdvancedProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ErrorBoundaryAdvancedState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = this.generateErrorId();

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log error con contexto completo
    errorLogger.logError(
      {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        severity: this.getSeverityLevel(),
        userId: this.getCurrentUserId(),
      },
      this.props.errorBoundaryName || "ErrorBoundaryAdvanced"
    );

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Track user action
    errorLogger.trackUserAction(
      `Error occurred in ${this.props.errorBoundaryName || "Unknown Component"}`
    );
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSeverityLevel(): "low" | "medium" | "high" | "critical" {
    switch (this.props.level) {
      case "critical":
        return "critical";
      case "page":
        return "high";
      case "component":
        return "medium";
      default:
        return "medium";
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch (error) {
      // Ignore parsing errors
    }
    return undefined;
  }

  private handleRetry = (): void => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        errorId: undefined,
        retryCount: prevState.retryCount + 1,
      }));

      errorLogger.trackUserAction(
        `Retry attempt ${this.state.retryCount + 1} for ${
          this.props.errorBoundaryName || "Unknown Component"
        }`
      );
    }
  };

  private handleReload = (): void => {
    errorLogger.trackUserAction("Page reload requested due to error");
    window.location.reload();
  };

  private handleReportError = (): void => {
    if (this.state.errorId) {
      const errorReport = errorLogger.getErrorById(this.state.errorId);
      if (errorReport) {
        // Aquí podrías enviar el reporte por email, API, etc.
        const errorData = {
          errorId: this.state.errorId,
          error: this.state.error?.message,
          stack: this.state.error?.stack,
          componentStack: this.state.errorInfo?.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        console.log("Error Report:", errorData);

        // Ejemplo de envío por email
        const subject = encodeURIComponent(
          `Error Report - ${this.state.errorId}`
        );
        const body = encodeURIComponent(JSON.stringify(errorData, null, 2));
        const mailtoLink = `mailto:support@chefathome.com?subject=${subject}&body=${body}`;

        window.open(mailtoLink);
      }
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI basado en el nivel
      return this.renderErrorUI();
    }

    return this.props.children;
  }

  private renderErrorUI(): ReactNode {
    const {
      level = "component",
      showDetails = false,
      allowRetry = true,
    } = this.props;
    const { error, errorId, retryCount } = this.state;

    const isCritical = level === "critical";
    const canRetry = allowRetry && retryCount < this.maxRetries;

    return (
      <div
        className={`flex items-center justify-center p-4 ${
          isCritical ? "min-h-screen" : "min-h-96"
        }`}
        style={{ backgroundColor: colors.interface.background.primary }}
      >
        <div className="text-center max-w-lg">
          {/* Error Icon */}
          <div className="text-6xl mb-4">{isCritical ? "💥" : "⚠️"}</div>

          {/* Error Title */}
          <h2
            className="text-2xl font-bold mb-4"
            style={{
              color: colors.interface.text.primary,
              fontSize: typography.styles["title-2"].fontSize,
              fontWeight: typography.styles["title-2"].fontWeight,
            }}
          >
            {isCritical ? "Critical Error" : "Something went wrong"}
          </h2>

          {/* Error Message */}
          <p
            className="mb-6"
            style={{
              color: colors.interface.text.secondary,
              fontSize: typography.styles["body"].fontSize,
            }}
          >
            {isCritical
              ? "A critical error occurred. Please refresh the page or contact support."
              : "We encountered an unexpected error. You can try again or refresh the page."}
          </p>

          {/* Error ID */}
          {errorId && (
            <p
              className="mb-4 text-xs"
              style={{ color: colors.interface.text.tertiary }}
            >
              Error ID: {errorId}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            {canRetry && (
              <Button
                onClick={this.handleRetry}
                variant="primary"
                className="px-6 py-3"
              >
                Try Again ({this.maxRetries - retryCount} left)
              </Button>
            )}

            <Button
              onClick={this.handleReload}
              variant="secondary"
              className="px-6 py-3"
            >
              Refresh Page
            </Button>

            <Button
              onClick={this.handleReportError}
              variant="secondary"
              className="px-6 py-3"
            >
              Report Error
            </Button>
          </div>

          {/* Error Details (Development or when showDetails is true) */}
          {(process.env.NODE_ENV === "development" || showDetails) && error && (
            <details className="mt-6 text-left">
              <summary
                className="cursor-pointer text-sm font-medium mb-2"
                style={{ color: colors.interface.text.secondary }}
              >
                Error Details
              </summary>
              <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-64">
                <div className="mb-2">
                  <strong>Message:</strong>
                  <pre className="text-xs mt-1">{error.message}</pre>
                </div>
                {error.stack && (
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="text-xs mt-1 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="text-xs mt-1 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Help Text */}
          <p
            className="text-xs mt-4"
            style={{ color: colors.interface.text.tertiary }}
          >
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundaryAdvanced;
