interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  errorBoundary?: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface ErrorReport {
  id: string;
  error: ErrorInfo;
  context: Record<string, any>;
  userActions: string[];
  environment: {
    nodeEnv: string;
    version: string;
    buildTime: string;
  };
}

class ErrorLogger {
  private errors: ErrorReport[] = [];
  private maxErrors = 50; // Límite de errores en memoria
  private sessionId: string;
  private userActions: string[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // Capturar errores globales
    window.addEventListener("error", (event) => {
      this.logError(
        {
          message: event.message,
          stack: event.error?.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          severity: "high",
        },
        "Global Error Handler"
      );
    });

    // Capturar promesas rechazadas
    window.addEventListener("unhandledrejection", (event) => {
      this.logError(
        {
          message: `Unhandled Promise Rejection: ${event.reason}`,
          stack: event.reason?.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          severity: "medium",
        },
        "Unhandled Promise Rejection"
      );
    });
  }

  logError(errorInfo: Partial<ErrorInfo>, errorBoundary?: string): void {
    const error: ErrorInfo = {
      message: errorInfo.message || "Unknown error",
      stack: errorInfo.stack,
      componentStack: errorInfo.componentStack,
      timestamp: errorInfo.timestamp || new Date().toISOString(),
      userAgent: errorInfo.userAgent || navigator.userAgent,
      url: errorInfo.url || window.location.href,
      userId: errorInfo.userId,
      sessionId: this.sessionId,
      errorBoundary,
      severity: errorInfo.severity || "medium",
    };

    const report: ErrorReport = {
      id: this.generateErrorId(),
      error,
      context: this.getContext(),
      userActions: [...this.userActions],
      environment: this.getEnvironment(),
    };

    // Agregar a la lista de errores
    this.errors.unshift(report);

    // Mantener solo los últimos errores
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log en consola para desarrollo
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 Error Logged");
      console.error("Error:", error.message);
      console.error("Stack:", error.stack);
      console.error("Context:", report.context);
      console.error("User Actions:", report.userActions);
      console.groupEnd();
    }

    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === "production") {
      this.sendToLoggingService(report);
    }

    // Guardar en localStorage para debugging
    this.saveToLocalStorage(report);
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getContext(): Record<string, any> {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: screen.width,
        height: screen.height,
      },
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      memory: (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          }
        : null,
    };
  }

  private getEnvironment(): ErrorReport["environment"] {
    return {
      nodeEnv: process.env.NODE_ENV || "unknown",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
    };
  }

  private async sendToLoggingService(report: ErrorReport): Promise<void> {
    try {
      // Aquí podrías enviar a servicios como Sentry, LogRocket, etc.
      // Por ahora, solo loggeamos en consola
      console.log("Sending error to logging service:", report);

      // Ejemplo de envío a API
      // await fetch('/api/logs/error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report),
      // });
    } catch (error) {
      console.error("Failed to send error to logging service:", error);
    }
  }

  private saveToLocalStorage(report: ErrorReport): void {
    try {
      const key = `error_log_${report.id}`;
      localStorage.setItem(key, JSON.stringify(report));

      // Limpiar logs antiguos (más de 24 horas)
      this.cleanupOldLogs();
    } catch (error) {
      console.error("Failed to save error to localStorage:", error);
    }
  }

  private cleanupOldLogs(): void {
    try {
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("error_log_")) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const report = JSON.parse(data);
              const errorTime = new Date(report.error.timestamp).getTime();

              if (errorTime < oneDayAgo) {
                localStorage.removeItem(key);
              }
            } catch (error) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error("Failed to cleanup old logs:", error);
    }
  }

  trackUserAction(action: string): void {
    this.userActions.push(`${new Date().toISOString()}: ${action}`);

    // Mantener solo las últimas 20 acciones
    if (this.userActions.length > 20) {
      this.userActions = this.userActions.slice(-20);
    }
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  getErrorById(id: string): ErrorReport | undefined {
    return this.errors.find((error) => error.id === id);
  }

  clearErrors(): void {
    this.errors = [];
  }

  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

// Hook para usar en componentes
export const useErrorLogger = () => {
  return {
    logError: (error: Error, context?: Record<string, any>) => {
      errorLogger.logError({
        message: error.message,
        stack: error.stack,
        severity: "medium",
        ...context,
      });
    },
    trackUserAction: (action: string) => {
      errorLogger.trackUserAction(action);
    },
    getErrors: () => errorLogger.getErrors(),
    clearErrors: () => errorLogger.clearErrors(),
  };
};
