"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthUnified } from "@/hooks";
import { useToast } from "@/hooks";
import { colors } from "@/design-system";
import Button from "@/components/Button";
import FormField from "./FormField";
import {
  loginSchema,
  registerSchema,
  safeValidateSchema,
  getFirstZodError,
} from "@/schemas";

interface AuthFormProps {
  type: "login" | "signup";
  title: string;
  subtitle?: string;
}

export default function AuthForm({ type, title, subtitle }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { login, register } = useAuthUnified();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      // Validar datos con Zod
      const schema = type === "login" ? loginSchema : registerSchema;
      const validation = safeValidateSchema(schema, formData);

      if (!validation.success) {
        // Procesar errores de validación
        const errors: Record<string, string> = {};
        validation.error.errors.forEach(
          (err: { path: (string | number)[]; message: string }) => {
            const field = err.path[0] as string;
            errors[field] = err.message;
          }
        );
        setFieldErrors(errors);

        // Mostrar el primer error como mensaje general
        const firstError = getFirstZodError(validation.error);
        setError(firstError);
        showError(firstError);
        return;
      }

      // Proceder con autenticación si la validación es exitosa
      if (type === "login") {
        const success = await login(formData.email, formData.password);
        if (success) {
          showSuccess("Welcome back!");
          router.push("/");
        } else {
          setError("Invalid email or password");
          showError("Invalid email or password");
        }
      } else {
        const success = await register(
          formData.name,
          formData.email,
          formData.password
        );
        if (success) {
          showSuccess("Account created successfully!");
          router.push("/");
        } else {
          setError("Registration failed. Please try again.");
          showError("Registration failed. Please try again.");
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignup = type === "signup";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {/* Campo Nombre (solo para signup) */}
      {isSignup && (
        <FormField
          id="name"
          name="name"
          type="text"
          label="Your name"
          placeholder="chef"
          value={formData.name}
          onChange={handleChange}
          required
          error={fieldErrors.name}
        />
      )}

      {/* Campo Email */}
      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="chef@example.com"
        value={formData.email}
        onChange={handleChange}
        required
        error={fieldErrors.email}
      />

      {/* Campo Contraseña */}
      <FormField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
        error={fieldErrors.password}
      />

      {/* Mensaje de Error */}
      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </Button>
        <Button href="/" variant="secondary">
          Cancel
        </Button>
      </div>

      {/* Link adicional (login/signup) */}
      <div className="pt-2">
        <span className="text-gray-300" style={{ fontSize: "16px" }}>
          {type === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
        </span>
        <a
          href={type === "signup" ? "/auth/login" : "/auth/signup"}
          className="underline cursor-pointer"
          style={{
            color: colors.brand.primary[500],
            fontSize: "16px",
          }}
        >
          {type === "signup" ? "Sign in here" : "Sign up here"}
        </a>
      </div>

      {/* Forgot Password Link (solo para login) */}
      {type !== "signup" && (
        <div className="pt-2 text-left">
          <a
            href="/auth/forgot-password"
            className="underline cursor-pointer hover:text-white transition-colors"
            style={{
              color: colors.brand.primary[500],
              fontSize: "16px",
            }}
          >
            Forgot your password?
          </a>
        </div>
      )}
    </form>
  );
}
