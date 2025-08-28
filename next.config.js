/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Configuración para Docker
  output: "standalone", // Necesario para Docker

  // 🖼️ Optimización de imágenes - Simplificada para desarrollo
  images: {
    unoptimized: true, // Desactivar optimización para desarrollo
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
