const path = require('path');

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Docker standalone output
  output: 'standalone',

  // Pin the workspace root (silences the multi-lockfile warning)
  outputFileTracingRoot: path.join(__dirname),

  // React strict mode surfaces real issues instead of hiding them
  reactStrictMode: true,

  // Image optimization — remote hosts we render from
  images: {
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // OpenAI DALL-E (legacy image source; being phased out for Gemini/stock)
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'api.openai.com', pathname: '/**' },
      // Coherent food photos via Pexels (free API key)
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      // Keyless coherent dish photos (TheMealDB)
      { protocol: 'https', hostname: 'www.themealdb.com', pathname: '/**' },
      // Free stock food images fallback (no API key)
      { protocol: 'https', hostname: 'loremflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },

  // Experimental performance features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },

  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
