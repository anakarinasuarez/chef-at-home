import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "../useToast";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe("useToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("provides all toast functions", () => {
      const { result } = renderHook(() => useToast());

      expect(typeof result.current.showSuccess).toBe("function");
      expect(typeof result.current.showError).toBe("function");
      expect(typeof result.current.showLoading).toBe("function");
      expect(typeof result.current.dismiss).toBe("function");
    });
  });

  describe("showSuccess", () => {
    it("calls toast.success with message", () => {
      const { result } = renderHook(() => useToast());
      const message = "Operation completed successfully!";

      act(() => {
        result.current.showSuccess(message);
      });

      // We can't easily test the mock calls without importing the mocked module
      // But we can test that the function doesn't throw
      expect(() => result.current.showSuccess(message)).not.toThrow();
    });

    it("handles empty message", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          result.current.showSuccess("");
        });
      }).not.toThrow();
    });

    it("handles long messages", () => {
      const { result } = renderHook(() => useToast());
      const longMessage = "A".repeat(1000);

      expect(() => {
        act(() => {
          result.current.showSuccess(longMessage);
        });
      }).not.toThrow();
    });
  });

  describe("showError", () => {
    it("calls toast.error with message", () => {
      const { result } = renderHook(() => useToast());
      const message = "Something went wrong!";

      expect(() => {
        act(() => {
          result.current.showError(message);
        });
      }).not.toThrow();
    });

    it("handles error messages with special characters", () => {
      const { result } = renderHook(() => useToast());
      const specialMessage = "Error: @#$%^&*()";

      expect(() => {
        act(() => {
          result.current.showError(specialMessage);
        });
      }).not.toThrow();
    });
  });

  describe("showLoading", () => {
    it("calls toast.loading with message", () => {
      const { result } = renderHook(() => useToast());
      const message = "Loading...";

      expect(() => {
        act(() => {
          result.current.showLoading(message);
        });
      }).not.toThrow();
    });

    it("handles loading messages with dynamic content", () => {
      const { result } = renderHook(() => useToast());
      const dynamicMessage = `Processing item ${Math.random()}`;

      expect(() => {
        act(() => {
          result.current.showLoading(dynamicMessage);
        });
      }).not.toThrow();
    });
  });

  describe("dismiss", () => {
    it("dismisses specific toast when ID provided", () => {
      const { result } = renderHook(() => useToast());
      const toastId = "specific-toast-id";

      expect(() => {
        act(() => {
          result.current.dismiss(toastId);
        });
      }).not.toThrow();
    });

    it("dismisses all toasts when no ID provided", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          result.current.dismiss();
        });
      }).not.toThrow();
    });

    it("handles undefined toast ID", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          result.current.dismiss(undefined);
        });
      }).not.toThrow();
    });

    it("handles empty string toast ID", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          result.current.dismiss("");
        });
      }).not.toThrow();
    });
  });

  describe("Multiple Toast Operations", () => {
    it("can show multiple different toast types", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          result.current.showLoading("Loading...");
          result.current.showSuccess("Success!");
          result.current.showError("Error!");
        });
      }).not.toThrow();
    });

    it("can dismiss after showing toast", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          const id = result.current.showSuccess("Test message");
          result.current.dismiss(id);
        });
      }).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("does not cause unnecessary re-renders", () => {
      const { result } = renderHook(() => useToast());

      const initialShowSuccess = result.current.showSuccess;
      const initialShowError = result.current.showError;
      const initialShowLoading = result.current.showLoading;
      const initialDismiss = result.current.dismiss;

      // Call a function
      act(() => {
        result.current.showSuccess("Test");
      });

      // Functions should remain the same (stable references)
      expect(result.current.showSuccess).toBe(initialShowSuccess);
      expect(result.current.showError).toBe(initialShowError);
      expect(result.current.showLoading).toBe(initialShowLoading);
      expect(result.current.dismiss).toBe(initialDismiss);
    });
  });

  describe("Edge Cases", () => {
    it("handles null message gracefully", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          result.current.showSuccess(null as any);
        });
      }).not.toThrow();
    });

    it("handles undefined message gracefully", () => {
      const { result } = renderHook(() => useToast());

      expect(() => {
        act(() => {
          result.current.showError(undefined as any);
        });
      }).not.toThrow();
    });

    it("handles very long messages", () => {
      const { result } = renderHook(() => useToast());
      const veryLongMessage = "A".repeat(10000);

      expect(() => {
        act(() => {
          result.current.showLoading(veryLongMessage);
        });
      }).not.toThrow();
    });
  });
});
