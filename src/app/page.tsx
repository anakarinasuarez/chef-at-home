'use client';

import Button from '@/components/Button';
import MainLayout from '@/components/layouts/MainLayout';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { colors } from '@/design-system';
import { useAuthUnified } from '@/hooks';
import plateImage from '@/assets/images/plate.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isLoading, initializeAuth } = useAuthUnified();
  const router = useRouter();

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Si el usuario está logueado, redirigir a /create
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/create');
    }
  }, [user, isLoading, router]);

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <MainLayout>
        <div className='flex items-center justify-center h-[calc(100vh-120px)]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p style={{ color: colors.interface.text.primary }}>Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Si no está logueado, mostrar landing page
  return (
    <PageErrorBoundary pageName='Home'>
      <LandingPage />
    </PageErrorBoundary>
  );
}

// Componente para la página de landing (cuando no está logueado)
function LandingPage() {
  const router = useRouter();

  return (
    <MainLayout>
      {/* Heading — centered on mobile, left-aligned in the desktop split */}
      <h1 className='mb-xl text-center text-[28px] font-bold leading-tight tracking-tight text-fg lg:mb-8 lg:text-left lg:text-[36px]'>
        Turn your everyday ingredients into gourmet masterpieces with AI driven
        recipes
      </h1>

      {/* Mobile illustration (desktop shows it in the side column) */}
      <div className='mb-xl flex justify-center lg:hidden'>
        <Image
          src={plateImage}
          alt='Gourmet dish'
          className='h-auto w-64'
          priority
        />
      </div>

      {/* Feature list */}
      <div className='mb-xl space-y-lg text-base text-fg'>
        <div className='flex items-start gap-sm'>
          <span className='text-xl leading-none text-primary'>•</span>
          <span>Reduce waste, save money, and cook like a pro</span>
        </div>
        <div className='flex items-start gap-sm'>
          <span className='text-xl leading-none text-primary'>•</span>
          <span>Unleash your inner chef and create magic in the kitchen!</span>
        </div>
      </div>

      {/* CTAs — full-width stacked on mobile, inline on desktop */}
      <div className='mt-xl flex flex-col gap-md sm:flex-row'>
        <Button
          variant='primary'
          fullWidth
          className='sm:w-auto'
          onClick={() => router.push('/auth/signup')}
        >
          Sign up free
        </Button>
        <Button
          variant='secondary'
          fullWidth
          className='sm:w-auto'
          onClick={() => router.push('/auth/login')}
        >
          Login
        </Button>
      </div>
    </MainLayout>
  );
}
