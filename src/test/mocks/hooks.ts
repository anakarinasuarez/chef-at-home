import { vi } from "vitest";

// Mock useAuthUnified
export const mockUseAuthUnified = () => ({
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  },
  isLoading: false,
  error: null,
  login: vi.fn().mockResolvedValue(true),
  register: vi.fn().mockResolvedValue(true),
  logout: vi.fn().mockResolvedValue(true),
});

// Mock all hooks
vi.mock("@/hooks", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    // Unified auth hook
    useAuthUnified: mockUseAuthUnified,
  };
});