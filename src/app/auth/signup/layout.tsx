import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your free Chef at Home account and start turning ingredients into AI-generated recipes.',
  alternates: { canonical: '/auth/signup' },
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
