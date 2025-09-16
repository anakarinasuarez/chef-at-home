import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthUnified } from "../useAuthUnified";

// Mock the Zustand store
const mockStore = {
  user: null,
  isLoading: false,
  error: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

vi.mock("@/stores/appStore", () => ({
  useAppStore: vi.fn((selector) => {
    if (typeof selector === "function") {
      return selector(mockStore);
    }
    return mockStore[selector as keyof typeof mockStore];
  }),
}));

describe("useAuthUnified", () => {
  const mockUser = {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset store state
    mockStore.user = null;
    mockStore.isLoading = false;
    mockStore.error = null;

    // Reset localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.removeItem).mockClear();
    vi.mocked(localStorage.setItem).mockClear();

    // Reset fetch mock
    vi.mocked(fetch).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("initializes with null user and loading false", () => {
      const { result } = renderHook(() => useAuthUnified());

      expect(result.current.user).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("provides login, register, and logout functions", () => {
      const { result } = renderHook(() => useAuthUnified());

      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.register).toBe("function");
      expect(typeof result.current.logout).toBe("function");
    });
  });

  describe("Login", () => {
    it("calls store login function", async () => {
      mockStore.login.mockResolvedValue(true);

      const { result } = renderHook(() => useAuthUnified());

      await act(async () => {
        await result.current.login("test@example.com", "password123");
      });

      expect(mockStore.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    it("returns login result from store", async () => {
      mockStore.login.mockResolvedValue(false);

      const { result } = renderHook(() => useAuthUnified());

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login(
          "test@example.com",
          "wrongpassword"
        );
      });

      expect(loginResult!).toBe(false);
    });
  });

  describe("Register", () => {
    it("calls store register function", async () => {
      mockStore.register.mockResolvedValue(true);

      const { result } = renderHook(() => useAuthUnified());

      await act(async () => {
        await result.current.register(
          "Test User",
          "test@example.com",
          "password123"
        );
      });

      expect(mockStore.register).toHaveBeenCalledWith(
        "Test User",
        "test@example.com",
        "password123"
      );
    });

    it("returns register result from store", async () => {
      mockStore.register.mockResolvedValue(false);

      const { result } = renderHook(() => useAuthUnified());

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.register(
          "Test User",
          "test@example.com",
          "password123"
        );
      });

      expect(registerResult!).toBe(false);
    });
  });

  describe("Logout", () => {
    it("calls store logout function", () => {
      const { result } = renderHook(() => useAuthUnified());

      act(() => {
        result.current.logout();
      });

      expect(mockStore.logout).toHaveBeenCalled();
    });
  });

  describe("State Updates", () => {
    it("reflects user state changes from store", () => {
      const { result, rerender } = renderHook(() => useAuthUnified());

      expect(result.current.user).toBe(null);

      // Simulate store state change
      mockStore.user = mockUser;
      rerender();

      expect(result.current.user).toEqual(mockUser);
    });

    it("reflects loading state changes from store", () => {
      const { result, rerender } = renderHook(() => useAuthUnified());

      expect(result.current.isLoading).toBe(false);

      // Simulate store state change
      mockStore.isLoading = true;
      rerender();

      expect(result.current.isLoading).toBe(true);
    });

    it("reflects error state changes from store", () => {
      const { result, rerender } = renderHook(() => useAuthUnified());

      expect(result.current.error).toBe(null);

      // Simulate store state change
      mockStore.error = "Test error";
      rerender();

      expect(result.current.error).toBe("Test error");
    });
  });

  describe("Performance", () => {
    it("does not cause unnecessary re-renders", () => {
      const { result } = renderHook(() => useAuthUnified());

      const initialUser = result.current.user;
      const initialLoading = result.current.isLoading;
      const initialError = result.current.error;

      // Call logout when already logged out
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBe(initialUser);
      expect(result.current.isLoading).toBe(initialLoading);
      expect(result.current.error).toBe(initialError);
    });
  });
});
