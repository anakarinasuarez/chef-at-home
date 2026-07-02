import type { MetadataRoute } from 'next';

const siteUrl = 'https://chef-at-home-v1.vercel.app';

// Only public, indexable routes. App content (create/recipes/my-recipes) is
// client-rendered behind auth, so it's intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/auth/login', '/auth/signup'];
  return routes.map(path => ({
    url: `${siteUrl}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.6,
  }));
}
