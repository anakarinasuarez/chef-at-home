'use client';

import Button from '@/components/Button';
import MainLayout from '@/components/layouts/MainLayout';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { colors, typography } from '@/design-system';
import { useAuthUnified } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isLoading, initializeAuth } = useAuthUnified();
  const router = useRouter();

  // Debug logs
  console.log('🏠 HomePage - user:', user);
  console.log('🏠 HomePage - isLoading:', isLoading);

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    console.log('🏠 HomePage - Initializing auth...');
    initializeAuth();

    // Verificar si hay usuario en localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      console.log('🏠 HomePage - Stored user in localStorage:', storedUser);
    }
  }, [initializeAuth]);

  // Si el usuario está logueado, redirigir a /create
  useEffect(() => {
    console.log('🏠 HomePage useEffect - user:', user, 'isLoading:', isLoading);
    if (user && !isLoading) {
      console.log('🏠 HomePage - Redirecting to /create');
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
      {/* Título Principal */}
      <h1
        className='mb-8 text-center lg:text-left leading-tight'
        style={{
          fontSize: typography.styles['title-1'].fontSize,
          fontWeight: typography.styles['title-1'].fontWeight,
          lineHeight: typography.styles['title-1'].lineHeight,
          letterSpacing: typography.styles['title-1'].letterSpacing,
          color: colors.interface.text.primary,
        }}
      >
        Turn your everyday ingredients
        <br />
        into gourmet masterpieces with
        <br />
        AI driven recipes
      </h1>

      {/* Lista de características */}
      <div className='mb-8 space-y-4'>
        <div
          className='flex items-start space-x-3'
          style={{
            fontSize: typography.styles['body-large'].fontSize,
            fontWeight: typography.styles['body-large'].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          <span className='text-primary-500 text-xl'>•</span>
          <span>
            Reduce waste, save money, and
            <br />
            cook like a pro
          </span>
        </div>
        <div
          className='flex items-start space-x-3'
          style={{
            fontSize: typography.styles['body-large'].fontSize,
            fontWeight: typography.styles['body-large'].fontWeight,
            color: colors.interface.text.primary,
          }}
        >
          <span className='text-primary-500 text-xl'>•</span>
          <span>
            Unleash your inner chef and create
            <br />
            magic in the kitchen!
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className='flex flex-col sm:flex-row gap-4 mt-8'>
        <Button variant='primary' onClick={() => router.push('/auth/signup')}>
          Sign up free
        </Button>
        <Button variant='secondary' onClick={() => router.push('/auth/login')}>
          Login
        </Button>
      </div>
    </MainLayout>
  );
}
