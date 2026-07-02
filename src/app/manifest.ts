import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chef at Home — AI Recipes',
    short_name: 'Chef at Home',
    description:
      'Turn your everyday ingredients into gourmet meals with AI-generated, personalized recipes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#131313',
    theme_color: '#131313',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  };
}
