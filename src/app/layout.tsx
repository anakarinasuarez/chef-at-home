import { ErrorBoundaryAdvanced } from '@/components/ErrorBoundaryAdvanced';
import { RecipeCleanup } from '@/components/RecipeCleanup';
import { ToastProvider } from '@/components/ui/ToastProvider';
import '@/utils/manualCleanup'; // Manual cleanup for debugging
import '@/utils/migrateRecipes'; // Auto-migrate old recipes
import type { Metadata } from 'next';
import { Alegreya, Inter, Poppins } from 'next/font/google';
import './globals.css';

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
  title: 'Chef at Home',
  description: 'Create delicious recipes with AI',
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
