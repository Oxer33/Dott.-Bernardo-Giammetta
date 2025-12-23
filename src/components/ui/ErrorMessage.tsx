// =============================================================================
// ERROR MESSAGE - DOTT. BERNARDO GIAMMETTA
// Componente per visualizzazione errori con varianti
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, Info, CheckCircle, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// =============================================================================
// TIPI
// =============================================================================

export type MessageType = 'error' | 'warning' | 'info' | 'success';

interface ErrorMessageProps {
  /** Tipo di messaggio */
  type?: MessageType;
  /** Titolo (opzionale) */
  title?: string;
  /** Messaggio da visualizzare */
  message: string;
  /** Mostra pulsante chiudi */
  dismissible?: boolean;
  /** Callback chiusura */
  onDismiss?: () => void;
  /** Mostra pulsante riprova */
  retryable?: boolean;
  /** Callback riprova */
  onRetry?: () => void;
  /** Classe CSS aggiuntiva */
  className?: string;
  /** Variante: inline, toast, banner */
  variant?: 'inline' | 'toast' | 'banner';
  /** Animazione */
  animated?: boolean;
}

// =============================================================================
// CONFIGURAZIONE STILI
// =============================================================================

const typeConfig = {
  error: {
    icon: XCircle,
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-800',
    iconClass: 'text-red-500',
    titleClass: 'text-red-900',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-800',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-900',
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
    iconClass: 'text-blue-500',
    titleClass: 'text-blue-900',
  },
  success: {
    icon: CheckCircle,
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    iconClass: 'text-green-500',
    titleClass: 'text-green-900',
  },
};

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function ErrorMessage({
  type = 'error',
  title,
  message,
  dismissible = false,
  onDismiss,
  retryable = false,
  onRetry,
  className,
  variant = 'inline',
  animated = true,
}: ErrorMessageProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const baseClasses = cn(
    'border rounded-xl',
    config.bgClass,
    variant === 'inline' && 'p-4',
    variant === 'toast' && 'p-4 shadow-lg',
    variant === 'banner' && 'p-3 rounded-none border-x-0',
    className
  );

  const content = (
    <div className={baseClasses}>
      <div className="flex items-start gap-3">
        {/* Icona */}
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClass)} />

        {/* Contenuto */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('font-semibold text-sm mb-1', config.titleClass)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm', config.textClass)}>{message}</p>

          {/* Azioni */}
          {retryable && onRetry && (
            <button
              onClick={onRetry}
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-sm font-medium',
                config.iconClass,
                'hover:underline focus:outline-none'
              )}
            >
              <RefreshCw className="w-4 h-4" />
              Riprova
            </button>
          )}
        </div>

        {/* Pulsante chiudi */}
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-lg transition-colors',
              'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              config.textClass
            )}
            aria-label="Chiudi messaggio"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

// =============================================================================
// COMPONENTE EMPTY STATE
// =============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 mb-4 rounded-full bg-sage-100 flex items-center justify-center text-sage-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-sage-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sage-600 max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// =============================================================================
// COMPONENTE API ERROR
// Per errori specifici delle API
// =============================================================================

interface ApiErrorProps {
  error: string | null;
  onRetry?: () => void;
  className?: string;
}

export function ApiError({ error, onRetry, className }: ApiErrorProps) {
  if (!error) return null;

  // Traduci errori comuni
  const translatedError = translateError(error);

  return (
    <ErrorMessage
      type="error"
      title="Si è verificato un errore"
      message={translatedError}
      retryable={!!onRetry}
      onRetry={onRetry}
      className={className}
    />
  );
}

// =============================================================================
// TRADUZIONI ERRORI
// =============================================================================

function translateError(error: string): string {
  const translations: Record<string, string> = {
    'Network Error': 'Errore di connessione. Verifica la tua connessione internet.',
    'Failed to fetch': 'Impossibile connettersi al server. Riprova tra poco.',
    'Unauthorized': 'Sessione scaduta. Effettua nuovamente il login.',
    'Forbidden': 'Non hai i permessi per questa operazione.',
    'Not Found': 'Risorsa non trovata.',
    'Internal Server Error': 'Errore interno del server. Stiamo lavorando per risolvere.',
    'Bad Request': 'Richiesta non valida. Controlla i dati inseriti.',
    'Too Many Requests': 'Troppe richieste. Attendi qualche secondo e riprova.',
    'RATE_LIMITED': 'Hai effettuato troppe richieste. Attendi un momento.',
    'VALIDATION_ERROR': 'I dati inseriti non sono validi.',
    'EMAIL_NOT_VERIFIED': 'Devi verificare la tua email prima di continuare.',
  };

  // Cerca corrispondenza esatta
  if (translations[error]) {
    return translations[error];
  }

  // Cerca corrispondenza parziale
  for (const [key, value] of Object.entries(translations)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return error;
}

// =============================================================================
// COMPONENTE FORM ERROR
// Per errori nei form
// =============================================================================

interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn('text-sm text-red-600 mt-1', className)}
    >
      {error}
    </motion.p>
  );
}

// =============================================================================
// COMPONENTE FIELD ERROR
// Per errori specifici di un campo
// =============================================================================

interface FieldErrorProps {
  name: string;
  errors?: Record<string, string>;
  className?: string;
}

export function FieldError({ name, errors, className }: FieldErrorProps) {
  const error = errors?.[name];
  if (!error) return null;

  return <FormError error={error} className={className} />;
}

export default ErrorMessage;
