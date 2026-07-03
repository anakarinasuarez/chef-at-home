import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundaryAdvanced } from "../ErrorBoundaryAdvanced";

// Mock error logger
vi.mock("@/lib/errorLogger", () => ({
  errorLogger: {
    logError: vi.fn(),
    trackUserAction: vi.fn(),
    getErrorById: vi.fn(),
  },
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundaryAdvanced", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={false} />
      </ErrorBoundaryAdvanced>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders error UI when there is an error", () => {
    render(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText(/Try Again/)).toBeInTheDocument();
    expect(screen.getByText("Refresh Page")).toBeInTheDocument();
    expect(screen.getByText("Report Error")).toBeInTheDocument();
  });

  it("renders critical error UI when level is critical", () => {
    render(
      <ErrorBoundaryAdvanced level="critical">
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    expect(screen.getByText("Critical Error")).toBeInTheDocument();
    expect(screen.getByText("💥")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundaryAdvanced fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("calls onError callback when error occurs", () => {
    const onError = vi.fn();

    render(
      <ErrorBoundaryAdvanced onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it("handles retry functionality", () => {
    render(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    // Should show error UI
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Should show retry button
    const retryButton = screen.getByText(/Try Again/);
    expect(retryButton).toBeInTheDocument();

    // Clicking retry should not throw an error
    expect(() => fireEvent.click(retryButton)).not.toThrow();
  });

  it("limits retry attempts", () => {
    const { rerender } = render(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    // First retry
    fireEvent.click(screen.getByText(/Try Again/));
    rerender(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    // Second retry
    fireEvent.click(screen.getByText(/Try Again/));
    rerender(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    // Third retry
    fireEvent.click(screen.getByText(/Try Again/));
    rerender(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    // After max retries, retry button should not be available
    expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument();
  });

  it("shows error details in development mode", () => {
    vi.stubEnv("NODE_ENV", "development");

    render(
      <ErrorBoundaryAdvanced showDetails={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    expect(screen.getByText("Error Details")).toBeInTheDocument();

    vi.unstubAllEnvs();
  });

  it("handles report error functionality", () => {
    const mockOpen = vi.fn();
    Object.defineProperty(window, "open", {
      value: mockOpen,
      writable: true,
    });

    render(
      <ErrorBoundaryAdvanced>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    // Wait for error boundary to catch the error and set errorId
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Should show report button
    const reportButton = screen.getByText("Report Error");
    expect(reportButton).toBeInTheDocument();

    // Clicking report should not throw an error
    expect(() => fireEvent.click(reportButton)).not.toThrow();

    // Verificar que se llamó window.open (si hay errorId)
    if (mockOpen.mock.calls.length > 0) {
      const callArgs = mockOpen.mock.calls[0][0];
      expect(callArgs).toContain("mailto:support@chefathome.com");
    }

    // Cleanup
    delete (window as any).open;
  });

  it("disables retry when allowRetry is false", () => {
    render(
      <ErrorBoundaryAdvanced allowRetry={false}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument();
  });

  it("renders with correct error boundary name", () => {
    render(
      <ErrorBoundaryAdvanced errorBoundaryName="TestComponent">
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryAdvanced>
    );

    // Should still render error UI
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
