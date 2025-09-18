"use client";

import Link from "next/link";
import { colors, typography } from "@/design-system";
import { ReactNode } from "react";

interface ButtonProps {
  href?: string;
  variant: "primary" | "secondary" | "tertiary";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  href,
  variant,
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  size = "md",
  fullWidth = false,
}: ButtonProps) {
  // Definir estilos base para cada variante según la imagen
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.brand.primary[500], // Verde claro sólido (fila 1)
          color: colors.interface.text.inverse, // Texto blanco
          border: "none",
        };
      case "secondary":
        return {
          backgroundColor: "transparent", // Fondo transparente (fila 3)
          color: colors.brand.primary[500], // Texto verde
          border: `1px solid ${colors.brand.primary[500]}`, // Borde verde
        };
      case "tertiary":
        return {
          backgroundColor: "transparent", // Sin fondo (fila 5)
          color: colors.brand.primary[500], // Texto verde claro
          border: "none",
        };
      default:
        return {};
    }
  };

  // Definir estilos de hover para cada variante
  const getHoverStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.brand.primary[600], // Verde más oscuro (fila 2)
          color: colors.interface.text.inverse, // Texto blanco
        };
      case "secondary":
        return {
          backgroundColor: colors.brand.secondary[500], // Verde muy claro (fila 4)
          color: colors.brand.primary[600], // Texto verde más oscuro
        };
      case "tertiary":
        return {
          backgroundColor: "transparent", // Sin cambio de fondo
          color: colors.brand.primary[600], // Texto verde más oscuro (fila 6)
        };
      default:
        return {};
    }
  };

  // Definir tamaños
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          padding: "8px 16px",
          fontSize: "14px",
          minHeight: "36px",
        };
      case "md":
        return {
          padding: "12px 24px",
          fontSize: "16px",
          minHeight: "44px",
        };
      case "lg":
        return {
          padding: "16px 32px",
          fontSize: "18px",
          minHeight: "52px",
        };
      default:
        return {};
    }
  };

  const baseStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    borderRadius: "8px", // Border radius redondeado como en la imagen
    fontWeight: typography.styles["button"].fontWeight,
    lineHeight: typography.styles["button"].lineHeight,
    fontFamily: typography.styles["button"].fontFamily.join(", "),
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    width: fullWidth ? "100%" : "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    textAlign: "center" as const,
    outline: "none",
    textDecoration: "none", // Para links
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const target = e.currentTarget;
    const hoverStyles = getHoverStyles();
    if (hoverStyles.backgroundColor) {
      target.style.backgroundColor = hoverStyles.backgroundColor;
    }
    if (hoverStyles.color) {
      target.style.color = hoverStyles.color;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const target = e.currentTarget;
    const normalStyles = getVariantStyles();
    if (normalStyles.backgroundColor) {
      target.style.backgroundColor = normalStyles.backgroundColor;
    }
    if (normalStyles.color) {
      target.style.color = normalStyles.color;
    }
  };

  // Si es un botón de submit o no tiene href, renderizar como button
  if (type === "submit" || !href) {
    return (
      <button
        type={type}
        disabled={disabled}
        className={`button button-${variant} button-${size} ${className}`}
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
      className={`button button-${variant} button-${size} ${className}`}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
}
