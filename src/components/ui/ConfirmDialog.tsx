// =============================================================================
// CONFIRM DIALOG - DOTT. BERNARDO GIAMMETTA
// Dialog modale per conferma azioni distruttive
// =============================================================================

'use client';

import { Fragment, useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// =============================================================================
// TIPI
// =============================================================================

export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  isLoading: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// =============================================================================
// CONTEXT
// =============================================================================

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm deve essere usato dentro ConfirmProvider');
  }
  return context.confirm;
}

// =============================================================================
// PROVIDER
// =============================================================================

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    isLoading: false,
    title: '',
    message: '',
  });

  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        isLoading: false,
      });
      setResolveRef(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      if (state.onConfirm) {
        await state.onConfirm();
      }
      resolveRef?.(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Errore in onConfirm:', error);
      resolveRef?.(false);
    } finally {
      setState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  }, [state.onConfirm, resolveRef]);

  const handleCancel = useCallback(() => {
    state.onCancel?.();
    resolveRef?.(false);
    setState((prev) => ({ ...prev, isOpen: false }));
  }, [state.onCancel, resolveRef]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={state.isOpen}
        isLoading={state.isLoading}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        variant={state.variant}
        icon={state.icon}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}

// =============================================================================
// CONFIGURAZIONE VARIANTI
// =============================================================================

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  },
  info: {
    icon: AlertTriangle,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  },
};

// =============================================================================
// COMPONENTE DIALOG
// =============================================================================

interface ConfirmDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  isLoading = false,
  title,
  message,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  variant = 'danger',
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-4">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  {/* Icona */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                      config.iconBg
                    )}
                  >
                    {icon || <IconComponent className={cn('w-6 h-6', config.iconColor)} />}
                  </div>

                  {/* Testo */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sage-900">{title}</h3>
                    <p className="mt-2 text-sm text-sage-600">{message}</p>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onCancel}
                    className="flex-shrink-0 p-1 rounded-lg text-sage-400 hover:text-sage-600 hover:bg-sage-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-sage-50 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    'px-4 py-2 rounded-xl text-white font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    config.buttonClass
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Attendere...
                    </span>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// HOOK SEMPLIFICATO
// Per uso senza context
// =============================================================================

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const openDialog = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (options?.onConfirm) {
      await options.onConfirm();
    }
    closeDialog();
  }, [options, closeDialog]);

  const handleCancel = useCallback(() => {
    options?.onCancel?.();
    closeDialog();
  }, [options, closeDialog]);

  const DialogComponent = options ? (
    <ConfirmDialog
      isOpen={isOpen}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      variant={options.variant}
      icon={options.icon}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return {
    openDialog,
    closeDialog,
    DialogComponent,
  };
}

export default ConfirmDialog;
