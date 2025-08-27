/**
 * Design System - Sistema de Tipografía
 * Chef at Home - Escalas tipográficas profesionales y accesibles
 */

// Escalas de tamaño de fuente (basadas en escala 1.25 - Major Third)
export const fontSizes = {
  // Escalas pequeñas
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  
  // Escalas medianas
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  
  // Escalas grandes
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
  '8xl': '6rem',     // 96px
  '9xl': '8rem',     // 128px
} as const;

// Pesos de fuente
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Alturas de línea
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
  // Alturas específicas para títulos
  'heading-tight': '1.1',
  'heading-normal': '1.2',
  'heading-relaxed': '1.3',
} as const;

// Espaciado entre letras
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Familias de fuentes
export const fontFamilies = {
  sans: [
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
    'Poppins',
    'Inter',
    'system-ui',
    'sans-serif',
  ],
} as const;

// Estilos de texto predefinidos
export const textStyles = {
  // Estilos de display (títulos principales)
  'display-1': {
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamilies.display,
  },
  'display-2': {
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamilies.display,
  },
  'display-3': {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-tight'],
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamilies.display,
  },
  
  // Estilos de heading
  'heading-1': {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['heading-normal'],
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.sans,
  },
  'heading-2': {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['heading-normal'],
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.sans,
  },
  'heading-3': {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['heading-normal'],
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.sans,
  },
  'heading-4': {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['heading-normal'],
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.sans,
  },
  
  // Estilos de body
  'body-large': {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.sans,
  },
  'body-medium': {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.sans,
  },
  'body-small': {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamilies.sans,
  },
  
  // Estilos de caption
  'caption': {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.sans,
  },
  
  // Estilos de botón
  'button-large': {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.sans,
  },
  'button-medium': {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.sans,
  },
  'button-small': {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamilies.sans,
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
