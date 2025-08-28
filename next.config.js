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
};

module.exports = nextConfig;
