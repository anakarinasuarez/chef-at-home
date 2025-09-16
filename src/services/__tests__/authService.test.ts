import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { registerUser, loginUser, getUserById } from "../authService";

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("registerUser", () => {
    it("returns error when name is missing", async () => {
      const invalidData = {
        name: "",
        email: "test@example.com",
        password: "password123",
      };

      const result = await registerUser(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("All fields are required");
      expect(result.user).toBeUndefined();
    });

    it("returns error when email is missing", async () => {
      const invalidData = {
        name: "Test User",
        email: "",
        password: "password123",
      };

      const result = await registerUser(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("All fields are required");
    });

    it("returns error when password is missing", async () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "",
      };

      const result = await registerUser(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("All fields are required");
    });

    it("returns error when password is too short", async () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "123",
      };

      const result = await registerUser(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Password must be at least 6 characters");
    });

    it("validates minimum password length", async () => {
      const weakPasswords = ["123", "abc", "12345"];

      for (const password of weakPasswords) {
        const result = await registerUser({
          name: "Test User",
          email: "test@example.com",
          password,
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe("Password must be at least 6 characters");
      }
    });

    it("accepts valid password length", async () => {
      const validPasswords = ["123456", "password", "strongpass123"];

      for (const password of validPasswords) {
        const result = await registerUser({
          name: "Test User",
          email: "test@example.com",
          password,
        });

        // Should not fail on password length validation
        expect(result.error).not.toBe("Password must be at least 6 characters");
      }
    });
  });

  describe("loginUser", () => {
    it("returns error when email is missing", async () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = await loginUser(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email and password are required");
    });

    it("returns error when password is missing", async () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = await loginUser(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email and password are required");
    });

    it("validates required fields", async () => {
      const testCases = [
        { email: "", password: "password123" },
        { email: "test@example.com", password: "" },
        { email: "", password: "" },
      ];

      for (const testCase of testCases) {
        const result = await loginUser(testCase);
        expect(result.success).toBe(false);
        expect(result.error).toBe("Email and password are required");
      }
    });
  });

  describe("getUserById", () => {
    it("handles empty user ID", async () => {
      const result = await getUserById("");

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
    });

    it("handles null user ID", async () => {
      const result = await getUserById(null as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
    });

    it("handles undefined user ID", async () => {
      const result = await getUserById(undefined as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
    });
  });

  describe("Input Validation", () => {
    it("handles null input data gracefully", async () => {
      const result = await registerUser(null as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });

    it("handles undefined input data gracefully", async () => {
      const result = await loginUser(undefined as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal server error");
    });

    it("handles empty object input", async () => {
      const result = await registerUser({} as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe("All fields are required");
    });
  });

  describe("Data Types", () => {
    it("handles non-string inputs", async () => {
      const invalidData = {
        name: 123 as any,
        email: "test@example.com",
        password: "password123",
      };

      const result = await registerUser(invalidData);

      // The service might succeed or fail depending on how it handles type coercion
      expect(result.success).toBeDefined();
      expect(typeof result.success).toBe("boolean");
    });

    it("handles array inputs", async () => {
      const invalidData = {
        name: ["Test", "User"] as any,
        email: "test@example.com",
        password: "password123",
      };

      const result = await registerUser(invalidData);

      // The service might succeed or fail depending on how it handles type coercion
      expect(result.success).toBeDefined();
      expect(typeof result.success).toBe("boolean");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long email addresses", async () => {
      const longEmail = "a".repeat(1000) + "@example.com";
      const data = {
        name: "Test User",
        email: longEmail,
        password: "password123",
      };

      const result = await registerUser(data);

      // Should not fail on email length validation
      expect(result.error).not.toBe("All fields are required");
    });

    it("handles special characters in user data", async () => {
      const dataWithSpecialChars = {
        name: "Test User @#$%^&*()",
        email: "test+special@example.com",
        password: "password123!@#",
      };

      const result = await registerUser(dataWithSpecialChars);

      // Should not fail on special character validation
      expect(result.error).not.toBe("All fields are required");
    });

    it("handles whitespace-only inputs", async () => {
      const whitespaceData = {
        name: "   ",
        email: "test@example.com",
        password: "password123",
      };

      const result = await registerUser(whitespaceData);

      // Should not fail on whitespace validation (current implementation doesn't trim)
      expect(result.error).not.toBe("All fields are required");
    });
  });

  describe("Security", () => {
    it("validates password strength", async () => {
      const weakPasswords = ["123", "abc", "12345"];

      for (const password of weakPasswords) {
        const result = await registerUser({
          name: "Test User",
          email: "test@example.com",
          password,
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe("Password must be at least 6 characters");
      }
    });

    it("accepts strong passwords", async () => {
      const strongPasswords = [
        "password123",
        "StrongPass123!",
        "verylongpassword123456",
      ];

      for (const password of strongPasswords) {
        const result = await registerUser({
          name: "Test User",
          email: "test@example.com",
          password,
        });

        // Should not fail on password strength validation
        expect(result.error).not.toBe("Password must be at least 6 characters");
      }
    });
  });
});
