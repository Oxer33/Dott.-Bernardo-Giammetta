// =============================================================================
// TOAST NOTIFICATION - DOTT. BERNARDO GIAMMETTA
// Sistema di notifiche toast con gestione stato globale
// =============================================================================

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

// =============================================================================
// HOOK
// =============================================================================

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve essere usato dentro ToastProvider');
  }
  return context;
}

// Shortcut functions
export function useToastActions() {
  const { addToast } = useToast();

  return {
    success: (message: string, title?: string) =>
      addToast({ type: 'success', message, title }),
    error: (message: string, title?: string) =>
      addToast({ type: 'error', message, title }),
    warning: (message: string, title?: string) =>
      addToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) =>
      addToast({ type: 'info', message, title }),
  };
}

// =============================================================================
// PROVIDER
// =============================================================================

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  maxToasts = 5,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? defaultDuration,
      };

      setToasts((prev) => {
        // Rimuovi i più vecchi se superiamo maxToasts
        const updated = [...prev, newToast];
        if (updated.length > maxToasts) {
          return updated.slice(-maxToasts);
        }
        return updated;
      });

      // Auto-rimuovi dopo duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, newToast.duration);
      }
    },
    [defaultDuration, maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// =============================================================================
// CONTAINER
// =============================================================================

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifiche"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// ITEM
// =============================================================================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    iconClass: 'text-green-500',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-800',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-800',
    iconClass: 'text-amber-500',
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
    iconClass: 'text-blue-500',
  },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'pointer-events-auto p-4 rounded-xl border shadow-lg',
        'backdrop-blur-sm',
        config.bgClass
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClass)} />
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={cn('font-semibold text-sm', config.textClass)}>
              {toast.title}
            </p>
          )}
          <p className={cn('text-sm', config.textClass)}>{toast.message}</p>
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className={cn(
            'flex-shrink-0 p-1 rounded-lg transition-colors',
            'hover:bg-black/5',
            config.textClass
          )}
          aria-label="Chiudi notifica"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// =============================================================================
// COMPONENTE STANDALONE
// Per uso senza context (deprecato, preferire useToast)
// =============================================================================

interface StandaloneToastProps {
  type: ToastType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function StandaloneToast({
  type,
  title,
  message,
  onClose,
  className,
}: StandaloneToastProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={cn(
        'p-4 rounded-xl border shadow-lg backdrop-blur-sm',
        config.bgClass,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0', config.iconClass)} />
        <div className="flex-1">
          {title && (
            <p className={cn('font-semibold text-sm', config.textClass)}>{title}</p>
          )}
          <p className={cn('text-sm', config.textClass)}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn('p-1 rounded hover:bg-black/5', config.textClass)}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ToastProvider;
