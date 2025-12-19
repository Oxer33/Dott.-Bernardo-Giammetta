// =============================================================================
// TOASTER COMPONENT - DOTT. BERNARDO GIAMMETTA
// Sistema di notifiche toast usando Radix UI
// =============================================================================

'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TOAST CONTEXT
// Per gestire i toast globalmente
// =============================================================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// =============================================================================
// TOAST PROVIDER
// =============================================================================

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// =============================================================================
// USE TOAST HOOK
// =============================================================================

export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

// =============================================================================
// TOAST VARIANTS
// =============================================================================

const toastVariants = cva(
  `group pointer-events-auto relative flex w-full items-center justify-between 
   space-x-4 overflow-hidden rounded-2xl border p-4 pr-8 shadow-soft-lg 
   transition-all data-[swipe=cancel]:translate-x-0 
   data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] 
   data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] 
   data-[swipe=move]:transition-none 
   data-[state=open]:animate-in data-[state=closed]:animate-out 
   data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 
   data-[state=closed]:slide-out-to-right-full 
   data-[state=open]:slide-in-from-top-full`,
  {
    variants: {
      variant: {
        success: 'bg-green-50 border-green-200 text-green-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

// =============================================================================
// TOAST ICONS
// =============================================================================

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

// =============================================================================
// TOAST ITEM COMPONENT
// =============================================================================

interface ToastItemProps extends VariantProps<typeof toastVariants> {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const Icon = toastIcons[toast.type];

  return (
    <ToastPrimitive.Root
      className={cn(toastVariants({ variant: toast.type }))}
      duration={toast.duration || 5000}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColors[toast.type])} />
        <div className="flex-1">
          <ToastPrimitive.Title className="font-semibold text-sm">
            {toast.title}
          </ToastPrimitive.Title>
          {toast.description && (
            <ToastPrimitive.Description className="text-sm opacity-90 mt-1">
              {toast.description}
            </ToastPrimitive.Description>
          )}
        </div>
      </div>
      
      <ToastPrimitive.Close
        className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity 
                   hover:opacity-100 group-hover:opacity-100 focus:opacity-100"
        aria-label="Chiudi"
      >
        <X className="w-4 h-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

// =============================================================================
// TOASTER COMPONENT
// Componente principale che renderizza tutti i toast
// =============================================================================

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  // Esponi funzioni globali per aggiungere toast
  React.useEffect(() => {
    // @ts-ignore - aggiungiamo al window per uso globale
    window.toast = {
      success: (title: string, description?: string) => {
        setToasts((prev) => [...prev, { 
          id: Math.random().toString(36).substring(2, 9), 
          title, 
          description, 
          type: 'success' 
        }]);
      },
      error: (title: string, description?: string) => {
        setToasts((prev) => [...prev, { 
          id: Math.random().toString(36).substring(2, 9), 
          title, 
          description, 
          type: 'error' 
        }]);
      },
      warning: (title: string, description?: string) => {
        setToasts((prev) => [...prev, { 
          id: Math.random().toString(36).substring(2, 9), 
          title, 
          description, 
          type: 'warning' 
        }]);
      },
      info: (title: string, description?: string) => {
        setToasts((prev) => [...prev, { 
          id: Math.random().toString(36).substring(2, 9), 
          title, 
          description, 
          type: 'info' 
        }]);
      },
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastPrimitive.Provider>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <ToastPrimitive.Viewport 
        className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse 
                   p-4 sm:bottom-auto sm:right-0 sm:top-0 sm:flex-col md:max-w-[420px]" 
      />
    </ToastPrimitive.Provider>
  );
}

// =============================================================================
// HELPER FUNCTIONS
// Per chiamare toast da qualsiasi punto dell'app
// =============================================================================

export const toast = {
  success: (title: string, description?: string) => {
    // @ts-ignore
    window.toast?.success(title, description);
  },
  error: (title: string, description?: string) => {
    // @ts-ignore
    window.toast?.error(title, description);
  },
  warning: (title: string, description?: string) => {
    // @ts-ignore
    window.toast?.warning(title, description);
  },
  info: (title: string, description?: string) => {
    // @ts-ignore
    window.toast?.info(title, description);
  },
};
