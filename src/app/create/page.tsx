"use client";

import { useAuthUnified } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateRecipePage from "@/components/pages/CreateRecipePage";

export default function CreatePage() {
  const { user, isLoading } = useAuthUnified();
  const router = useRouter();

  useEffect(() => {
    // Si no está logueado, redirigir al login
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Si no está logueado, no renderizar nada (ya se redirigió)
  if (!user) {
    return null;
  }

  // Renderizar la página de crear receta
  return <CreateRecipePage userName={user.name} user={user as any} />;
}
