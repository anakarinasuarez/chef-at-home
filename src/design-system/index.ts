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
        return (
          (colors as unknown as Record<string, Record<string, string>>)[
            variant
          ]?.[token] || colors.brand.primary[500]
        );
      }
      return (
        (colors as unknown as Record<string, string>)[token] ||
        colors.brand.primary[500]
      );

    case "typography":
      return (
        typography.styles[token as keyof typeof typography.styles] ||
        typography.styles["body-medium"]
      );

    case "spacing":
      // Solucionar el error de tipos con un cast más seguro
      const spacingToken = token as unknown as keyof typeof spacingSystem.base;
      return spacingSystem.base[spacingToken] || spacingSystem.base[4];

    case "breakpoints":
      const breakpointToken =
        token as unknown as keyof typeof breakpointSystem.breakpoints;
      return (
        breakpointSystem.breakpoints[breakpointToken] ||
        breakpointSystem.breakpoints.md
      );

    default:
      return null;
  }
};

// Función helper para crear estilos consistentes
export const createComponentStyle = (config: {
  colors?: Record<string, string>;
  typography?: keyof typeof typography.styles;
  spacing?: Record<string, string | number>;
  responsive?: Record<string, string | number>;
}) => {
  const style: Record<string, string | number> = {};

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
export const createComponentVariants = <
  T extends Record<string, string | number>
>(
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
