"use client";

import { Toaster } from "react-hot-toast";
import { useToastStore } from "@/stores";
import { useEffect } from "react";

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);

  useEffect(() => {
    // Listen to toast store changes and trigger react-hot-toast
    toasts.forEach((toast) => {
      const { message, type, duration, id } = toast;
      
      // Import toast dynamically to avoid SSR issues
      import('react-hot-toast').then(({ toast: toastFn }) => {
        switch (type) {
          case 'success':
            toastFn.success(message, { duration, id });
            break;
          case 'error':
            toastFn.error(message, { duration, id });
            break;
          case 'warning':
            toastFn(message, { type: 'loading', duration, id });
            break;
          case 'info':
            toastFn(message, { type: 'custom', duration, id });
            break;
        }
      });
    });
  }, [toasts]);
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          maxWidth: "400px",
        },
        // Success toast - GREEN
        success: {
          duration: 3000,
          style: {
            background: "#10b981",
            color: "#ffffff",
            border: "1px solid #059669",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            maxWidth: "400px",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#10b981",
          },
        },
        // Error toast - RED
        error: {
          duration: 5000,
          style: {
            background: "#ef4444",
            color: "#ffffff",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            maxWidth: "400px",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#ef4444",
          },
        },
        // Loading toast - BLUE
        loading: {
          duration: Infinity,
          style: {
            background: "#3b82f6",
            color: "#ffffff",
            border: "1px solid #2563eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            maxWidth: "400px",
          },
        },
        // Custom toast - GRAY (for info/suggestions)
        custom: {
          duration: 4000,
          style: {
            background: "#6b7280",
            color: "#ffffff",
            border: "1px solid #4b5563",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            maxWidth: "400px",
          },
        },
      }}
    />
  );
}
