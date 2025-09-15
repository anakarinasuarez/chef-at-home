import React from "react";
import Nav from "@/components/Nav";
import { colors } from "@/design-system";

interface RecipesLoadingStateProps {
  userName: string;
}

export default function RecipesLoadingState({
  userName,
}: RecipesLoadingStateProps) {
  return (
    <div
      className="h-screen overflow-hidden text-white"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <Nav showMenu={true} userName={userName} currentPage="generated" />
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Generating your recipes...</p>
        </div>
      </div>
    </div>
  );
}
