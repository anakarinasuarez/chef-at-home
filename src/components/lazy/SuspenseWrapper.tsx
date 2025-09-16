import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: string;
}

export function SuspenseWrapper({ 
  children, 
  fallback,
  minHeight = "200px" 
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <div 
      className="flex items-center justify-center w-full"
      style={{ minHeight }}
    >
      <LoadingSpinner size="medium" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

// Wrapper específico para páginas
export function PageSuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <SuspenseWrapper minHeight="400px">
      {children}
    </SuspenseWrapper>
  );
}

// Wrapper específico para componentes pequeños
export function ComponentSuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <SuspenseWrapper minHeight="100px">
      {children}
    </SuspenseWrapper>
  );
}
