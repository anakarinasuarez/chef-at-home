import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  resetPasswordSchema,
  resetPasswordWithTokenSchema,
} from "../auth";

describe("auth schemas", () => {
  describe("loginSchema", () => {
    it("validates correct login data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects empty email", () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Email is required");
      }
    });

    it("rejects invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Please enter a valid email address"
        );
      }
    });

    it("rejects email longer than 255 characters", () => {
      const invalidData = {
        email: "a".repeat(250) + "@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Email must be less than 255 characters"
        );
      }
    });

    it("rejects empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Password is required");
      }
    });

    it("rejects password shorter than 6 characters", () => {
      const invalidData = {
        email: "test@example.com",
        password: "12345",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Password must be at least 6 characters"
        );
      }
    });

    it("rejects password longer than 100 characters", () => {
      const invalidData = {
        email: "test@example.com",
        password: "a".repeat(101),
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Password must be less than 100 characters"
        );
      }
    });
  });

  describe("registerSchema", () => {
    it("validates correct registration data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects empty name", () => {
      const invalidData = {
        name: "",
        email: "john@example.com",
        password: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Name is required");
      }
    });

    it("rejects name shorter than 2 characters", () => {
      const invalidData = {
        name: "J",
        email: "john@example.com",
        password: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Name must be at least 2 characters"
        );
      }
    });

    it("rejects name with numbers", () => {
      const invalidData = {
        name: "John123",
        email: "john@example.com",
        password: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Name can only contain letters and spaces"
        );
      }
    });

    it("rejects name longer than 100 characters", () => {
      const invalidData = {
        name: "a".repeat(101),
        email: "john@example.com",
        password: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Name must be less than 100 characters"
        );
      }
    });

    it("rejects password without uppercase letter", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        );
      }
    });

    it("rejects password without lowercase letter", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "PASSWORD123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        );
      }
    });

    it("rejects password without number", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        );
      }
    });

    it("rejects password shorter than 8 characters", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Pass1",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Password must be at least 8 characters"
        );
      }
    });
  });

  describe("changePasswordSchema", () => {
    it("validates correct change password data", () => {
      const validData = {
        currentPassword: "OldPassword123",
        newPassword: "NewPassword123",
        confirmPassword: "NewPassword123",
      };

      const result = changePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects empty current password", () => {
      const invalidData = {
        currentPassword: "",
        newPassword: "NewPassword123",
        confirmPassword: "NewPassword123",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Current password is required"
        );
      }
    });

    it("rejects mismatched passwords", () => {
      const invalidData = {
        currentPassword: "OldPassword123",
        newPassword: "NewPassword123",
        confirmPassword: "DifferentPassword123",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Passwords don't match");
        expect(result.error.errors[0].path).toEqual(["confirmPassword"]);
      }
    });

    it("rejects new password without required complexity", () => {
      const invalidData = {
        currentPassword: "OldPassword123",
        newPassword: "simple",
        confirmPassword: "simple",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "New password must be at least 8 characters"
        );
      }
    });
  });

  describe("resetPasswordSchema", () => {
    it("validates correct reset password data", () => {
      const validData = {
        email: "test@example.com",
      };

      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects empty email", () => {
      const invalidData = {
        email: "",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Email is required");
      }
    });

    it("rejects invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Please enter a valid email address"
        );
      }
    });
  });

  describe("resetPasswordWithTokenSchema", () => {
    it("validates correct reset password with token data", () => {
      const validData = {
        token: "a".repeat(64),
        password: "NewPassword123",
        confirmPassword: "NewPassword123",
      };

      const result = resetPasswordWithTokenSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejects empty token", () => {
      const invalidData = {
        token: "",
        password: "NewPassword123",
        confirmPassword: "NewPassword123",
      };

      const result = resetPasswordWithTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Reset token is required");
      }
    });

    it("rejects token with wrong length", () => {
      const invalidData = {
        token: "short-token",
        password: "NewPassword123",
        confirmPassword: "NewPassword123",
      };

      const result = resetPasswordWithTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Invalid reset token format"
        );
      }
    });

    it("rejects mismatched passwords", () => {
      const invalidData = {
        token: "a".repeat(64),
        password: "NewPassword123",
        confirmPassword: "DifferentPassword123",
      };

      const result = resetPasswordWithTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Passwords don't match");
        expect(result.error.errors[0].path).toEqual(["confirmPassword"]);
      }
    });

    it("rejects password without required complexity", () => {
      const invalidData = {
        token: "a".repeat(64),
        password: "simple",
        confirmPassword: "simple",
      };

      const result = resetPasswordWithTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "New password must be at least 8 characters"
        );
      }
    });
  });
});
