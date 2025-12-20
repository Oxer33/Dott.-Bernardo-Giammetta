// =============================================================================
// CALCOLO CODICE FISCALE ITALIANO
// Algoritmo completo per generazione e validazione CF
// Basato sulla normativa italiana (DPR 605/1973)
// =============================================================================

// =============================================================================
// COSTANTI E TABELLE
// =============================================================================

// Mappa mesi per codice fiscale
const MESI_CF: Record<number, string> = {
  1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'H',
  7: 'L', 8: 'M', 9: 'P', 10: 'R', 11: 'S', 12: 'T'
};

// Tabella caratteri dispari per calcolo check digit
const DISPARI: Record<string, number> = {
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
  'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
  'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
  'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
};

// Tabella caratteri pari per calcolo check digit
const PARI: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
  'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
  'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
};

// Lettere per il resto del check digit
const RESTO_LETTERE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Vocali e consonanti per estrazione
const VOCALI = 'AEIOU';
const CONSONANTI = 'BCDFGHJKLMNPQRSTVWXYZ';

// =============================================================================
// FUNZIONI HELPER
// =============================================================================

/**
 * Rimuove accenti e caratteri speciali da una stringa
 */
function normalizzaStringa(str: string): string {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
    .replace(/[^A-Z]/g, ''); // Mantiene solo lettere
}

/**
 * Estrae consonanti da una stringa
 */
function estraiConsonanti(str: string): string {
  return str.split('').filter(c => CONSONANTI.includes(c)).join('');
}

/**
 * Estrae vocali da una stringa
 */
function estraiVocali(str: string): string {
  return str.split('').filter(c => VOCALI.includes(c)).join('');
}

/**
 * Calcola i 3 caratteri del cognome per il CF
 */
function calcolaCognome(cognome: string): string {
  const norm = normalizzaStringa(cognome);
  const consonanti = estraiConsonanti(norm);
  const vocali = estraiVocali(norm);
  
  // Prendi consonanti + vocali + X fino a 3 caratteri
  let risultato = consonanti + vocali;
  while (risultato.length < 3) {
    risultato += 'X';
  }
  
  return risultato.substring(0, 3);
}

/**
 * Calcola i 3 caratteri del nome per il CF
 */
function calcolaNome(nome: string): string {
  const norm = normalizzaStringa(nome);
  const consonanti = estraiConsonanti(norm);
  const vocali = estraiVocali(norm);
  
  let risultato: string;
  
  // Se ci sono 4+ consonanti, prendi 1a, 3a e 4a
  if (consonanti.length >= 4) {
    risultato = consonanti[0] + consonanti[2] + consonanti[3];
  } else {
    // Altrimenti come il cognome: consonanti + vocali + X
    risultato = consonanti + vocali;
    while (risultato.length < 3) {
      risultato += 'X';
    }
    risultato = risultato.substring(0, 3);
  }
  
  return risultato;
}

/**
 * Calcola i caratteri per data di nascita e sesso
 */
function calcolaDataNascitaSesso(
  dataNascita: Date,
  sesso: 'M' | 'F'
): string {
  const anno = dataNascita.getFullYear().toString().slice(-2);
  const mese = MESI_CF[dataNascita.getMonth() + 1];
  let giorno = dataNascita.getDate();
  
  // Per le donne, aggiungi 40 al giorno
  if (sesso === 'F') {
    giorno += 40;
  }
  
  const giornoStr = giorno.toString().padStart(2, '0');
  
  return anno + mese + giornoStr;
}

/**
 * Calcola il carattere di controllo (check digit)
 */
function calcolaCheckDigit(cf15: string): string {
  let somma = 0;
  
  for (let i = 0; i < 15; i++) {
    const char = cf15[i];
    // Posizioni dispari (1, 3, 5...) = indici pari (0, 2, 4...)
    if (i % 2 === 0) {
      somma += DISPARI[char];
    } else {
      somma += PARI[char];
    }
  }
  
  const resto = somma % 26;
  return RESTO_LETTERE[resto];
}

// =============================================================================
// FUNZIONI PUBBLICHE
// =============================================================================

export interface DatiCodiceFiscale {
  nome: string;
  cognome: string;
  dataNascita: Date | string;
  sesso: 'M' | 'F';
  codiceCatastale: string; // Codice catastale del comune di nascita
}

/**
 * Calcola il codice fiscale italiano
 * 
 * @param dati - Dati anagrafici della persona
 * @returns Codice fiscale di 16 caratteri
 * 
 * @example
 * const cf = calcolaCodiceFiscale({
 *   nome: 'Mario',
 *   cognome: 'Rossi',
 *   dataNascita: new Date(1980, 0, 15),
 *   sesso: 'M',
 *   codiceCatastale: 'H501' // Roma
 * });
 */
export function calcolaCodiceFiscale(dati: DatiCodiceFiscale): string {
  // Converti data se stringa
  const dataNascita = typeof dati.dataNascita === 'string' 
    ? new Date(dati.dataNascita) 
    : dati.dataNascita;
  
  // Calcola i primi 15 caratteri
  const cognome3 = calcolaCognome(dati.cognome);
  const nome3 = calcolaNome(dati.nome);
  const dataSesso = calcolaDataNascitaSesso(dataNascita, dati.sesso);
  const codCatastale = dati.codiceCatastale.toUpperCase();
  
  const cf15 = cognome3 + nome3 + dataSesso + codCatastale;
  
  // Calcola check digit
  const checkDigit = calcolaCheckDigit(cf15);
  
  return cf15 + checkDigit;
}

/**
 * Valida un codice fiscale italiano
 * 
 * @param codiceFiscale - CF da validare
 * @returns true se valido, false altrimenti
 */
export function validaCodiceFiscale(codiceFiscale: string): boolean {
  if (!codiceFiscale || codiceFiscale.length !== 16) {
    return false;
  }
  
  const cf = codiceFiscale.toUpperCase();
  
  // Verifica formato con regex
  const cfPattern = /^[A-Z]{6}[0-9]{2}[ABCDEHLMPRST][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
  if (!cfPattern.test(cf)) {
    return false;
  }
  
  // Verifica check digit
  const cf15 = cf.substring(0, 15);
  const checkDigitAtteso = calcolaCheckDigit(cf15);
  
  return cf[15] === checkDigitAtteso;
}

/**
 * Estrae informazioni da un codice fiscale
 * 
 * @param codiceFiscale - CF da analizzare
 * @returns Informazioni estratte o null se CF non valido
 */
export function estraiInfoDaCodiceFiscale(codiceFiscale: string): {
  sesso: 'M' | 'F';
  annoNascita: number;
  meseNascita: number;
  giornoNascita: number;
  codiceCatastale: string;
} | null {
  if (!validaCodiceFiscale(codiceFiscale)) {
    return null;
  }
  
  const cf = codiceFiscale.toUpperCase();
  
  // Anno (2 cifre, va interpretato)
  const anno2cifre = parseInt(cf.substring(6, 8));
  const annoCorrente = new Date().getFullYear();
  const secolo = anno2cifre > (annoCorrente % 100) ? 1900 : 2000;
  const annoNascita = secolo + anno2cifre;
  
  // Mese
  const meseLetter = cf[8];
  const meseNascita = Object.entries(MESI_CF).find(([, v]) => v === meseLetter)?.[0];
  
  // Giorno e sesso
  let giornoNascita = parseInt(cf.substring(9, 11));
  const sesso: 'M' | 'F' = giornoNascita > 40 ? 'F' : 'M';
  if (sesso === 'F') {
    giornoNascita -= 40;
  }
  
  // Codice catastale
  const codiceCatastale = cf.substring(11, 15);
  
  return {
    sesso,
    annoNascita,
    meseNascita: parseInt(meseNascita || '0'),
    giornoNascita,
    codiceCatastale
  };
}

// =============================================================================
// EXPORT DEFAULT
// =============================================================================

export default {
  calcolaCodiceFiscale,
  validaCodiceFiscale,
  estraiInfoDaCodiceFiscale
};
