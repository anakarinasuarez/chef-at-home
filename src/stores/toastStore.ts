import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

// Estado inicial estandarizado
const initialState = {
  toasts: [] as Toast[],
  maxToasts: 5,
};

export interface ToastState {
  // Estado
  toasts: Toast[];
  maxToasts: number;

  // Acciones básicas
  addToast: (toast: Omit<Toast, "id" | "timestamp">) => void;
  removeToast: (toastId: string) => void;
  clearToasts: () => void;
  updateToast: (toastId: string, updates: Partial<Toast>) => void;

  // Acciones específicas
  showSuccess: (message: string, options?: Partial<Toast>) => void;
  showError: (message: string, options?: Partial<Toast>) => void;
  showWarning: (message: string, options?: Partial<Toast>) => void;
  showInfo: (message: string, options?: Partial<Toast>) => void;

  // Utilidades
  getToastsByType: (type: Toast["type"]) => Toast[];
  dismissToast: (toastId: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  // Estado inicial
  ...initialState,

  // Acciones básicas
  addToast: (toastData) => {
    const toast: Toast = {
      ...toastData,
      id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      duration: toastData.duration || 5000,
      dismissible: toastData.dismissible !== false, // Default to true
    };

    set((state) => {
      const newToasts = [...state.toasts, toast];

      // Mantener solo el número máximo de toasts
      if (newToasts.length > state.maxToasts) {
        newToasts.splice(0, newToasts.length - state.maxToasts);
      }

      return { toasts: newToasts };
    });

    // Auto-remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        get().removeToast(toast.id);
      }, toast.duration);
    }
  },

  removeToast: (toastId) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  updateToast: (toastId, updates) => {
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === toastId ? { ...toast, ...updates } : toast
      ),
    }));
  },

  // Acciones específicas
  showSuccess: (message, options = {}) => {
    get().addToast({
      message,
      type: "success",
      ...options,
    });
  },

  showError: (message, options = {}) => {
    get().addToast({
      message,
      type: "error",
      duration: options.duration || 7000, // Errors stay longer
      ...options,
    });
  },

  showWarning: (message, options = {}) => {
    get().addToast({
      message,
      type: "warning",
      duration: options.duration || 6000,
      ...options,
    });
  },

  showInfo: (message, options = {}) => {
    get().addToast({
      message,
      type: "info",
      ...options,
    });
  },

  // Utilidades
  getToastsByType: (type) => {
    return get().toasts.filter((toast) => toast.type === type);
  },

  dismissToast: (toastId) => {
    get().removeToast(toastId);
  },
}));

// Selectores estandarizados para evitar renders innecesarios
export const useToasts = () => useToastStore((state) => state.toasts);
export const useMaxToasts = () => useToastStore((state) => state.maxToasts);

// Selector de acciones
export const useToastActions = () =>
  useToastStore((state) => ({
    addToast: state.addToast,
    removeToast: state.removeToast,
    clearToasts: state.clearToasts,
    updateToast: state.updateToast,
    showSuccess: state.showSuccess,
    showError: state.showError,
    showWarning: state.showWarning,
    showInfo: state.showInfo,
    getToastsByType: state.getToastsByType,
    dismissToast: state.dismissToast,
  }));

// Hook de conveniencia que combina estado y acciones
export const useToast = () => {
  const toasts = useToasts();
  const actions = useToastActions();

  return {
    toasts,
    ...actions,
  };
};
