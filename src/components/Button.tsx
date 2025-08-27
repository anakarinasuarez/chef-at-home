"use client";

import Link from "next/link";
import { colors, typography, spacingSystem } from "@/design-system";

interface ButtonProps {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  href,
  variant,
  children,
  className = "",
}: ButtonProps) {
  const buttonStyles = {
    primary: {
      backgroundColor: colors.app.button.primary.background,
      color: colors.app.button.primary.text,
    },
    secondary: {
      backgroundColor: colors.app.button.secondary.background,
      color: colors.app.button.secondary.text,
      border: `1px solid ${colors.app.button.secondary.border}`,
    },
  };

  const hoverStyles = {
    primary: {
      backgroundColor: colors.app.button.primary.hover,
      color: colors.app.button.primary.hoverText,
    },
    secondary: {
      backgroundColor: colors.app.button.secondary.hover,
      color: colors.app.button.secondary.hoverText,
    },
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const hover = hoverStyles[variant];
    target.style.backgroundColor = hover.backgroundColor;
    target.style.color = hover.color;
    target.style.transform = "scale(1.05)";
    target.style.boxShadow = "0 4px 12px rgba(150, 180, 98, 0.3)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const normal = buttonStyles[variant];
    target.style.backgroundColor = normal.backgroundColor;
    target.style.color = normal.color;
    target.style.transform = "scale(1)";
    target.style.boxShadow = "none";
  };

  return (
    <Link
      href={href}
      className={`rounded-lg font-semibold text-lg transition-all duration-200 text-center hover:scale-105 ${className}`}
      style={{
        ...buttonStyles[variant],
        padding: spacingSystem.components.button.padding.large,
        borderRadius: spacingSystem.components.button.borderRadius,
        fontSize: typography.styles["button"].fontSize,
        fontWeight: typography.styles["button"].fontWeight,
        lineHeight: typography.styles["button"].lineHeight,
        letterSpacing: typography.styles["button"].letterSpacing,
        fontFamily: typography.styles["button"].fontFamily.join(", "),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
}
