"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { colors } from "@/design-system";
import Button from "@/components/Button";
import FormField from "./FormField";

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
  const { login, register } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (type === "login") {
        const success = await login(formData.email, formData.password);
        if (success) {
          showNotification("Welcome back!", "success");
          router.push("/");
        } else {
          setError("Invalid email or password");
          showNotification("Invalid email or password", "error");
        }
      } else {
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          showNotification("Account created successfully!", "success");
          router.push("/");
        } else {
          setError("Registration failed. Please try again.");
          showNotification("Registration failed. Please try again.", "error");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      showNotification(err.message || "An error occurred", "error");
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
        <span className="text-gray-300">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        </span>
        <a
          href={isSignup ? "/auth/login" : "/auth/signup"}
          className="underline cursor-pointer"
          style={{ color: colors.brand.primary[500] }}
        >
          {isSignup ? "Sign in here" : "Sign up here"}
        </a>
      </div>
    </form>
  );
}
