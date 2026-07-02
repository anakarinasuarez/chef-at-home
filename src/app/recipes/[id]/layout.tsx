import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Recipe',
  robots: { index: false, follow: false },
};

export default function RecipeDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
