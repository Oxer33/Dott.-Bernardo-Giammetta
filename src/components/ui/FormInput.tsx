// =============================================================================
// FORM INPUT - DOTT. BERNARDO GIAMMETTA
// Componente input form riutilizzabile con validazione e stili
// =============================================================================

'use client';

import { forwardRef, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label del campo */
  label?: string;
  /** Messaggio di errore */
  error?: string;
  /** Helper text sotto il campo */
  helperText?: string;
  /** Icona a sinistra */
  leftIcon?: LucideIcon;
  /** Icona a destra */
  rightIcon?: LucideIcon;
  /** Mostra indicatore successo */
  showSuccess?: boolean;
  /** Variante dimensione */
  inputSize?: 'sm' | 'md' | 'lg';
  /** Classe per il container */
  containerClassName?: string;
  /** Campo obbligatorio (mostra asterisco) */
  required?: boolean;
}

// =============================================================================
// DIMENSIONI
// =============================================================================

const inputSizes = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-base',
  lg: 'py-4 px-5 text-lg',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

// =============================================================================
// COMPONENTE
// =============================================================================

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showSuccess = false,
      inputSize = 'md',
      containerClassName,
      required = false,
      type = 'text',
      className,
      disabled,
      id: propId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = propId || generatedId;
    
    // Stato per mostrare/nascondere password
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Determina stato visivo
    const hasError = !!error;
    const isSuccess = showSuccess && !hasError && !disabled;

    // Classi base input
    const inputClasses = cn(
      // Base
      'w-full rounded-xl border bg-white transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'placeholder:text-sage-400',
      'disabled:bg-sage-50 disabled:text-sage-400 disabled:cursor-not-allowed',
      
      // Dimensioni
      inputSizes[inputSize],
      
      // Padding per icone
      LeftIcon && 'pl-11',
      (RightIcon || isPassword) && 'pr-11',
      
      // Stati
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
        : isSuccess
        ? 'border-green-300 focus:border-green-400 focus:ring-green-200'
        : 'border-sage-200 focus:border-sage-400 focus:ring-sage-200',
      
      className
    );

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'block text-sm font-medium',
              hasError ? 'text-red-700' : 'text-sage-700'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <LeftIcon
                className={cn(
                  iconSizes[inputSize],
                  hasError ? 'text-red-400' : 'text-sage-400'
                )}
              />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={inputClasses}
            {...props}
          />

          {/* Right side: password toggle, success icon, or custom icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Success indicator */}
            {isSuccess && !isPassword && (
              <CheckCircle className={cn(iconSizes[inputSize], 'text-green-500')} />
            )}

            {/* Error indicator (solo se no icona destra) */}
            {hasError && !RightIcon && !isPassword && (
              <AlertCircle className={cn(iconSizes[inputSize], 'text-red-500')} />
            )}

            {/* Password toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-sage-400 hover:text-sage-600 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? (
                  <EyeOff className={iconSizes[inputSize]} />
                ) : (
                  <Eye className={iconSizes[inputSize]} />
                )}
              </button>
            )}

            {/* Custom right icon */}
            {RightIcon && !isPassword && (
              <RightIcon
                className={cn(
                  iconSizes[inputSize],
                  hasError ? 'text-red-400' : 'text-sage-400'
                )}
              />
            )}
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={`${id}-error`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Helper text */}
        {helperText && !error && (
          <p id={`${id}-helper`} className="text-sm text-sage-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// =============================================================================
// TEXTAREA
// =============================================================================

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  required?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      required = false,
      showCount = false,
      maxLength,
      className,
      disabled,
      id: propId,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const hasError = !!error;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'block text-sm font-medium',
              hasError ? 'text-red-700' : 'text-sage-700'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={hasError}
          className={cn(
            'w-full rounded-xl border bg-white transition-all duration-200',
            'py-3 px-4 text-base min-h-[120px] resize-y',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'placeholder:text-sage-400',
            'disabled:bg-sage-50 disabled:text-sage-400 disabled:cursor-not-allowed',
            hasError
              ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
              : 'border-sage-200 focus:border-sage-400 focus:ring-sage-200',
            className
          )}
          {...props}
        />

        {/* Footer: error, helper, count */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            {helperText && !error && (
              <p className="text-sm text-sage-500">{helperText}</p>
            )}
          </div>

          {/* Character count */}
          {showCount && maxLength && (
            <span
              className={cn(
                'text-xs flex-shrink-0',
                charCount >= maxLength ? 'text-red-500' : 'text-sage-400'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

// =============================================================================
// CHECKBOX
// =============================================================================

export interface FormCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, description, error, containerClassName, className, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;

    return (
      <div className={cn('space-y-1', containerClassName)}>
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className={cn(
              'mt-1 h-4 w-4 rounded border-sage-300',
              'text-sage-600 focus:ring-sage-500',
              'disabled:opacity-50',
              className
            )}
            {...props}
          />
          <div>
            <label htmlFor={id} className="text-sm font-medium text-sage-700 cursor-pointer">
              {label}
            </label>
            {description && (
              <p className="text-sm text-sage-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1 ml-7">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

export default FormInput;
