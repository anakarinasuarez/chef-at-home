import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Mock next/image → plain <img>. Static image imports resolve to an object
// ({ src, width, height }) outside Next's loader, so unwrap `.src`.
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt = "", priority, fill, quality, loader, ...props }: any) => {
    const resolvedSrc =
      typeof src === "object" && src !== null ? src.src ?? "" : src;
    return React.createElement("img", { src: resolvedSrc, alt, ...props });
  },
}));

// Import all mocks except services (let individual tests handle service mocks)
import "./mocks/contexts";
import "./mocks/hooks";

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockPrefetch = vi.fn();
const mockBack = vi.fn();
const mockForward = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
}));

// Export mocks for use in tests
export {
  mockPush,
  mockReplace,
  mockPrefetch,
  mockBack,
  mockForward,
  mockRefresh,
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
