// =============================================================================
// SELECT - DOTT. BERNARDO GIAMMETTA
// Componente select/dropdown riutilizzabile
// =============================================================================

'use client';

import { forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label del campo */
  label?: string;
  /** Opzioni disponibili */
  options: SelectOption[];
  /** Placeholder (prima opzione vuota) */
  placeholder?: string;
  /** Messaggio di errore */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Dimensione */
  selectSize?: 'sm' | 'md' | 'lg';
  /** Classe container */
  containerClassName?: string;
  /** Campo obbligatorio */
  required?: boolean;
}

// =============================================================================
// DIMENSIONI
// =============================================================================

const selectSizes = {
  sm: 'py-2 px-3 pr-10 text-sm',
  md: 'py-3 px-4 pr-12 text-base',
  lg: 'py-4 px-5 pr-14 text-lg',
};

const iconSizes = {
  sm: 'w-4 h-4 right-2',
  md: 'w-5 h-5 right-3',
  lg: 'w-6 h-6 right-4',
};

// =============================================================================
// COMPONENTE
// =============================================================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder = 'Seleziona...',
      error,
      helperText,
      selectSize = 'md',
      containerClassName,
      required = false,
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
    const hasValue = value !== undefined && value !== '';

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

        {/* Select container */}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            value={value}
            aria-invalid={hasError}
            className={cn(
              // Base
              'w-full rounded-xl border bg-white appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-sage-50 disabled:text-sage-400 disabled:cursor-not-allowed',
              
              // Dimensioni
              selectSizes[selectSize],
              
              // Colore testo (grigio se placeholder)
              !hasValue && 'text-sage-400',
              
              // Stati
              hasError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-sage-200 focus:border-sage-400 focus:ring-sage-200',
              
              className
            )}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            
            {/* Options */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <ChevronDown
            className={cn(
              'absolute top-1/2 -translate-y-1/2 pointer-events-none',
              iconSizes[selectSize],
              hasError ? 'text-red-400' : 'text-sage-400'
            )}
          />
        </div>

        {/* Error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
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
          <p className="text-sm text-sage-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// =============================================================================
// RADIO GROUP
// =============================================================================

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  containerClassName?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  required = false,
  orientation = 'vertical',
  containerClassName,
}: RadioGroupProps) {
  const hasError = !!error;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {/* Label */}
      {label && (
        <label
          className={cn(
            'block text-sm font-medium',
            hasError ? 'text-red-700' : 'text-sage-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Options */}
      <div
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
        role="radiogroup"
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start gap-3 cursor-pointer',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              className={cn(
                'mt-1 h-4 w-4 border-sage-300',
                'text-sage-600 focus:ring-sage-500'
              )}
            />
            <div>
              <span className="text-sm font-medium text-sage-700">
                {option.label}
              </span>
              {option.description && (
                <p className="text-sm text-sage-500 mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
