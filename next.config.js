/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // 🐳 Configuración para Docker
  output: 'standalone', // Necesario para Docker

  // 🖼️ Optimización de imágenes - Configuración para OpenAI DALL-E
  images: {
    unoptimized: false, // Habilitar optimización de imágenes
    // Permitir importaciones desde src/assets
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // OpenAI DALL-E URLs
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      // URLs de OpenAI API (backup)
      {
        protocol: 'https',
        hostname: 'api.openai.com',
        port: '',
        pathname: '/**',
      },
      // URLs de fallback (Unsplash como backup)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Picsum para imágenes de placeholder
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
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
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
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

  // 🔧 Configuración de webpack para optimización
  webpack: (config, { isServer, dev }) => {
    // Optimizaciones para producción
    if (!dev && !isServer) {
      // Configurar code splitting más agresivo
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
