import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Recipe Options',
  robots: { index: false, follow: false },
};

export default function RecipesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
