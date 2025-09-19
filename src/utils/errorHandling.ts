/**
 * Utilidades centralizadas para manejo de errores
 * Evita duplicación de lógica de manejo de errores
 */

export interface ErrorInfo {
  message: string;
  stack?: string;
  severity?: "low" | "medium" | "high" | "critical";
  userId?: string;
  componentName?: string;
  context?: Record<string, unknown>;
}

export class ErrorHandler {
  /**
   * Convierte cualquier tipo de error a un objeto Error estándar
   */
  static normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === "string") {
      return new Error(error);
    }

    if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if (errorObj.message && typeof errorObj.message === "string") {
        return new Error(errorObj.message);
      }
    }

    return new Error("Unknown error occurred");
  }

  /**
   * Genera un ID único para el error
   */
  static generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extrae información útil del error para logging
   */
  static extractErrorInfo(
    error: unknown,
    context?: Record<string, unknown>
  ): ErrorInfo {
    const normalizedError = this.normalizeError(error);

    return {
      message: normalizedError.message,
      stack: normalizedError.stack,
      severity: this.determineSeverity(normalizedError),
      context,
    };
  }

  /**
   * Determina la severidad del error basado en su tipo
   */
  private static determineSeverity(
    error: Error
  ): "low" | "medium" | "high" | "critical" {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "medium";
    }

    if (message.includes("unauthorized") || message.includes("forbidden")) {
      return "high";
    }

    if (message.includes("critical") || message.includes("fatal")) {
      return "critical";
    }

    return "low";
  }

  /**
   * Maneja errores de forma consistente con logging
   */
  static handleError(
    error: unknown,
    options: {
      componentName?: string;
      userId?: string;
      logToConsole?: boolean;
      context?: Record<string, unknown>;
    } = {}
  ): ErrorInfo {
    const errorInfo = this.extractErrorInfo(error, options.context);
    const errorId = this.generateErrorId();

    const fullErrorInfo: ErrorInfo = {
      ...errorInfo,
      componentName: options.componentName,
      userId: options.userId,
    };

    if (options.logToConsole !== false) {
      console.error(
        `[${errorId}] Error in ${options.componentName || "Unknown"}:`,
        error
      );
    }

    return fullErrorInfo;
  }

  /**
   * Verifica si un error es de un tipo específico
   */
  static isErrorType(error: unknown, type: string): boolean {
    const normalizedError = this.normalizeError(error);
    return normalizedError.message.toLowerCase().includes(type.toLowerCase());
  }

  /**
   * Retorna un mensaje de error amigable para el usuario
   */
  static getUserFriendlyMessage(error: unknown): string {
    const normalizedError = this.normalizeError(error);

    // Mensajes específicos para errores comunes
    if (this.isErrorType(error, "network")) {
      return "Network error. Please check your connection and try again.";
    }

    if (this.isErrorType(error, "unauthorized")) {
      return "Please log in to continue.";
    }

    if (this.isErrorType(error, "not found")) {
      return "The requested resource was not found.";
    }

    if (this.isErrorType(error, "quota") || this.isErrorType(error, "limit")) {
      return "Service limit reached. Please try again later.";
    }

    // Mensaje genérico para otros errores
    return "Something went wrong. Please try again.";
  }
}
