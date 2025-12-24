// =============================================================================
// FESTE ITALIANE - DOTT. BERNARDO GIAMMETTA
// Gestione feste comandate italiane per esclusione dall'agenda
// Include: feste fisse, Pasqua/Pasquetta (variabili), santo patrono Bologna
// =============================================================================

import { getYear, isEqual, startOfDay, getDay, format } from 'date-fns';

// =============================================================================
// FESTE FISSE (stessa data ogni anno)
// =============================================================================

interface FixedHoliday {
  name: string;
  month: number; // 1-12
  day: number;
}

const FIXED_HOLIDAYS: FixedHoliday[] = [
  { name: 'Capodanno', month: 1, day: 1 },
  { name: 'Epifania', month: 1, day: 6 },
  { name: 'Festa della Liberazione', month: 4, day: 25 },
  { name: 'Festa dei Lavoratori', month: 5, day: 1 },
  { name: 'Festa della Repubblica', month: 6, day: 2 },
  { name: 'Ferragosto', month: 8, day: 15 },
  { name: 'Tutti i Santi', month: 11, day: 1 },
  { name: 'Immacolata Concezione', month: 12, day: 8 },
  { name: 'Natale', month: 12, day: 25 },
  { name: 'Santo Stefano', month: 12, day: 26 },
  // Santo Patrono Bologna (San Petronio)
  { name: 'San Petronio (Patrono Bologna)', month: 10, day: 4 },
];

// =============================================================================
// CALCOLO PASQUA (Algoritmo di Gauss/Anonymous Gregorian)
// =============================================================================

/**
 * Calcola la data di Pasqua per un dato anno
 * Algoritmo: Anonymous Gregorian algorithm
 * @param year Anno
 * @returns Data di Pasqua
 */
export function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = aprile
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

/**
 * Calcola la data di Pasquetta (Lunedì dell'Angelo)
 * È sempre il giorno dopo Pasqua
 * @param year Anno
 * @returns Data di Pasquetta
 */
export function calculateEasterMonday(year: number): Date {
  const easter = calculateEaster(year);
  return new Date(easter.getTime() + 24 * 60 * 60 * 1000);
}

// =============================================================================
// VERIFICA FESTE
// =============================================================================

export interface HolidayInfo {
  isHoliday: boolean;
  name?: string;
  type?: 'fixed' | 'easter' | 'sunday';
}

/**
 * Verifica se una data è una festa italiana
 * @param date Data da verificare
 * @returns Informazioni sulla festa
 */
export function isItalianHoliday(date: Date): HolidayInfo {
  const normalizedDate = startOfDay(date);
  const year = getYear(normalizedDate);
  const month = normalizedDate.getMonth() + 1; // 1-12
  const day = normalizedDate.getDate();
  
  // 1. Verifica domenica
  if (getDay(normalizedDate) === 0) {
    return {
      isHoliday: true,
      name: 'Domenica',
      type: 'sunday',
    };
  }
  
  // 2. Verifica feste fisse
  for (const holiday of FIXED_HOLIDAYS) {
    if (holiday.month === month && holiday.day === day) {
      return {
        isHoliday: true,
        name: holiday.name,
        type: 'fixed',
      };
    }
  }
  
  // 3. Verifica Pasqua
  const easter = calculateEaster(year);
  if (isEqual(normalizedDate, startOfDay(easter))) {
    return {
      isHoliday: true,
      name: 'Pasqua',
      type: 'easter',
    };
  }
  
  // 4. Verifica Pasquetta
  const easterMonday = calculateEasterMonday(year);
  if (isEqual(normalizedDate, startOfDay(easterMonday))) {
    return {
      isHoliday: true,
      name: 'Pasquetta (Lunedì dell\'Angelo)',
      type: 'easter',
    };
  }
  
  return { isHoliday: false };
}

/**
 * Verifica se una data è una domenica
 * @param date Data da verificare
 * @returns true se è domenica
 */
export function isSunday(date: Date): boolean {
  return getDay(date) === 0;
}

/**
 * Ottieni tutte le feste per un dato anno
 * @param year Anno
 * @returns Array di date delle feste
 */
export function getHolidaysForYear(year: number): { date: Date; name: string }[] {
  const holidays: { date: Date; name: string }[] = [];
  
  // Feste fisse
  for (const holiday of FIXED_HOLIDAYS) {
    holidays.push({
      date: new Date(year, holiday.month - 1, holiday.day),
      name: holiday.name,
    });
  }
  
  // Pasqua e Pasquetta
  holidays.push({
    date: calculateEaster(year),
    name: 'Pasqua',
  });
  
  holidays.push({
    date: calculateEasterMonday(year),
    name: 'Pasquetta (Lunedì dell\'Angelo)',
  });
  
  // Ordina per data
  holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return holidays;
}

/**
 * Formatta la lista feste per display
 * @param year Anno
 * @returns Stringa formattata
 */
export function formatHolidaysList(year: number): string {
  const holidays = getHolidaysForYear(year);
  return holidays
    .map(h => `${format(h.date, 'dd/MM/yyyy')} - ${h.name}`)
    .join('\n');
}

// =============================================================================
// ESPORTA COSTANTI PER REFERENCE
// =============================================================================

export const HOLIDAY_NAMES = {
  CAPODANNO: 'Capodanno',
  EPIFANIA: 'Epifania',
  PASQUA: 'Pasqua',
  PASQUETTA: 'Pasquetta (Lunedì dell\'Angelo)',
  LIBERAZIONE: 'Festa della Liberazione',
  LAVORATORI: 'Festa dei Lavoratori',
  REPUBBLICA: 'Festa della Repubblica',
  FERRAGOSTO: 'Ferragosto',
  OGNISSANTI: 'Tutti i Santi',
  IMMACOLATA: 'Immacolata Concezione',
  NATALE: 'Natale',
  SANTO_STEFANO: 'Santo Stefano',
  SAN_PETRONIO: 'San Petronio (Patrono Bologna)',
  DOMENICA: 'Domenica',
} as const;

export default isItalianHoliday;
