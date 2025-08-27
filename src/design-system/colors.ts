/**
 * Design System - Sistema de Colores
 * Chef at Home - Paleta de colores profesional y accesible
 */

// Colores base del sistema
export const baseColors = {
  // Neutros
  white: '#FFFFFF',
  black: '#000000',
  
  // Grises
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

// Colores semánticos
export const semanticColors = {
  // Éxito
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  
  // Advertencia
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  
  // Error
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  
  // Información
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
} as const;

// Colores de marca (Chef at Home) - ACTUALIZADOS
export const brandColors = {
  // Verde principal (Chef) - COLOR EXACTO DEL USUARIO
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#96B462', // Verde oliva principal - COLOR EXACTO
    600: '#7A8F4E', // Verde oliva más oscuro
    700: '#5E7A3A',
    800: '#4A6126',
    900: '#3A4D1E',
  },
  
  // Verde secundario (hover) - COLOR EXACTO DEL USUARIO
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#E8F0DB', // Verde claro para hover - COLOR EXACTO
    600: '#D1E0C7',
    700: '#B8D0A8',
    800: '#9FC089',
    900: '#86B06A',
  },
} as const;

// Colores de interfaz - ACTUALIZADOS CON TUS COLORES
export const interfaceColors = {
  // Fondos - COLORES EXACTOS DEL USUARIO
  background: {
    primary: '#131313',    // Background principal - COLOR EXACTO
    secondary: '#1D1C1E',  // Background secundario - COLOR EXACTO
    tertiary: '#2A2A2A',
    surface: '#1D1C1E',    // Superficies usando tu color
    card: '#1D1C1E',       // Tarjetas usando tu color
  },
  
  // Textos
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    tertiary: '#6B7280',
    muted: '#4B5563',
    inverse: '#000000',
  },
  
  // Bordes - COLOR EXACTO DEL USUARIO
  border: {
    light: '#DBDEE1',      // Outline - COLOR EXACTO
    medium: '#9CA3AF',
    dark: '#6B7280',
    focus: '#96B462',      // Usando tu color primary
  },
  
  // Estados
  state: {
    hover: '#E8F0DB',      // Usando tu color secondary
    active: '#D1E0C7',
    disabled: '#1D1C1E',   // Usando tu color onBackground
    loading: '#6B7280',
  },
} as const;

// Colores específicos de la aplicación - ACTUALIZADOS
export const appColors = {
  // Navegación
  navigation: {
    background: '#1D1C1E',     // Usando tu color onBackground
    border: '#96B462',         // Usando tu color primary
    text: '#FFFFFF',
  },
  
  // Botones
  button: {
    primary: {
      background: '#96B462',    // Tu color primary
      text: '#FFFFFF',          // Texto blanco para contraste
      hover: '#E8F0DB',        // Tu color secondary en hover
      hoverText: '#131313',    // Texto oscuro en hover para contraste
    },
    secondary: {
      background: 'transparent',
      text: '#96B462',         // Tu color primary como texto
      border: '#96B462',       // Tu color primary como borde
      hover: '#E8F0DB',        // Tu color secondary en hover
      hoverText: '#131313',    // Texto oscuro en hover para contraste
    },
  },
  
  // Tarjetas de recetas
  recipeCard: {
    background: '#1D1C1E',     // Tu color onBackground
    border: '#DBDEE1',         // Tu color outline
    shadow: 'rgba(0, 0, 0, 0.25)',
  },
  
  // Elementos de formulario
  form: {
    background: '#FFFFFF',
    border: '#DBDEE1',         // Tu color outline
    focus: '#96B462',          // Tu color primary
    placeholder: '#9CA3AF',
  },
  
  // Enlaces
  link: {
    primary: '#96B462',        // Tu color primary
    hover: '#E8F0DB',          // Tu color secondary
    visited: '#7A8F4E',
  },
} as const;

// Exportar todos los colores como un objeto unificado
export const colors = {
  base: baseColors,
  semantic: semanticColors,
  brand: brandColors,
  interface: interfaceColors,
  app: appColors,
} as const;

// Tipos TypeScript para los colores
export type BaseColor = keyof typeof baseColors;
export type SemanticColor = keyof typeof semanticColors;
export type BrandColor = keyof typeof brandColors;
export type InterfaceColor = keyof typeof interfaceColors;
export type AppColor = keyof typeof appColors;

// Función helper para obtener colores con opacidad
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
