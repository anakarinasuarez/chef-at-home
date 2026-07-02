import type { MetadataRoute } from 'next';

const siteUrl = 'https://chef-at-home-v1.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/create', '/my-recipes', '/recipes'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
