// Sistema de colores de Chef at Home basado en el diseño de Figma
export const colors = {
  // Colores principales - inspirados en la imagen gourmet
  primary: {
    main: "#96B462", // Verde oliva elegante (Primary)
    hover: "#E8F0DB", // Verde oliva más oscuro (Primary hover)
    light: "#E8F0DB", // Verde muy claro/crema (Secondary hover)
  },

  // Colores del sistema
  background: "#131313", // Negro sólido (Background)
  onBackground: "#1F2937", // Gris muy oscuro/casi negro (onBackground)
  outline: "#F3F4F6", // Gris claro/off-white (Outline)
  danger: "#F43F5E", // Rojo-rosado (Danger)

  // Colores de texto
  text: {
    primary: "#FFFFFF", // Blanco para texto principal
    secondary: "#9CA3AF", // Gris para texto secundario
    muted: "#6B7280", // Gris más oscuro para texto atenuado
  },

  // Colores de estado
  success: "#10B981", // Verde para éxito
  warning: "#F59E0B", // Amarillo para advertencia
  info: "#3B82F6", // Azul para información

  // Colores de superficie
  surface: {
    primary: "#111827", // Gris muy oscuro para superficies principales
    secondary: "#1F2937", // Gris oscuro para superficies secundarias
    tertiary: "#374151", // Gris medio para superficies terciarias
  },

  // Colores de borde
  border: {
    light: "#374151", // Gris medio para bordes claros
    medium: "#4B5563", // Gris para bordes medios
    dark: "#6B7280", // Gris oscuro para bordes oscuros
  },

  // Colores gourmet inspirados en la imagen
  gourmet: {
    steak: "#8B4513", // Marrón del filete asado
    sauce: "#654321", // Marrón oscuro de la salsa
    vegetables: "#228B22", // Verde de las verduras
    plate: "#2F4F4F", // Gris del plato circular
  },

  // Colores de navegación
  nav: {
    background: "#1D1C1E", // Color del nav como en la imagen
    border: "#8B9A47", // Borde del nav
  },
} as const;

// Tipos para TypeScript
export type ColorScheme = typeof colors;
export type ColorKey = keyof ColorScheme;
