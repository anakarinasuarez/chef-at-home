"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { colors, typography, spacingSystem } from "@/design-system";
import Button from "@/components/Button";
import Nav from "@/components/Nav";
import Image from "next/image";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el registro");
      }

      // Registro exitoso
      alert("¡Usuario registrado exitosamente!");
      router.push("/auth/login"); // Redirigir al login
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      {/* Navigation */}
      <Nav showMenu={false} />

      {/* Contenido Principal - Layout de 2 columnas */}
      <main className="flex min-h-[calc(100vh-120px)] pt-8">
        {/* Columna Izquierda - Formulario de Registro */}
        <div className="flex-1 flex flex-col justify-start px-8 lg:px-16 pt-8">
          {/* Headline Principal */}
          <h1
            className="mb-8 text-center lg:text-left leading-tight"
            style={{
              fontSize: typography.styles["title-1"].fontSize,
              fontWeight: typography.styles["title-1"].fontWeight,
              lineHeight: typography.styles["title-1"].lineHeight,
              letterSpacing: typography.styles["title-1"].letterSpacing,
              fontFamily: typography.styles["title-1"].fontFamily.join(", "),
              marginBottom: spacingSystem.base[8],
              color: colors.interface.text.primary,
            }}
          >
            Create your account chef
          </h1>

          {/* Formulario de Registro */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-white font-medium"
                style={{
                  fontSize: typography.styles["body"].fontSize,
                  fontWeight: typography.styles["body"].fontWeight,
                  color: colors.interface.text.primary,
                }}
              >
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="chef"
                required
                className="w-80 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  fontSize: typography.styles["caption"].fontSize,
                  fontFamily:
                    typography.styles["caption"].fontFamily.join(", "),
                  fontWeight: typography.styles["caption"].fontWeight,
                  lineHeight: typography.styles["caption"].lineHeight,
                  letterSpacing: typography.styles["caption"].letterSpacing,
                }}
              />
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-white font-medium"
                style={{
                  fontSize: typography.styles["body"].fontSize,
                  fontWeight: typography.styles["body"].fontWeight,
                  color: colors.interface.text.primary,
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="chef@example.com"
                required
                className="w-80 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  fontSize: typography.styles["caption"].fontSize,
                  fontFamily:
                    typography.styles["caption"].fontFamily.join(", "),
                  fontWeight: typography.styles["caption"].fontWeight,
                  lineHeight: typography.styles["caption"].lineHeight,
                  letterSpacing: typography.styles["caption"].letterSpacing,
                }}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-white font-medium"
                style={{
                  fontSize: typography.styles["body"].fontSize,
                  fontWeight: typography.styles["body"].fontWeight,
                  color: colors.interface.text.primary,
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-80 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  fontSize: typography.styles["caption"].fontSize,
                  fontFamily:
                    typography.styles["caption"].fontFamily.join(", "),
                  fontWeight: typography.styles["caption"].fontWeight,
                  lineHeight: typography.styles["caption"].lineHeight,
                  letterSpacing: typography.styles["caption"].letterSpacing,
                }}
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Register now"}
              </Button>
              <Button href="/" variant="secondary">
                cancel
              </Button>
            </div>

            {/* Link para login */}
            <div className="pt-4">
              <span className="text-gray-300">Already have an account? </span>
              <a
                href="/auth/login"
                className="ml-2 text-green-400 hover:text-green-300 underline cursor-pointer"
                style={{ color: colors.brand.primary[500] }}
              >
                Login here
              </a>
            </div>
          </form>
        </div>

        {/* Columna Derecha - Imagen Gourmet */}
        <div className="flex-1 flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <div
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px]"
            style={{
              width: "480px",
              height: "480px",
            }}
          >
            <Image
              src="/images/plate.png"
              alt="Gourmet dish with steak and vegetables"
              fill
              className="object-cover rounded-2xl"
              style={{
                borderRadius: spacingSystem.components.card.borderRadius,
              }}
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
