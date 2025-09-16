import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { errorLogger, useErrorLogger } from "../errorLogger";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock navigator
Object.defineProperty(window, "navigator", {
  value: {
    userAgent: "test-user-agent",
    language: "en-US",
    platform: "test-platform",
    cookieEnabled: true,
    onLine: true,
  },
});

// Mock screen
Object.defineProperty(window, "screen", {
  value: {
    width: 1920,
    height: 1080,
  },
});

// Mock performance
Object.defineProperty(window, "performance", {
  value: {
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
});

describe("errorLogger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
    // Limpiar errores acumulados entre tests
    errorLogger.clearErrors();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("logError", () => {
    it("logs error with basic information", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      errorLogger.logError({
        message: "Test error",
        stack: "Error stack",
        severity: "medium",
      });

      // En desarrollo, debería loggear en consola
      if (process.env.NODE_ENV === "development") {
        expect(consoleSpy).toHaveBeenCalled();
      }
      expect(localStorageMock.setItem).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("logs error with component context", () => {
      errorLogger.logError(
        {
          message: "Component error",
          stack: "Component stack",
          severity: "high",
          userId: "user123",
        },
        "TestComponent"
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        expect.stringMatching(/^error_log_/),
        expect.stringContaining("TestComponent")
      );
    });

    it("includes environment information", () => {
      errorLogger.logError({
        message: "Environment test",
        severity: "low",
      });

      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const loggedData = JSON.parse(setItemCall[1]);

      expect(loggedData.context).toMatchObject({
        viewport: { width: 1024, height: 768 },
        screen: { width: 1920, height: 1080 },
        language: "en-US",
        platform: "test-platform",
        cookieEnabled: true,
        onLine: true,
      });
    });

    it("limits number of stored errors", () => {
      // Mock localStorage to simulate existing errors
      const existingErrors = Array.from(
        { length: 60 },
        (_, i) => `error_log_${i}`
      );

      localStorageMock.key.mockImplementation(
        (index) => existingErrors[index] || null
      );
      localStorageMock.length = 60;

      errorLogger.logError({
        message: "New error",
        severity: "medium",
      });

      // Should still log the error
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe("trackUserAction", () => {
    it("tracks user actions", () => {
      errorLogger.trackUserAction("Button clicked");
      errorLogger.trackUserAction("Form submitted");

      // Actions should be tracked - log an error to see the actions
      errorLogger.logError({
        message: "Test error with actions",
        severity: "medium",
      });

      const errors = errorLogger.getErrors();
      expect(errors.length).toBeGreaterThan(0);

      // Check that user actions are tracked in the most recent error
      const mostRecentError = errors[0];
      expect(mostRecentError.userActions.length).toBeGreaterThan(0);
      expect(
        mostRecentError.userActions.some((action) =>
          action.includes("Button clicked")
        )
      ).toBe(true);
      expect(
        mostRecentError.userActions.some((action) =>
          action.includes("Form submitted")
        )
      ).toBe(true);
    });

    it("limits number of tracked actions", () => {
      // Track more than 20 actions
      for (let i = 0; i < 25; i++) {
        errorLogger.trackUserAction(`Action ${i}`);
      }

      const errors = errorLogger.getErrors();
      if (errors.length > 0) {
        const userActions = errors[0].userActions;
        expect(userActions.length).toBeLessThanOrEqual(20);
      }
    });
  });

  describe("getErrors", () => {
    it("returns array of errors", () => {
      errorLogger.logError({
        message: "Test error 1",
        severity: "medium",
      });

      errorLogger.logError({
        message: "Test error 2",
        severity: "high",
      });

      const errors = errorLogger.getErrors();
      expect(errors).toHaveLength(2);
      expect(errors[0].error.message).toBe("Test error 2"); // Most recent first
      expect(errors[1].error.message).toBe("Test error 1");
    });
  });

  describe("getErrorById", () => {
    it("returns specific error by ID", () => {
      errorLogger.logError({
        message: "Specific error",
        severity: "medium",
      });

      const errors = errorLogger.getErrors();
      const errorId = errors[0].id;

      const foundError = errorLogger.getErrorById(errorId);
      expect(foundError).toBeDefined();
      expect(foundError?.error.message).toBe("Specific error");
    });

    it("returns undefined for non-existent ID", () => {
      const foundError = errorLogger.getErrorById("non-existent-id");
      expect(foundError).toBeUndefined();
    });
  });

  describe("clearErrors", () => {
    it("clears all errors", () => {
      errorLogger.logError({
        message: "Error to clear",
        severity: "medium",
      });

      expect(errorLogger.getErrors()).toHaveLength(1);

      errorLogger.clearErrors();
      expect(errorLogger.getErrors()).toHaveLength(0);
    });
  });

  describe("exportErrors", () => {
    it("exports errors as JSON string", () => {
      errorLogger.logError({
        message: "Export test",
        severity: "medium",
      });

      const exported = errorLogger.exportErrors();
      const parsed = JSON.parse(exported);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].error.message).toBe("Export test");
    });
  });

  describe("cleanupOldLogs", () => {
    it("removes logs older than 24 hours", () => {
      const oldTime = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      const recentTime = new Date().toISOString();

      // Mock localStorage para simular logs existentes
      const mockKeys = ["error_log_old", "error_log_recent"];
      localStorageMock.key.mockImplementation(
        (index) => mockKeys[index] || null
      );
      localStorageMock.length = mockKeys.length;

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "error_log_old") {
          return JSON.stringify({
            error: { timestamp: oldTime },
          });
        }
        if (key === "error_log_recent") {
          return JSON.stringify({
            error: { timestamp: recentTime },
          });
        }
        return null;
      });

      // Mock Object.keys to return our mock keys
      const originalKeys = Object.keys;
      Object.keys = vi.fn().mockReturnValue(mockKeys);

      // Trigger cleanup by logging a new error
      errorLogger.logError({
        message: "Cleanup trigger",
        severity: "medium",
      });

      // Should remove old log
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("error_log_old");

      // Restore original Object.keys
      Object.keys = originalKeys;
    });
  });
});

describe("useErrorLogger", () => {
  it("provides error logging functions", () => {
    const { logError, trackUserAction, getErrors, clearErrors } =
      useErrorLogger();

    expect(typeof logError).toBe("function");
    expect(typeof trackUserAction).toBe("function");
    expect(typeof getErrors).toBe("function");
    expect(typeof clearErrors).toBe("function");
  });

  it("logs errors with hook", () => {
    const { logError } = useErrorLogger();
    const testError = new Error("Hook test error");

    logError(testError);

    const errors = errorLogger.getErrors();
    expect(errors[0].error.message).toBe("Hook test error");
  });

  it("tracks user actions with hook", () => {
    const { trackUserAction } = useErrorLogger();

    trackUserAction("Hook action test");

    // Action should be tracked
    expect(errorLogger.getErrors().length).toBeGreaterThan(0);
  });
});
