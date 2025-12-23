// =============================================================================
// MODAL - DOTT. BERNARDO GIAMMETTA
// Componente modale riutilizzabile con varianti
// =============================================================================

'use client';

import { Fragment, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// =============================================================================
// TIPI
// =============================================================================

export interface ModalProps {
  /** Se il modal è aperto */
  isOpen: boolean;
  /** Callback chiusura */
  onClose: () => void;
  /** Titolo del modal */
  title?: string;
  /** Descrizione/sottotitolo */
  description?: string;
  /** Contenuto */
  children: React.ReactNode;
  /** Dimensione */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Chiudi cliccando fuori */
  closeOnOverlayClick?: boolean;
  /** Chiudi con tasto ESC */
  closeOnEsc?: boolean;
  /** Mostra pulsante X */
  showCloseButton?: boolean;
  /** Footer personalizzato */
  footer?: React.ReactNode;
  /** Classe container */
  className?: string;
}

// =============================================================================
// DIMENSIONI
// =============================================================================

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

// =============================================================================
// ANIMAZIONI
// =============================================================================

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

// =============================================================================
// COMPONENTE
// =============================================================================

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  footer,
  className,
}: ModalProps) {
  // Gestione tasto ESC
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEsc]);

  // Click overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Modal container */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleOverlayClick}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'w-full bg-white rounded-2xl shadow-xl',
                modalSizes[size],
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              aria-describedby={description ? 'modal-description' : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between p-6 pb-4 border-b border-sage-100">
                  <div>
                    {title && (
                      <h2
                        id="modal-title"
                        className="text-xl font-semibold text-sage-900"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id="modal-description"
                        className="mt-1 text-sm text-sage-600"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 -m-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                      aria-label="Chiudi"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 bg-sage-50 border-t border-sage-100 rounded-b-2xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// MODAL FOOTER PRESET
// =============================================================================

interface ModalFooterProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  confirmVariant?: 'primary' | 'danger';
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelText = 'Annulla',
  confirmText = 'Conferma',
  isLoading = false,
  confirmVariant = 'primary',
}: ModalFooterProps) {
  return (
    <div className="flex justify-end gap-3">
      {onCancel && (
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button
          variant={confirmVariant === 'danger' ? 'secondary' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
          className={confirmVariant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
        >
          {confirmText}
        </Button>
      )}
    </div>
  );
}

// =============================================================================
// DRAWER (Modale laterale)
// =============================================================================

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

const drawerSizes = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
};

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const slideVariants = {
    hidden: { x: position === 'right' ? '100%' : '-100%' },
    visible: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 bottom-0 z-50 w-full bg-white shadow-xl',
              drawerSizes[size],
              position === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-sage-100">
                {title && (
                  <h2 className="text-lg font-semibold text-sage-900">{title}</h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4 overflow-y-auto h-full">{children}</div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

export default Modal;
