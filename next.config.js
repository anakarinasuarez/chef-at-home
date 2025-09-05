/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Configuración para Docker
  output: "standalone", // Necesario para Docker

  // 🖼️ Optimización de imágenes - Configuración estándar
  images: {
    unoptimized: false, // Habilitar optimización de imágenes
    // Permitir importaciones desde src/assets
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // 🔧 Configuración experimental
  experimental: {
    // Optimizaciones para producción
    optimizeCss: true,
    scrollRestoration: true,
  },

  // 🚀 Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // 🔒 Configuración de seguridad
  poweredByHeader: false,

  // 🚨 Suprimir warnings de hidratación durante desarrollo
  onDemandEntries: {
    // Período de tiempo que una página debe permanecer inactiva antes de ser eliminada
    maxInactiveAge: 25 * 1000,
    // Número de páginas que deben mantenerse simultáneamente
    pagesBufferLength: 2,
  },

  // 🔇 Suprimir warnings de hidratación en consola
  reactStrictMode: false,

  // 🚀 Configuración específica para App Router
  typescript: {
    // Ignorar errores de TypeScript durante el build
    ignoreBuildErrors: false,
  },

  // 🔧 Configuración de webpack
  webpack: (config, { isServer }) => {
    // Configuración adicional de webpack si es necesaria
    return config;
  },
};

module.exports = nextConfig;
