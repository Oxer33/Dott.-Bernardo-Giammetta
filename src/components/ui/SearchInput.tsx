// =============================================================================
// SEARCH INPUT - DOTT. BERNARDO GIAMMETTA
// Componente input di ricerca con debounce
// =============================================================================

'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

interface SearchInputProps {
  /** Valore controllato */
  value?: string;
  /** Callback cambio valore */
  onChange?: (value: string) => void;
  /** Callback submit (invio) */
  onSubmit?: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Delay debounce in ms */
  debounceMs?: number;
  /** Mostra spinner caricamento */
  isLoading?: boolean;
  /** Dimensione */
  size?: 'sm' | 'md' | 'lg';
  /** Mostra pulsante clear */
  showClear?: boolean;
  /** Classe container */
  className?: string;
  /** Disabilita */
  disabled?: boolean;
  /** Autofocus */
  autoFocus?: boolean;
}

// =============================================================================
// DIMENSIONI
// =============================================================================

const sizes = {
  sm: 'h-9 text-sm pl-9 pr-9',
  md: 'h-11 text-base pl-11 pr-11',
  lg: 'h-13 text-lg pl-13 pr-13',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const iconPositions = {
  sm: 'left-2.5',
  md: 'left-3.5',
  lg: 'left-4',
};

// =============================================================================
// COMPONENTE
// =============================================================================

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      onSubmit,
      placeholder = 'Cerca...',
      debounceMs = 300,
      isLoading = false,
      size = 'md',
      showClear = true,
      className,
      disabled = false,
      autoFocus = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(controlledValue || '');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sincronizza con valore controllato
    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue]);

    // Debounce onChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onChange?.(newValue);
      }, debounceMs);
    };

    // Submit
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSubmit?.(internalValue);
    };

    // Clear
    const handleClear = () => {
      setInternalValue('');
      onChange?.('');
      inputRef.current?.focus();
    };

    // Cleanup
    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    const hasValue = internalValue.length > 0;

    return (
      <form onSubmit={handleSubmit} className={cn('relative', className)}>
        {/* Icona search */}
        <Search
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-sage-400 pointer-events-none',
            iconSizes[size],
            iconPositions[size]
          )}
        />

        {/* Input */}
        <input
          ref={ref || inputRef}
          type="search"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            'w-full rounded-xl border border-sage-200 bg-white',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400',
            'placeholder:text-sage-400',
            'disabled:bg-sage-50 disabled:cursor-not-allowed',
            sizes[size],
            // Rimuovi spinner nativo di type="search"
            '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
          )}
        />

        {/* Right side: loading o clear */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1'
          )}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className={cn(iconSizes[size], 'text-sage-400 animate-spin')} />
              </motion.div>
            ) : showClear && hasValue ? (
              <motion.button
                key="clear"
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="p-1 text-sage-400 hover:text-sage-600 rounded-full hover:bg-sage-100 transition-colors"
                aria-label="Cancella ricerca"
              >
                <X className={iconSizes[size]} />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </form>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// =============================================================================
// SEARCH WITH SUGGESTIONS
// =============================================================================

interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
}

interface SearchWithSuggestionsProps extends Omit<SearchInputProps, 'onSubmit'> {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
  onSearch?: (value: string) => void;
  maxSuggestions?: number;
}

export function SearchWithSuggestions({
  suggestions,
  onSelect,
  onSearch,
  maxSuggestions = 5,
  ...inputProps
}: SearchWithSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.slice(0, maxSuggestions);
  const showSuggestions = isOpen && filteredSuggestions.length > 0;

  // Chiudi al click fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigazione keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onSelect(filteredSuggestions[highlightedIndex]);
          setIsOpen(false);
        } else if (inputProps.value) {
          onSearch?.(inputProps.value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <SearchInput
        {...inputProps}
        onChange={(value) => {
          inputProps.onChange?.(value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onSubmit={(value) => {
          onSearch?.(value);
          setIsOpen(false);
        }}
      />

      {/* Dropdown suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-sage-200 rounded-xl shadow-lg overflow-hidden z-50"
          >
            <ul role="listbox">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => {
                    onSelect(suggestion);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'px-4 py-3 cursor-pointer transition-colors',
                    highlightedIndex === index
                      ? 'bg-sage-50'
                      : 'hover:bg-sage-50'
                  )}
                >
                  <div className="font-medium text-sage-900">
                    {suggestion.label}
                  </div>
                  {suggestion.description && (
                    <div className="text-sm text-sage-500">
                      {suggestion.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchInput;
