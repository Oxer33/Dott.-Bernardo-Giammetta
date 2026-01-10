// =============================================================================
// COMUNE AUTOCOMPLETE - DOTT. BERNARDO GIAMMETTA
// Componente per ricerca e selezione comune italiano
// Compila automaticamente provincia e codice catastale
// =============================================================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// TIPI
// =============================================================================

interface Comune {
  nome: string;
  provincia: string;
  codiceCatastale: string;
  capoluogo: boolean;
}

interface ComuneAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onComuneSelect?: (comune: Comune) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export function ComuneAutocomplete({
  value,
  onChange,
  onComuneSelect,
  placeholder = 'Inizia a digitare il nome del comune...',
  label,
  required = false,
  disabled = false,
  className = '',
}: ComuneAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Comune[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedComune, setSelectedComune] = useState<Comune | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Cerca comuni con debounce
  const searchComuni = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/comuni?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      
      if (data.success && data.comuni) {
        setSuggestions(data.comuni);
        setIsOpen(data.comuni.length > 0);
      }
    } catch (error) {
      console.error('Errore ricerca comuni:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gestione input con debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedComune(null);

    // Debounce della ricerca
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchComuni(newValue);
    }, 300);
  };

  // Selezione comune
  const handleSelectComune = (comune: Comune) => {
    onChange(comune.nome);
    setSelectedComune(comune);
    setIsOpen(false);
    setSuggestions([]);
    
    if (onComuneSelect) {
      onComuneSelect(comune);
    }
  };

  // Pulisci selezione
  const handleClear = () => {
    onChange('');
    setSelectedComune(null);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-sage-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-12 pr-10 py-3 rounded-xl border border-sage-200 
                     focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                     outline-none text-sage-800 placeholder:text-sage-400
                     disabled:bg-sage-50 disabled:cursor-not-allowed
                     ${selectedComune ? 'bg-green-50 border-green-300' : ''}`}
        />
        
        {/* Icona stato */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-5 h-5 text-sage-400 animate-spin" />
          ) : value ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-sage-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-sage-400" />
            </button>
          ) : (
            <Search className="w-5 h-5 text-sage-400" />
          )}
        </div>
      </div>

      {/* Info comune selezionato */}
      {selectedComune && (
        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded-lg">
            Provincia: <strong>{selectedComune.provincia}</strong>
          </span>
          <span className="px-2 py-1 bg-lavender-100 text-lavender-700 rounded-lg">
            Cod. Catastale: <strong>{selectedComune.codiceCatastale}</strong>
          </span>
        </div>
      )}

      {/* Dropdown suggerimenti */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-sage-200 max-h-60 overflow-y-auto"
          >
            {suggestions.map((comune, index) => (
              <button
                key={`${comune.codiceCatastale}-${index}`}
                type="button"
                onClick={() => handleSelectComune(comune)}
                className="w-full px-4 py-3 text-left hover:bg-sage-50 transition-colors
                         flex items-center justify-between border-b border-sage-100 last:border-0"
              >
                <div>
                  <span className="font-medium text-sage-800">{comune.nome}</span>
                  {comune.capoluogo && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-lavender-100 text-lavender-700 rounded">
                      Capoluogo
                    </span>
                  )}
                </div>
                <span className="text-sm text-sage-500">
                  ({comune.provincia})
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messaggio nessun risultato */}
      {isOpen && !loading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-sage-200 p-4 text-center text-sage-500">
          Nessun comune trovato
        </div>
      )}
    </div>
  );
}

export default ComuneAutocomplete;
