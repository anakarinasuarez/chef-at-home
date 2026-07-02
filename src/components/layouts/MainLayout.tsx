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
  userName = "",
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

      {/* Main content — stacked on mobile, 2-column split on desktop */}
      <main
        className={`flex flex-col lg:flex-row min-h-[calc(100vh-72px)] pt-[72px] ${className}`}
      >
        {/* Content column (page-specific) */}
        <div className="flex-1 flex flex-col justify-start px-lg lg:px-3xl py-xl lg:py-2xl">
          {children}
        </div>

        {/* Illustration column — desktop only; mobile screens place their own art */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-lg lg:px-3xl py-xl lg:py-2xl">
          <div className="relative w-full max-w-form">
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
