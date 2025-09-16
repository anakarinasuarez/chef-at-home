"use client";

import Link from "next/link";
import { colors, typography, spacingSystem } from "@/design-system";

interface ButtonProps {
  href?: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  href,
  variant,
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
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

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const target = e.currentTarget;
    const hover = hoverStyles[variant];
    target.style.backgroundColor = hover.backgroundColor;
    target.style.color = hover.color;
    target.style.transform = "scale(1.05)";
    target.style.boxShadow = "0 4px 12px rgba(150, 180, 98, 0.3)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const target = e.currentTarget;
    const normal = buttonStyles[variant];
    target.style.backgroundColor = normal.backgroundColor;
    target.style.color = normal.color;
    target.style.transform = "scale(1)";
    target.style.boxShadow = "none";
  };

  const baseStyles = {
    ...buttonStyles[variant],
    padding: "12px 24px", // Padding: vertical 12px, horizontal 24px
    borderRadius: "12px", // Border radius más redondeado
    fontSize: "16px", // Tamaño de texto 16px
    fontWeight: typography.styles["button"].fontWeight,
    lineHeight: typography.styles["button"].lineHeight,
    letterSpacing: "-0.01em", // Espaciado de letras más compacto
    fontFamily: typography.styles["button"].fontFamily.join(", "),
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%", // Asegurar que los botones ocupen todo el ancho disponible
    minHeight: "44px", // Altura mínima proporcional al padding
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out", // Transición suave
    textAlign: "center" as const, // Centrar texto
    border: "none", // Eliminar cualquier border por defecto
    outline: "none", // Eliminar outline por defecto
  };

  // Si es un botón de submit o no tiene href, renderizar como button
  if (type === "submit" || !href) {
    return (
      <button
        type={type}
        disabled={disabled}
        className={`custom-button custom-button-${variant} ${className}`}
        style={baseStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  // Si tiene href, renderizar como Link
  return (
    <Link
      href={href}
      className={`custom-button custom-button-${variant} ${className}`}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
}
