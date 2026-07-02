import { ErrorBoundaryAdvanced } from '@/components/ErrorBoundaryAdvanced';
import { RecipeCleanup } from '@/components/RecipeCleanup';
import { ToastProvider } from '@/components/ui/ToastProvider';
import '@/utils/manualCleanup'; // Manual cleanup for debugging
import '@/utils/migrateRecipes'; // Auto-migrate old recipes
import type { Metadata, Viewport } from 'next';
import { Alegreya, Inter, Poppins } from 'next/font/google';
import './globals.css';

const siteUrl = 'https://chef-at-home-v1.vercel.app';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const alegreya = Alegreya({
  variable: '--font-alegreya',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Chef at Home — AI Recipes from Your Ingredients',
    template: '%s · Chef at Home',
  },
  description:
    'Turn your everyday ingredients into gourmet meals. Chef at Home generates delicious, personalized recipes with AI — reduce waste, save money, and cook like a pro.',
  applicationName: 'Chef at Home',
  keywords: [
    'AI recipes',
    'recipe generator',
    'cooking',
    'meal ideas',
    'ingredients to recipe',
    'chef at home',
  ],
  authors: [{ name: 'Chef at Home' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Chef at Home',
    title: 'Chef at Home — AI Recipes from Your Ingredients',
    description:
      'Turn your everyday ingredients into gourmet meals with AI-generated, personalized recipes.',
    url: siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chef at Home — AI Recipes from Your Ingredients',
    description:
      'Turn your everyday ingredients into gourmet meals with AI-generated, personalized recipes.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#131313' },
    { media: '(prefers-color-scheme: light)', color: '#f7f8f5' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-theme='dark' suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before paint to avoid a flash of the wrong mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('chef-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${alegreya.variable} antialiased`}
      >
        <ErrorBoundaryAdvanced
          level='critical'
          errorBoundaryName='RootLayout'
          allowRetry={true}
          showDetails={process.env.NODE_ENV === 'development'}
        >
          <RecipeCleanup />
          {children}
          <ToastProvider />
        </ErrorBoundaryAdvanced>
      </body>
    </html>
  );
}
