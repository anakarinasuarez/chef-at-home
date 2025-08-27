/**
 * Design System - Sistema de Breakpoints
 * Chef at Home - Breakpoints responsive y media queries consistentes
 */

// Breakpoints base (mobile-first approach)
export const breakpoints = {
  // Móvil pequeño
  xs: '320px',
  
  // Móvil
  sm: '640px',
  
  // Tablet pequeño
  md: '768px',
  
  // Tablet
  lg: '1024px',
  
  // Desktop pequeño
  xl: '1280px',
  
  // Desktop
  '2xl': '1536px',
  
  // Desktop grande
  '3xl': '1920px',
} as const;

// Breakpoints como números para cálculos
export const breakpointValues = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

// Media queries predefinidas
export const mediaQueries = {
  // Móvil pequeño y superior
  xs: `@media (min-width: ${breakpoints.xs})`,
  
  // Móvil y superior
  sm: `@media (min-width: ${breakpoints.sm})`,
  
  // Tablet pequeño y superior
  md: `@media (min-width: ${breakpoints.md})`,
  
  // Tablet y superior
  lg: `@media (min-width: ${breakpoints.lg})`,
  
  // Desktop pequeño y superior
  xl: `@media (min-width: ${breakpoints.xl})`,
  
  // Desktop y superior
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Desktop grande y superior
  '3xl': `@media (min-width: ${breakpoints['3xl']})`,
  
  // Solo móvil (hasta tablet pequeño)
  mobileOnly: `@media (max-width: ${breakpointValues.md - 1}px)`,
  
  // Solo tablet (desde tablet pequeño hasta desktop)
  tabletOnly: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpointValues.lg - 1}px)`,
  
  // Solo desktop (desde desktop pequeño)
  desktopOnly: `@media (min-width: ${breakpoints.xl})`,
  
  // Orientación
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
  
  // Preferencias del usuario
  prefersReducedMotion: '@media (prefers-reduced-motion: reduce)',
  prefersDarkMode: '@media (prefers-color-scheme: dark)',
  prefersLightMode: '@media (prefers-color-scheme: light)',
} as const;

// Contenedores responsive
export const containers = {
  // Contenedor pequeño (móvil)
  sm: '640px',
  
  // Contenedor mediano (tablet)
  md: '768px',
  
  // Contenedor grande (desktop pequeño)
  lg: '1024px',
  
  // Contenedor extra grande (desktop)
  xl: '1280px',
  
  // Contenedor máximo (desktop grande)
  '2xl': '1536px',
  
  // Contenedor completo (100% del viewport)
  full: '100%',
} as const;

// Función helper para crear media queries personalizadas
export const createMediaQuery = (
  minWidth?: number,
  maxWidth?: number,
  orientation?: 'landscape' | 'portrait'
) => {
  let query = '@media ';
  
  if (minWidth && maxWidth) {
    query += `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;
  } else if (minWidth) {
    query += `(min-width: ${minWidth}px)`;
  } else if (maxWidth) {
    query += `(max-width: ${maxWidth}px)`;
  }
  
  if (orientation) {
    if (minWidth || maxWidth) {
      query += ' and ';
    }
    query += `(orientation: ${orientation})`;
  }
  
  return query;
};

// Función helper para obtener breakpoint actual
export const getCurrentBreakpoint = (width: number): keyof typeof breakpoints => {
  if (width >= breakpointValues['3xl']) return '3xl';
  if (width >= breakpointValues['2xl']) return '2xl';
  if (width >= breakpointValues.xl) return 'xl';
  if (width >= breakpointValues.lg) return 'lg';
  if (width >= breakpointValues.md) return 'md';
  if (width >= breakpointValues.sm) return 'sm';
  return 'xs';
};

// Función helper para verificar si estamos en un breakpoint específico
export const isBreakpoint = (
  width: number,
  breakpoint: keyof typeof breakpoints,
  direction: 'up' | 'down' = 'up'
): boolean => {
  const currentValue = breakpointValues[breakpoint];
  
  if (direction === 'up') {
    return width >= currentValue;
  } else {
    return width < currentValue;
  }
};

// Función helper para obtener el contenedor apropiado
export const getContainerWidth = (breakpoint: keyof typeof breakpoints): string => {
  switch (breakpoint) {
    case 'xs':
    case 'sm':
      return containers.sm;
    case 'md':
      return containers.md;
    case 'lg':
      return containers.lg;
    case 'xl':
      return containers.xl;
    case '2xl':
    case '3xl':
      return containers['2xl'];
    default:
      return containers.full;
  }
};

// Exportar todo como un objeto unificado
export const breakpointSystem = {
  breakpoints,
  values: breakpointValues,
  mediaQueries,
  containers,
  helpers: {
    createMediaQuery,
    getCurrentBreakpoint,
    isBreakpoint,
    getContainerWidth,
  },
} as const;

// Tipos TypeScript
export type Breakpoint = keyof typeof breakpoints;
export type BreakpointValue = keyof typeof breakpointValues;
export type Container = keyof typeof containers;
export type MediaQuery = keyof typeof mediaQueries;
