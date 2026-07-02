import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Create a Recipe',
  robots: { index: false, follow: false },
};

export default function CreateLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
