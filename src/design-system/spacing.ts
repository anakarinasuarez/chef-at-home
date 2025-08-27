/**
 * Design System - Sistema de Espaciado
 * Chef at Home - Escala de espaciado consistente y escalable
 */

// Escala base de espaciado (4px = 0.25rem)
export const spacing = {
  // Espaciado mínimo
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  
  // Espaciado pequeño
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  
  // Espaciado mediano
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  
  // Espaciado grande
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
  
  // Espaciado extra grande
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem',    // 384px
} as const;

// Espaciado específico para componentes
export const componentSpacing = {
  // Layout
  page: {
    padding: spacing[8],      // 32px
    maxWidth: '80rem',        // 1280px
    containerPadding: spacing[6], // 24px
  },
  
  // Navegación
  navigation: {
    padding: spacing[6],      // 24px
    height: spacing[16],      // 64px
    itemGap: spacing[4],     // 16px
  },
  
  // Tarjetas
  card: {
    padding: spacing[6],      // 24px
    gap: spacing[4],          // 16px
    borderRadius: spacing[3], // 12px
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  // Botones
  button: {
    padding: {
      small: `${spacing[2]} ${spacing[4]}`,    // 8px 16px
      medium: `${spacing[3]} ${spacing[6]}`,   // 12px 24px
      large: `${spacing[4]} ${spacing[8]}`,    // 16px 32px
    },
    gap: spacing[2],          // 8px
    borderRadius: spacing[2], // 8px
  },
  
  // Formularios
  form: {
    gap: spacing[6],          // 24px
    fieldGap: spacing[4],     // 16px
    labelGap: spacing[2],     // 8px
    inputPadding: spacing[3], // 12px
  },
  
  // Listas
  list: {
    gap: spacing[4],          // 16px
    itemPadding: spacing[4],  // 16px
  },
  
  // Modales
  modal: {
    padding: spacing[8],      // 32px
    gap: spacing[6],          // 24px
    maxWidth: '32rem',        // 512px
  },
} as const;

// Espaciado para breakpoints responsive
export const responsiveSpacing = {
  // Móvil (default)
  mobile: {
    page: spacing[4],         // 16px
    section: spacing[8],      // 32px
    component: spacing[4],    // 16px
  },
  
  // Tablet
  tablet: {
    page: spacing[6],         // 24px
    section: spacing[12],     // 48px
    component: spacing[6],    // 24px
  },
  
  // Desktop
  desktop: {
    page: spacing[8],         // 32px
    section: spacing[16],     // 64px
    component: spacing[8],    // 32px
  },
  
  // Desktop grande
  'desktop-lg': {
    page: spacing[10],        // 40px
    section: spacing[20],     // 80px
    component: spacing[10],   // 40px
  },
} as const;

// Función helper para espaciado responsive
export const getResponsiveSpacing = (
  type: keyof typeof responsiveSpacing.mobile,
  breakpoint: keyof typeof responsiveSpacing = 'mobile'
) => {
  return responsiveSpacing[breakpoint][type];
};

// Función helper para espaciado condicional
export const getSpacing = (size: keyof typeof spacing | number) => {
  if (typeof size === 'number') {
    return `${size * 0.25}rem`;
  }
  return spacing[size];
};

// Función helper para padding/margin responsive
export const getResponsivePadding = (
  mobile: keyof typeof spacing,
  tablet: keyof typeof spacing = mobile,
  desktop: keyof typeof spacing = tablet
) => {
  return {
    padding: spacing[mobile],
    '@media (min-width: 768px)': {
      padding: spacing[tablet],
    },
    '@media (min-width: 1024px)': {
      padding: spacing[desktop],
    },
  };
};

// Exportar todo como un objeto unificado
export const spacingSystem = {
  base: spacing,
  components: componentSpacing,
  responsive: responsiveSpacing,
  helpers: {
    getResponsiveSpacing,
    getSpacing,
    getResponsivePadding,
  },
} as const;

// Tipos TypeScript
export type SpacingSize = keyof typeof spacing;
export type ComponentSpacing = keyof typeof componentSpacing;
export type ResponsiveBreakpoint = keyof typeof responsiveSpacing;
