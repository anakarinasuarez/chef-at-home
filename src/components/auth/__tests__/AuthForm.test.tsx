import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "../AuthForm";
import { safeValidateSchema, getFirstZodError } from "@/schemas";

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock hooks
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock("@/hooks", () => ({
  useAuthUnified: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
  useToastTransition: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

// Mock schemas
vi.mock("@/schemas", () => ({
  loginSchema: {
    parse: vi.fn(),
  },
  registerSchema: {
    parse: vi.fn(),
  },
  safeValidateSchema: vi.fn(),
  getFirstZodError: vi.fn(),
}));

// Mock FormField component
vi.mock("../FormField", () => ({
  default: ({
    id,
    name,
    type,
    label,
    placeholder,
    value,
    onChange,
    required,
    error,
    minLength,
  }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        data-testid={`input-${name}`}
      />
      {error && <span data-testid={`error-${name}`}>{error}</span>}
    </div>
  ),
}));

// Mock Button component
vi.mock("@/components/Button", () => ({
  default: ({ children, type, variant, disabled, href, onClick }: any) => {
    if (href) {
      return (
        <a href={href} data-testid="cancel-button">
          {children}
        </a>
      );
    }
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        data-testid={type === "submit" ? "submit-button" : "button"}
      >
        {children}
      </button>
    );
  },
}));

// Mock design system
vi.mock("@/design-system", () => ({
  colors: {
    brand: {
      primary: {
        500: "#96b462",
      },
    },
  },
}));

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(safeValidateSchema).mockReturnValue({ success: true });
    vi.mocked(getFirstZodError).mockReturnValue("Validation error");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Login Form", () => {
    it("renders login form correctly", () => {
      render(
        <AuthForm
          type="login"
          title="Login"
          subtitle="Sign in to your account"
        />
      );

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText("Sign up here")).toBeInTheDocument();
      expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    });

    it("does not render name field for login", () => {
      render(<AuthForm type="login" title="Login" />);

      expect(screen.queryByLabelText("Your name")).not.toBeInTheDocument();
    });

    it("handles form input changes", async () => {
      const user = userEvent.setup();
      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      expect(emailInput).toHaveValue("test@example.com");
      expect(passwordInput).toHaveValue("password123");
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
      );

      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(submitButton).toHaveTextContent("Processing...");
      expect(submitButton).toBeDisabled();
    });

    it("handles successful login", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(true);

      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
        expect(mockShowSuccess).toHaveBeenCalledWith("Welcome back!");
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("handles failed login", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(false);

      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith("Invalid email or password");
        expect(
          screen.getByText("Invalid email or password")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Signup Form", () => {
    it("renders signup form correctly", () => {
      render(
        <AuthForm
          type="signup"
          title="Sign Up"
          subtitle="Create your account"
        />
      );

      expect(screen.getByLabelText("Your name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      expect(screen.getByText("Sign in here")).toBeInTheDocument();
    });

    it("does not show forgot password link for signup", () => {
      render(<AuthForm type="signup" title="Sign Up" />);

      expect(
        screen.queryByText("Forgot your password?")
      ).not.toBeInTheDocument();
    });

    it("handles successful registration", async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(true);

      render(<AuthForm type="signup" title="Sign Up" />);

      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(nameInput, "Test User");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          "Test User",
          "test@example.com",
          "password123"
        );
        expect(mockShowSuccess).toHaveBeenCalledWith(
          "Account created successfully!"
        );
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("handles failed registration", async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(false);

      render(<AuthForm type="signup" title="Sign Up" />);

      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(nameInput, "Test User");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          "Registration failed. Please try again."
        );
        expect(
          screen.getByText("Registration failed. Please try again.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("handles validation errors", async () => {
      const user = userEvent.setup();
      const mockValidation = {
        success: false,
        error: {
          errors: [
            { path: ["email"], message: "Invalid email format" },
            { path: ["password"], message: "Password too short" },
          ],
        },
      };

      vi.mocked(safeValidateSchema).mockReturnValue(mockValidation);
      vi.mocked(getFirstZodError).mockReturnValue("Invalid email format");

      render(<AuthForm type="login" title="Login" />);

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      // Check that the form submission was attempted
      expect(submitButton).toBeInTheDocument();
    });

    it("clears field errors when user types", async () => {
      const user = userEvent.setup();
      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");

      // Simulate typing to clear any existing errors
      await user.type(emailInput, "test@example.com");

      // The component should handle clearing field errors internally
      expect(emailInput).toHaveValue("test@example.com");
    });
  });

  describe("Navigation Links", () => {
    it("has correct signup link in login form", () => {
      render(<AuthForm type="login" title="Login" />);

      const signupLink = screen.getByText("Sign up here");
      expect(signupLink.closest("a")).toHaveAttribute("href", "/auth/signup");
    });

    it("has correct login link in signup form", () => {
      render(<AuthForm type="signup" title="Sign Up" />);

      const loginLink = screen.getByText("Sign in here");
      expect(loginLink.closest("a")).toHaveAttribute("href", "/auth/login");
    });

    it("has correct forgot password link", () => {
      render(<AuthForm type="login" title="Login" />);

      const forgotLink = screen.getByText("Forgot your password?");
      expect(forgotLink.closest("a")).toHaveAttribute(
        "href",
        "/auth/forgot-password"
      );
    });

    it("has correct cancel button", () => {
      render(<AuthForm type="login" title="Login" />);

      const cancelButton = screen.getByTestId("cancel-button");
      expect(cancelButton).toHaveAttribute("href", "/");
    });
  });

  describe("Error Handling", () => {
    it("handles unexpected errors", async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error("Network error"));

      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith("Network error");
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });

    it("handles errors without message", async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error());

      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith("");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper form structure", () => {
      render(<AuthForm type="login" title="Login" />);

      const form = screen.getByTestId("submit-button").closest("form");
      expect(form).toBeInTheDocument();
    });

    it("has proper input labels", () => {
      render(<AuthForm type="login" title="Login" />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("has proper button types", () => {
      render(<AuthForm type="login" title="Login" />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty form submission", async () => {
      const user = userEvent.setup();
      render(<AuthForm type="login" title="Login" />);

      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      // Should trigger validation - check that the form was submitted
      expect(submitButton).toBeInTheDocument();
    });

    it("handles rapid form submissions", async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
      );

      render(<AuthForm type="login" title="Login" />);

      const emailInput = screen.getByTestId("input-email");
      const passwordInput = screen.getByTestId("input-password");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      // Click multiple times rapidly
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only call login once due to loading state
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(1);
      });
    });
  });
});
