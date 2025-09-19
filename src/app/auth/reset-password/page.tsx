"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks";
import { colors } from "@/design-system";
import Button from "@/components/Button";
import FormField from "@/components/auth/FormField";
import AuthLayout from "@/components/auth/AuthLayout";
import {
  resetPasswordWithTokenSchema,
  safeValidateSchema,
  getFirstZodError,
} from "@/schemas";

function ResetPasswordContent() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid reset link. Please request a new password reset.");
      showError("Invalid reset link. Please request a new password reset.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, showError]);

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

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    try {
      // Validar datos con Zod
      const validation = safeValidateSchema(resetPasswordWithTokenSchema, {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

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

      // Enviar solicitud de reset
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        showSuccess(data.message);
      } else {
        setError(data.details || data.error || "An error occurred");
        showError(data.details || data.error || "An error occurred");
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

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Reset Successfully!"
        subtitle="Your password has been updated. You can now log in with your new password."
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <Button href="/auth/login" variant="primary">
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle="This password reset link is invalid or has expired. Please request a new one."
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <Button href="/auth/forgot-password" variant="primary">
            Request New Reset Link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your new password below."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="password"
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          value={formData.password}
          onChange={handleChange}
          required
          error={fieldErrors.password}
        />

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={fieldErrors.confirmPassword}
        />

        {/* Mensaje de Error */}
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Información de contraseña */}
        <div className="bg-blue-900/20 p-3 rounded-lg">
          <p className="text-blue-200 text-sm">
            <strong>Password requirements:</strong>
          </p>
          <ul className="text-blue-200 text-sm mt-1 space-y-1">
            <li>• At least 8 characters</li>
            <li>• One uppercase letter</li>
            <li>• One lowercase letter</li>
            <li>• One number</li>
          </ul>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
          <Button href="/auth/login" variant="secondary">
            Back to Login
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
