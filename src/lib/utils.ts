// =============================================================================
// UTILITY FUNCTIONS - DOTT. BERNARDO GIAMMETTA
// Funzioni helper riutilizzabili in tutto il progetto
// =============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// =============================================================================
// CN - CLASS NAME MERGER
// Combina clsx e tailwind-merge per gestire classi CSS in modo intelligente
// Esempio: cn('px-4 py-2', condition && 'bg-red', 'px-6') => 'py-2 px-6'
// =============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================
// PAROLE CHIAVE PER CORSIVO AUTOMATICO
// Array di termini che verranno automaticamente stilizzati in corsivo
// =============================================================================

export const KEYWORDS_TO_ITALICIZE = [
  // Termini scientifici
  'metabolismo',
  'microbiota',
  'microbioma',
  'nutrizione funzionale',
  'biochimica',
  'omeostasi',
  'insulino-resistenza',
  'glicemia',
  'lipidi',
  'proteine',
  'carboidrati',
  'macronutrienti',
  'micronutrienti',
  'vitamine',
  'minerali',
  'antiossidanti',
  'infiammazione',
  'detox',
  'disbiosi',
  'intolleranze',
  'allergie alimentari',
  'sensibilità',
  
  // Valori e concetti
  'benessere',
  'salute',
  'equilibrio',
  'consapevolezza',
  'personalizzazione',
  'prevenzione',
  'longevità',
  'vitalità',
  'energia',
  'armonia',
  'trasformazione',
  
  // Specializzazioni
  'nutrizione sportiva',
  'alimentazione plant-based',
  'medicina integrativa',
  'nutrizione clinica',
  'dieta mediterranea',
  'alimentazione consapevole',
  'educazione alimentare',
  'ricomposizione corporea',
  'performance',
  
  // Approcci
  'approccio olistico',
  'percorso personalizzato',
  'stile di vita',
  'abitudini alimentari',
  'mindful eating',
];

// =============================================================================
// HIGHLIGHT KEYWORDS
// Funzione che wrappa le parole chiave in tag <em> per lo styling
// =============================================================================

export function highlightKeywords(text: string): string {
  let result = text;
  
  // Ordina per lunghezza decrescente per evitare match parziali
  const sortedKeywords = [...KEYWORDS_TO_ITALICIZE].sort((a, b) => b.length - a.length);
  
  sortedKeywords.forEach((keyword) => {
    // Case insensitive match che preserva il case originale
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    result = result.replace(regex, '<em class="keyword">$1</em>');
  });
  
  return result;
}

// =============================================================================
// FORMAT DATE
// Formatta date in italiano
// =============================================================================

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  };
  
  return d.toLocaleDateString('it-IT', defaultOptions);
}

// =============================================================================
// FORMAT TIME
// Formatta orari in italiano
// =============================================================================

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// =============================================================================
// CALCULATE READING TIME
// Calcola tempo di lettura stimato per un articolo
// =============================================================================

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// =============================================================================
// SLUGIFY
// Converte stringa in slug URL-friendly
// =============================================================================

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
    .replace(/[^\w\s-]/g, '') // Rimuove caratteri speciali
    .replace(/\s+/g, '-') // Spazi diventano trattini
    .replace(/--+/g, '-') // Rimuove trattini multipli
    .trim();
}

// =============================================================================
// TRUNCATE TEXT
// Tronca testo a una lunghezza specifica
// =============================================================================

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// =============================================================================
// GET INITIALS
// Estrae iniziali da un nome
// =============================================================================

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// =============================================================================
// DELAY
// Promise che si risolve dopo un delay (utile per animazioni)
// =============================================================================

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// GENERATE TIME SLOTS
// Genera fasce orarie per l'agenda (30 minuti ciascuna)
// =============================================================================

export function generateTimeSlots(
  startHour: number = 8,
  endHour: number = 20,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  
  return slots;
}

// =============================================================================
// IS VALID EMAIL
// Validazione email semplice
// =============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// =============================================================================
// IS VALID PHONE
// Validazione numero telefono italiano
// =============================================================================

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+39)?[\s.-]?[0-9]{2,4}[\s.-]?[0-9]{5,8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// =============================================================================
// ABSOLUTE URL
// Genera URL assoluto dal path relativo
// =============================================================================

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bernardogiammetta.com';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
