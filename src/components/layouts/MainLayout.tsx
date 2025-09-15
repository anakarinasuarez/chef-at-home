import React from "react";
import Nav from "@/components/Nav";
import Image from "next/image";
import plateImage from "@/assets/images/plate.png";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showMenu?: boolean;
  userName?: string;
  currentPage?: "create" | "generated" | "my-recipes";
}

export default function MainLayout({
  children,
  className = "",
  showMenu = false,
  userName = "Anna",
  currentPage = "create",
}: MainLayoutProps) {
  return (
    <>
      {/* Navigation */}
      <Nav 
        showMenu={showMenu}
        userName={userName}
        currentPage={currentPage}
      />

      {/* Contenido Principal - Layout de 2 columnas */}
      <main className={`flex min-h-[calc(100vh-80px)] pt-16 ${className}`}>
        {/* Columna Izquierda - Contenido específico de cada página */}
        <div className="flex-1 flex flex-col justify-start px-8 lg:px-16 py-12">
          {children}
        </div>

        {/* Columna Derecha - Imagen Gourmet */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12">
          <div className="relative w-full max-w-lg">
            <Image
              src={plateImage}
              alt="Gourmet dish"
              className="w-full h-auto rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </main>
    </>
  );
}
