import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'My Recipes',
  robots: { index: false, follow: false },
};

export default function MyRecipesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
