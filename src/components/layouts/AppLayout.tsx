import React from "react";
import Nav from "@/components/Nav";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppLayout({
  children,
  className = "",
}: AppLayoutProps) {
  return (
    <>
      {/* Navigation */}
      <Nav />

      {/* Contenido Principal */}
      <main className={`min-h-[calc(100vh-80px)] ${className}`}>
        {children}
      </main>
    </>
  );
}
