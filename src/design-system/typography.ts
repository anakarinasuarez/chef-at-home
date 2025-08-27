/**
 * Design System - Sistema de Tipografía
 * Chef at Home - Escalas tipográficas profesionales y accesibles
 * 
 * Basado en las especificaciones exactas del usuario:
 * - Typeface: Poppins (principal)
 * - Weights: Bold, SemiBold, Medium, Regular
 * - Sizes: 36, 32, 24, 20, 18, 16, 14
 * - Spacing: -2 para títulos, 0 para body/caption/button
 */

// Escalas de tamaño de fuente (basadas en las especificaciones del usuario)
export const fontSizes = {
  // Escalas pequeñas
  xs: '0.875rem',   // 14px - Caption
  sm: '1rem',       // 16px - Body, Button
  base: '1rem',     // 16px
  
  // Escalas medianas
  lg: '1.125rem',   // 18px - Subtitle
  xl: '1.25rem',    // 20px - Title 3
  '2xl': '1.5rem',  // 24px - Title 2
  
  // Escalas grandes
  '3xl': '2rem',    // 32px - Title 1
  '4xl': '2.25rem', // 36px - Display
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem',  // 72px
  '8xl': '6rem',    // 96px
  '9xl': '8rem',    // 128px
} as const;

// Pesos de fuente (basados en las especificaciones del usuario)
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',     // Regular
  medium: '500',     // Medium
  semibold: '600',   // SemiBold
  bold: '700',       // Bold
  extrabold: '800',
  black: '900',
} as const;

// Alturas de línea
export const lineHeights = {
  none: '1',
  tight: '1.1',      // Para títulos
  snug: '1.2',       // Para títulos
  normal: '1.5',     // Para body
  relaxed: '1.625',
  loose: '2',
  // Alturas específicas para títulos
  'heading-tight': '1.1',
  'heading-normal': '1.2',
  'heading-relaxed': '1.3',
} as const;

// Espaciado entre letras (basado en las especificaciones del usuario)
export const letterSpacing = {
  tighter: '-0.02em',  // -2 (para títulos) - Ajustado para ser más visible
  tight: '-0.01em',    // -1
  normal: '0em',       // 0 (para body, caption, button)
  wide: '0.01em',      // +1
  wider: '0.02em',     // +2
  widest: '0.05em',    // +5
} as const;

// Familias de fuentes (Poppins como principal)
export const fontFamilies = {
  sans: [
    'var(--font-inter)',
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  serif: [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
  display: [
    'var(--font-poppins)',    // Fuente principal para display
    'Poppins',
    'Inter',
    'system-ui',
    'sans-serif',
  ],
  primary: [
    'var(--font-poppins)',    // Fuente principal para toda la app
    'Poppins',
    'Inter',
    'system-ui',
    'sans-serif',
  ],
} as const;

// Estilos de texto predefinidos (basados en la tabla del usuario)
export const textStyles = {
  // Estilos de display (títulos principales) - ESPECIFICACIONES EXACTAS
  'display': {
    fontSize: fontSizes['4xl'],        // 36px
    fontWeight: fontWeights.bold,      // Bold
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter, // -2
    fontFamily: fontFamilies.primary,
  },
  
  // Estilos de heading - ESPECIFICACIONES EXACTAS
  'title-1': {
    fontSize: fontSizes['3xl'],        // 32px
    fontWeight: fontWeights.bold,      // Bold
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter, // -2
    fontFamily: fontFamilies.primary,
  },
  'title-2': {
    fontSize: fontSizes['2xl'],        // 24px
    fontWeight: fontWeights.bold,      // Bold
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter, // -2
    fontFamily: fontFamilies.primary,
  },
  'title-3': {
    fontSize: fontSizes.xl,            // 20px
    fontWeight: fontWeights.semibold,  // SemiBold
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter, // -2
    fontFamily: fontFamilies.primary,
  },
  
  // Estilos de body - ESPECIFICACIONES EXACTAS
  'subtitle': {
    fontSize: fontSizes.lg,            // 18px
    fontWeight: fontWeights.medium,    // Medium
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter, // -2
    fontFamily: fontFamilies.primary,
  },
  'body': {
    fontSize: fontSizes.base,          // 16px
    fontWeight: fontWeights.normal,    // Regular
    lineHeight: lineHeights.normal,    // 1.5
    letterSpacing: letterSpacing.normal, // 0
    fontFamily: fontFamilies.primary,
  },
  
  // Estilos de caption y button - ESPECIFICACIONES EXACTAS
  'caption': {
    fontSize: fontSizes.xs,            // 14px
    fontWeight: fontWeights.normal,    // Regular
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal, // 0
    fontFamily: fontFamilies.primary,
  },
  'button': {
    fontSize: fontSizes.base,          // 16px
    fontWeight: fontWeights.medium,    // Medium
    lineHeight: lineHeights.none,      // 1
    letterSpacing: letterSpacing.normal, // 0
    fontFamily: fontFamilies.primary,
  },
  
  // Estilos legacy para compatibilidad
  'display-1': {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamilies.primary,
  },
  'display-2': {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamilies.primary,
  },
  'display-3': {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamilies.primary,
  },
  'heading-1': {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamilies.primary,
  },
  'heading-2': {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamilies.primary,
  },
  'heading-3': {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamilies.primary,
  },
  'heading-4': {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tighter,
    fontFamily: fontFamilies.primary,
  },
  'body-large': {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.primary,
  },
  'body-medium': {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.primary,
  },
  'body-small': {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.primary,
  },
  'button-large': {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.primary,
  },
  'button-medium': {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.primary,
  },
  'button-small': {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.primary,
  },
} as const;

// Función helper para aplicar estilos de texto
export const applyTextStyle = (style: keyof typeof textStyles) => {
  const textStyle = textStyles[style];
  return {
    fontSize: textStyle.fontSize,
    fontWeight: textStyle.fontWeight,
    lineHeight: textStyle.lineHeight,
    letterSpacing: textStyle.letterSpacing,
    fontFamily: textStyle.fontFamily.join(', '),
  };
};

// Exportar todo como un objeto unificado
export const typography = {
  sizes: fontSizes,
  weights: fontWeights,
  lineHeights,
  letterSpacing,
  families: fontFamilies,
  styles: textStyles,
  applyTextStyle,
} as const;

// Tipos TypeScript
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type FontFamily = keyof typeof fontFamilies;
export type TextStyle = keyof typeof textStyles;
