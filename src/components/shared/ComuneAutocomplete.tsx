// =============================================================================
// COMPONENTE AUTOCOMPLETE COMUNE ITALIANO
// Permette di selezionare un comune con auto-fill di provincia e CAP
// =============================================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  caricaComuni, 
  cercaComuni, 
  trovaComunePerNome,
  getCapCitta,
  ComuneItaliano 
} from '@/lib/comuni-italiani';

// =============================================================================
// TIPI
// =============================================================================

interface ComuneAutocompleteProps {
  value: string;
  onChange: (comune: string) => void;
  onSelectComune?: (comune: ComuneItaliano | null) => void;
  onProvinciaChange?: (provincia: string) => void;
  onCapChange?: (cap: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export function ComuneAutocomplete({
  value,
  onChange,
  onSelectComune,
  onProvinciaChange,
  onCapChange,
  placeholder = 'Inizia a digitare il nome del comune...',
  label,
  required = false,
  className = '',
}: ComuneAutocompleteProps) {
  // State
  const [comuni, setComuni] = useState<ComuneItaliano[]>([]);
  const [suggerimenti, setSuggerimenti] = useState<ComuneItaliano[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carica comuni all'avvio
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await caricaComuni();
      setComuni(data);
      setLoading(false);
    };
    load();
  }, []);

  // Cerca comuni quando l'utente digita
  useEffect(() => {
    if (value.length >= 2 && comuni.length > 0) {
      const risultati = cercaComuni(comuni, value, 8);
      setSuggerimenti(risultati);
      setShowDropdown(risultati.length > 0);
      setHighlightedIndex(-1);
    } else {
      setSuggerimenti([]);
      setShowDropdown(false);
    }
  }, [value, comuni]);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestione selezione comune
  const handleSelectComune = (comune: ComuneItaliano) => {
    onChange(comune.denominazione_ita);
    setShowDropdown(false);
    
    // Callback con comune selezionato
    if (onSelectComune) {
      onSelectComune(comune);
    }
    
    // Auto-fill provincia
    if (onProvinciaChange) {
      onProvinciaChange(comune.sigla_provincia);
    }
    
    // Auto-fill CAP (se disponibile)
    if (onCapChange) {
      const cap = getCapCitta(comune.denominazione_ita);
      if (cap) {
        onCapChange(cap);
      }
    }
  };

  // Gestione tastiera
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggerimenti.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggerimenti[highlightedIndex]) {
          handleSelectComune(suggerimenti[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  // Gestione blur - verifica se il comune esiste
  const handleBlur = () => {
    // Delay per permettere click su suggerimento
    setTimeout(() => {
      if (value && comuni.length > 0) {
        const comuneTrovato = trovaComunePerNome(comuni, value);
        if (comuneTrovato) {
          // Auto-fill provincia se non già settata
          if (onProvinciaChange) {
            onProvinciaChange(comuneTrovato.sigla_provincia);
          }
          // Auto-fill CAP se disponibile
          if (onCapChange) {
            const cap = getCapCitta(comuneTrovato.denominazione_ita);
            if (cap) {
              onCapChange(cap);
            }
          }
        }
      }
      setShowDropdown(false);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-sage-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggerimenti.length > 0) setShowDropdown(true);
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-sage-200 
                 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                 outline-none text-sage-800 placeholder:text-sage-400"
      />
      
      {/* Dropdown suggerimenti */}
      {showDropdown && suggerimenti.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-sage-200 
                   rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggerimenti.map((comune, index) => (
            <button
              key={comune.codice_istat}
              type="button"
              onClick={() => handleSelectComune(comune)}
              className={`w-full px-4 py-3 text-left hover:bg-lavender-50 
                       flex justify-between items-center transition-colors
                       ${index === highlightedIndex ? 'bg-lavender-50' : ''}
                       ${index === 0 ? 'rounded-t-xl' : ''}
                       ${index === suggerimenti.length - 1 ? 'rounded-b-xl' : ''}`}
            >
              <span className="text-sage-800">{comune.denominazione_ita}</span>
              <span className="text-sm text-sage-500">({comune.sigla_provincia})</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Loading */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-lavender-300 border-t-lavender-600 
                       rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default ComuneAutocomplete;
