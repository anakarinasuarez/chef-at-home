"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { colors, typography, spacingSystem } from "@/design-system";
import Button from "@/components/Button";
import Nav from "@/components/Nav";
import Image from "next/image";
import plateImage from "@/assets/images/plate.png"; // Import the image

export default function LoginPage() {
  const [formData, setFormData] = useState({
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el login");
      }

      // Login exitoso
      alert("¡Login exitoso!");
      router.push("/dashboard"); // Redirigir al dashboard
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error en el login");
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
        {/* Columna Izquierda - Formulario de Login */}
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
            Welcome back chef
          </h1>

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
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
                className="w-80 px-3 py-2 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  fontSize: typography.styles["body"].fontSize,
                  fontFamily: typography.styles["body"].fontFamily.join(", "),
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
                className="w-80 px-3 py-2 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  fontSize: typography.styles["body"].fontSize,
                  fontFamily: typography.styles["body"].fontFamily.join(", "),
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
                {isLoading ? "Iniciando sesión..." : "Login"}
              </Button>
              <Button href="/" variant="secondary">
                cancel
              </Button>
            </div>

            {/* Link para registro */}
            <div className="pt-4">
              <span className="text-gray-300">
                Don&apos;t have an account?
              </span>
              <a
                href="/auth/signup"
                className="ml-2 text-green-400 hover:text-green-300 underline cursor-pointer"
                style={{ color: colors.brand.primary[500] }}
              >
                Sign up here
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
              src={plateImage}
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
