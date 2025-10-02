'use client';

import { useToastStore } from '@/stores';
import { useEffect, useRef } from 'react';
import { toast as hotToast, Toaster } from 'react-hot-toast';

export function ToastProvider() {
  const toasts = useToastStore(state => state.toasts);
  const processedToasts = useRef(new Set<string>());

  useEffect(() => {
    // Procesar solo nuevos toasts
    toasts.forEach(zToast => {
      if (!processedToasts.current.has(zToast.id)) {
        processedToasts.current.add(zToast.id);

        // Mostrar el toast según su tipo
        switch (zToast.type) {
          case 'success':
            hotToast.success(zToast.message, {
              duration: zToast.duration,
              id: zToast.id,
            });
            break;
          case 'error':
            hotToast.error(zToast.message, {
              duration: zToast.duration || 5000,
              id: zToast.id,
            });
            break;
          case 'warning':
            hotToast(zToast.message, {
              icon: '⚠️',
              duration: zToast.duration || 4000,
              id: zToast.id,
            });
            break;
          case 'info':
            hotToast(zToast.message, {
              icon: 'ℹ️',
              duration: zToast.duration || 4000,
              id: zToast.id,
            });
            break;
        }
      }
    });

    // Limpiar toasts procesados cuando se eliminan del store
    const currentIds = new Set(toasts.map(t => t.id));
    Array.from(processedToasts.current).forEach(id => {
      if (!currentIds.has(id)) {
        processedToasts.current.delete(id);
        hotToast.dismiss(id);
      }
    });
  }, [toasts]);
  return (
    <Toaster
      position='top-right'
      reverseOrder={false}
      gutter={8}
      containerClassName=''
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '400px',
        },
        // Success toast - GREEN
        success: {
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#ffffff',
            border: '1px solid #059669',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
          },
        },
        // Error toast - RED
        error: {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: '#ffffff',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
          },
        },
        // Loading toast - BLUE
        loading: {
          duration: Infinity,
          style: {
            background: '#3b82f6',
            color: '#ffffff',
            border: '1px solid #2563eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
          },
        },
        // Custom toast - GRAY (for info/suggestions)
        custom: {
          duration: 4000,
          style: {
            background: '#6b7280',
            color: '#ffffff',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
          },
        },
      }}
    />
  );
}
