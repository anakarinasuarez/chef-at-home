import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useErrorHandler } from "../useErrorHandler";

describe("useErrorHandler", () => {
  let consoleSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("Initial State", () => {
    it("returns initial error state", () => {
      const { result } = renderHook(() => useErrorHandler());

      expect(result.current.errorState).toEqual({
        hasError: false,
        error: null,
        errorMessage: "",
      });
      expect(result.current.handleError).toBeInstanceOf(Function);
      expect(result.current.clearError).toBeInstanceOf(Function);
      expect(result.current.isError).toBeInstanceOf(Function);
    });
  });

  describe("Error Handling", () => {
    it("handles Error objects", () => {
      const { result } = renderHook(() => useErrorHandler());
      const testError = new Error("Test error message");

      act(() => {
        result.current.handleError(testError);
      });

      expect(result.current.errorState).toEqual({
        hasError: true,
        error: testError,
        errorMessage: "Test error message",
      });
      expect(consoleSpy).toHaveBeenCalledWith("Error handled:", testError);
    });

    it("handles string errors", () => {
      const { result } = renderHook(() => useErrorHandler());
      const errorMessage = "String error message";

      act(() => {
        result.current.handleError(errorMessage);
      });

      expect(result.current.errorState.hasError).toBe(true);
      expect(result.current.errorState.error).toBeInstanceOf(Error);
      expect(result.current.errorState.errorMessage).toBe(errorMessage);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error handled:",
        expect.any(Error)
      );
    });

    it("handles multiple errors", () => {
      const { result } = renderHook(() => useErrorHandler());
      const error1 = new Error("First error");
      const error2 = new Error("Second error");

      act(() => {
        result.current.handleError(error1);
      });

      expect(result.current.errorState.errorMessage).toBe("First error");

      act(() => {
        result.current.handleError(error2);
      });

      expect(result.current.errorState.errorMessage).toBe("Second error");
      expect(result.current.errorState.error).toBe(error2);
    });
  });

  describe("Error Clearing", () => {
    it("clears error state", () => {
      const { result } = renderHook(() => useErrorHandler());
      const testError = new Error("Test error");

      // First, set an error
      act(() => {
        result.current.handleError(testError);
      });

      expect(result.current.errorState.hasError).toBe(true);

      // Then clear it
      act(() => {
        result.current.clearError();
      });

      expect(result.current.errorState).toEqual({
        hasError: false,
        error: null,
        errorMessage: "",
      });
    });

    it("clears error multiple times without issues", () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.clearError();
        result.current.clearError();
        result.current.clearError();
      });

      expect(result.current.errorState.hasError).toBe(false);
    });
  });

  describe("Error Checking", () => {
    it("correctly identifies matching errors", () => {
      const { result } = renderHook(() => useErrorHandler());
      const testError = new Error("Test error message");

      act(() => {
        result.current.handleError(testError);
      });

      expect(result.current.isError(testError)).toBe(true);
      expect(result.current.isError("Test error message")).toBe(true);
    });

    it("correctly identifies non-matching errors", () => {
      const { result } = renderHook(() => useErrorHandler());
      const testError = new Error("Test error message");
      const differentError = new Error("Different error message");

      act(() => {
        result.current.handleError(testError);
      });

      expect(result.current.isError(differentError)).toBe(false);
      expect(result.current.isError("Different error message")).toBe(false);
    });

    it("returns false when no error is set", () => {
      const { result } = renderHook(() => useErrorHandler());

      expect(result.current.isError(new Error("Any error"))).toBe(false);
      expect(result.current.isError("Any error")).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string error", () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError("");
      });

      expect(result.current.errorState.hasError).toBe(true);
      expect(result.current.errorState.errorMessage).toBe("");
      expect(result.current.errorState.error).toBeInstanceOf(Error);
    });

    it("handles null/undefined gracefully", () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError(null as any);
      });

      expect(result.current.errorState.hasError).toBe(true);
      expect(result.current.errorState.error).toBeInstanceOf(Error);
    });

    it("handles complex error objects", () => {
      const { result } = renderHook(() => useErrorHandler());
      const complexError = new Error("Complex error");
      complexError.stack = "Error stack trace";

      act(() => {
        result.current.handleError(complexError);
      });

      expect(result.current.errorState.error).toBe(complexError);
      expect(result.current.errorState.errorMessage).toBe("Complex error");
    });
  });

  describe("Function Stability", () => {
    it("maintains function references across re-renders", () => {
      const { result, rerender } = renderHook(() => useErrorHandler());

      const initialHandleError = result.current.handleError;
      const initialClearError = result.current.clearError;
      const initialIsError = result.current.isError;

      rerender();

      expect(result.current.handleError).toBe(initialHandleError);
      expect(result.current.clearError).toBe(initialClearError);
      expect(result.current.isError).toBe(initialIsError);
    });

    it("handles rapid error state changes", () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError("Error 1");
        result.current.clearError();
        result.current.handleError("Error 2");
        result.current.clearError();
        result.current.handleError("Error 3");
      });

      expect(result.current.errorState.errorMessage).toBe("Error 3");
      expect(result.current.errorState.hasError).toBe(true);
    });
  });

  describe("Integration", () => {
    it("works correctly with multiple hook instances", () => {
      const { result: result1 } = renderHook(() => useErrorHandler());
      const { result: result2 } = renderHook(() => useErrorHandler());

      act(() => {
        result1.current.handleError("Error 1");
        result2.current.handleError("Error 2");
      });

      expect(result1.current.errorState.errorMessage).toBe("Error 1");
      expect(result2.current.errorState.errorMessage).toBe("Error 2");

      act(() => {
        result1.current.clearError();
      });

      expect(result1.current.errorState.hasError).toBe(false);
      expect(result2.current.errorState.hasError).toBe(true);
    });
  });
});
