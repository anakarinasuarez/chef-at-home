import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ErrorBoundary from "../ErrorBoundary";

// Mock Button component
vi.mock("../Button", () => ({
  default: ({ children, onClick, variant, className }: any) => (
    <button
      onClick={onClick}
      data-testid={`button-${variant}`}
      className={className}
    >
      {children}
    </button>
  ),
}));

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, "location", {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe("ErrorBoundary", () => {
  const mockOnError = vi.fn();
  const mockError = new Error("Test error");
  const mockUnhandledRejection = new Error("Unhandled promise rejection");

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any existing event listeners
    window.removeEventListener("error", vi.fn());
    window.removeEventListener("unhandledrejection", vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("renders custom fallback when error occurs", () => {
      const customFallback = <div>Custom error message</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));

      expect(screen.getByText("Custom error message")).toBeInTheDocument();
      expect(screen.queryByText("Test content")).not.toBeInTheDocument();
    });

    it("renders default error UI when error occurs", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));

      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "We encountered an unexpected error. Please try refreshing the page."
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
      expect(screen.getByText("Refresh Page")).toBeInTheDocument();
      expect(screen.queryByText("Test content")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles error events", () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error event
      fireEvent(window, new ErrorEvent("error", { error: mockError }));

      expect(mockOnError).toHaveBeenCalledWith(mockError);
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
    });

    it("handles unhandled promise rejections", () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an unhandled promise rejection using a custom event
      const rejectionEvent = new Event("unhandledrejection") as any;
      rejectionEvent.reason = mockUnhandledRejection;
      fireEvent(window, rejectionEvent);

      expect(mockOnError).toHaveBeenCalledWith(mockUnhandledRejection);
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
    });

    it("handles non-Error unhandled promise rejections", () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an unhandled promise rejection with non-Error reason
      const rejectionEvent = new Event("unhandledrejection") as any;
      rejectionEvent.reason = "String error";
      fireEvent(window, rejectionEvent);

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
    });

    it("does not call onError when not provided", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error event
      fireEvent(window, new ErrorEvent("error", { error: mockError }));

      expect(consoleSpy).toHaveBeenCalledWith(
        "ErrorBoundary caught an error:",
        mockError
      );
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("User Interactions", () => {
    it("resets error state when Try Again button is clicked", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();

      // Click Try Again button
      const tryAgainButton = screen.getByText("Try Again");
      fireEvent.click(tryAgainButton);

      // Should render children again
      expect(screen.getByText("Test content")).toBeInTheDocument();
      expect(
        screen.queryByText("Oops! Something went wrong")
      ).not.toBeInTheDocument();
    });

    it("reloads page when Refresh Page button is clicked", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();

      // Click Refresh Page button
      const refreshButton = screen.getByText("Refresh Page");
      fireEvent.click(refreshButton);

      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe("Development Mode", () => {
    it("shows error details in development mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error with stack trace
      const errorWithStack = new Error("Test error");
      errorWithStack.stack = "Error: Test error\n    at test.js:1:1";

      fireEvent(window, new ErrorEvent("error", { error: errorWithStack }));

      expect(
        screen.getByText("Error Details (Development)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Error: Test error", { exact: false })
      ).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it("does not show error details in production mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));

      expect(
        screen.queryByText("Error Details (Development)")
      ).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("Event Listeners", () => {
    it("adds and removes event listeners correctly", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "error",
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "unhandledrejection",
        expect.any(Function)
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "error",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "unhandledrejection",
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("handles multiple errors correctly", () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate multiple errors
      fireEvent(window, new ErrorEvent("error", { error: mockError }));
      fireEvent(
        window,
        new ErrorEvent("error", { error: new Error("Second error") })
      );

      expect(mockOnError).toHaveBeenCalledTimes(2);
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
    });

    it("handles error state reset correctly", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();

      // Reset error state
      const tryAgainButton = screen.getByText("Try Again");
      fireEvent.click(tryAgainButton);

      // Should render children again
      expect(screen.getByText("Test content")).toBeInTheDocument();

      // Simulate another error
      fireEvent(
        window,
        new ErrorEvent("error", { error: new Error("New error") })
      );
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
    });

    it("handles empty children", () => {
      render(<ErrorBoundary>{null}</ErrorBoundary>);

      // Should not crash
      expect(document.body).toBeInTheDocument();
    });

    it("handles undefined error in error event", () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error event without error property
      fireEvent(window, new ErrorEvent("error"));

      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Oops! Something went wrong");
    });

    it("has proper button roles", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      // Simulate an error
      fireEvent(window, new ErrorEvent("error", { error: mockError }));

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(screen.getByText("Try Again")).toBeInTheDocument();
      expect(screen.getByText("Refresh Page")).toBeInTheDocument();
    });
  });
});
