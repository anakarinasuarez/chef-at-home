"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks";
import { colors } from "@/design-system";
import Button from "@/components/Button";
import FormField from "@/components/auth/FormField";
import AuthLayout from "@/components/auth/AuthLayout";
import {
  resetPasswordSchema,
  safeValidateSchema,
  getFirstZodError,
} from "@/schemas";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);

    // Limpiar error del campo cuando el usuario escribe
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "",
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
      const validation = safeValidateSchema(resetPasswordSchema, { email });

      if (!validation.success) {
        // Procesar errores de validación
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((err: any) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setFieldErrors(errors);

        // Mostrar el primer error como mensaje general
        const firstError = getFirstZodError(validation.error);
        setError(firstError);
        showError(firstError);
        return;
      }

      // Enviar solicitud de reset
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        showSuccess(data.message);
      } else {
        setError(data.details || data.error || "An error occurred");
        showError(data.details || data.error || "An error occurred");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      showError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle={`We've sent a password reset link to ${email}`}
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

          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setIsSubmitted(false)} variant="primary">
                Try Different Email
              </Button>
              <Button href="/auth/login" variant="secondary">
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries! Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
          error={fieldErrors.email}
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
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Button href="/auth/login" variant="secondary">
            Back to Login
          </Button>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-6 text-center">
        <p className="text-gray-300 text-sm">
          Remember your password?{" "}
          <a
            href="/auth/login"
            className="underline cursor-pointer hover:text-white transition-colors"
            style={{ color: colors.brand.primary[500] }}
          >
            Sign in here
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
