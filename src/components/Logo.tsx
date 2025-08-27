"use client";

import { ChefHat } from "lucide-react";
import { colors } from "@/lib/colors";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]}`}>
      <ChefHat className={`${iconSizes[size]} text-white`} />
      <span className="text-white">Chef</span>
      <span style={{ color: colors.primary.main }}>at</span>
      <span className="text-white">home</span>
    </div>
  );
}
