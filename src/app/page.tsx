"use client";

import { useRouter } from "next/navigation";
import { colors, typography, spacingSystem } from "@/design-system";
import Button from "@/components/Button";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuthUnified } from "@/hooks";
import { SuspenseWrapper } from "@/components/lazy/SuspenseWrapper";
import { LazyCreateRecipePage } from "@/components/lazy/LazyComponents";

export default function HomePage() {
  const { user, isLoading } = useAuthUnified();
  const router = useRouter();

  // Si el usuario está logueado, mostrar la interfaz de crear recetas con lazy loading
  if (user) {
    return (
      <SuspenseWrapper minHeight="600px">
        <LazyCreateRecipePage userName={user.name} user={user} />
      </SuspenseWrapper>
    );
  }

  // Si no está logueado, mostrar la página de landing
  return <LandingPage />;
}

// Componente para la página de landing (cuando no está logueado)
function LandingPage() {
  const router = useRouter();

  return (
    <MainLayout>
      {/* Título Principal */}
      <h1
        className="mb-8 text-center lg:text-left leading-tight"
        style={{
          fontSize: typography.styles["title-1"].fontSize,
          fontWeight: typography.styles["title-1"].fontWeight,
          lineHeight: typography.styles["title-1"].lineHeight,
          letterSpacing: typography.styles["title-1"].letterSpacing,
          color: colors.interface.text.primary,
        }}
      >
        Turn your everyday ingredients
        <br />
        into gourmet masterpieces with
        <br />
        AI driven recipes
      </h1>

      {/* Lista de características */}
      <div className="mb-8 space-y-4">
        <div
          className="flex items-start space-x-3"
          style={{
            fontSize: typography.styles["body-large"].fontSize,
            fontWeight: typography.styles["body-large"].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          <span className="text-primary-500 text-xl">•</span>
          <span>
            Reduce waste, save money, and
            <br />
            cook like a pro
          </span>
        </div>
        <div
          className="flex items-start space-x-3"
          style={{
            fontSize: typography.styles["body-large"].fontSize,
            fontWeight: typography.styles["body-large"].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          <span className="text-primary-500 text-xl">•</span>
          <span>
            Unleash your inner chef and create
            <br />
            magic in the kitchen!
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button variant="primary" onClick={() => router.push("/auth/signup")}>
          Sign up free
        </Button>
        <Button variant="secondary" onClick={() => router.push("/auth/login")}>
          Login
        </Button>
      </div>
    </MainLayout>
  );
}
