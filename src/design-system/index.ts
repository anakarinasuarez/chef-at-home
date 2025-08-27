/**
 * Design System - Chef at Home
 * Sistema de diseño completo y profesional
 *
 * Este archivo exporta todos los tokens y utilidades del Design System
 * para mantener consistencia en toda la aplicación.
 */

// Importar todos los sistemas del Design System
import { colors } from "./colors";
import { typography } from "./typography";
import { spacingSystem } from "./spacing";
import { breakpointSystem } from "./breakpoints";

// Re-exportar los objetos principales para conveniencia
export { colors } from "./colors";
export { typography } from "./typography";
export { spacingSystem } from "./spacing";
export { breakpointSystem } from "./breakpoints";

// Exportar tipos principales desde sus archivos correspondientes
export type {
  BaseColor,
  SemanticColor,
  BrandColor,
  InterfaceColor,
  AppColor,
} from "./colors";

export type {
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  FontFamily,
  TextStyle,
} from "./typography";

export type {
  SpacingSize,
  ComponentSpacing,
  ResponsiveBreakpoint,
} from "./spacing";

export type {
  Breakpoint,
  BreakpointValue,
  Container,
  MediaQuery,
} from "./breakpoints";

// Función helper para obtener tokens del Design System
export const getDesignToken = (
  category: "colors" | "typography" | "spacing" | "breakpoints",
  token: string,
  variant?: string
) => {
  switch (category) {
    case "colors":
      if (variant) {
        return (colors as any)[variant]?.[token] || colors.brand.primary[500];
      }
      return (colors as any)[token] || colors.brand.primary[500];

    case "typography":
      return (
        typography.styles[token as keyof typeof typography.styles] ||
        typography.styles["body-medium"]
      );

    case "spacing":
      return (
        spacingSystem.base[token as keyof typeof spacingSystem.base] ||
        spacingSystem.base[4]
      );

    case "breakpoints":
      return (
        breakpointSystem.breakpoints[
          token as keyof typeof breakpointSystem.breakpoints
        ] || breakpointSystem.breakpoints.md
      );

    default:
      return null;
  }
};

// Función helper para crear estilos consistentes
export const createComponentStyle = (config: {
  colors?: Record<string, any>;
  typography?: keyof typeof typography.styles;
  spacing?: Record<string, any>;
  responsive?: Record<string, any>;
}) => {
  const style: Record<string, any> = {};

  // Aplicar colores
  if (config.colors) {
    Object.assign(style, config.colors);
  }

  // Aplicar tipografía
  if (config.typography) {
    const textStyle = typography.styles[config.typography];
    if (textStyle) {
      Object.assign(style, {
        fontSize: textStyle.fontSize,
        fontWeight: textStyle.fontWeight,
        lineHeight: textStyle.lineHeight,
        letterSpacing: textStyle.letterSpacing,
        fontFamily: textStyle.fontFamily.join(", "),
      });
    }
  }

  // Aplicar espaciado
  if (config.spacing) {
    Object.assign(style, config.spacing);
  }

  // Aplicar estilos responsive
  if (config.responsive) {
    Object.assign(style, config.responsive);
  }

  return style;
};

// Función helper para crear variantes de componentes
export const createComponentVariants = <T extends Record<string, any>>(
  baseStyle: T,
  variants: Record<string, Partial<T>>
) => {
  return {
    base: baseStyle,
    variants,
    // Función para obtener estilos combinados
    getStyle: (variant?: string): T => {
      if (variant && variants[variant]) {
        return { ...baseStyle, ...variants[variant] };
      }
      return baseStyle;
    },
  };
};

// Exportar el Design System completo
export const designSystem = {
  colors,
  typography,
  spacing: spacingSystem,
  breakpoints: breakpointSystem,
  helpers: {
    getDesignToken,
    createComponentStyle,
    createComponentVariants,
  },
} as const;

// Tipo para el Design System completo
export type DesignSystem = typeof designSystem;

// Exportar por defecto
export default designSystem;
