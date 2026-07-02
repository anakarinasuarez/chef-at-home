import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to Chef at Home to create and save AI-generated recipes.',
  alternates: { canonical: '/auth/login' },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
