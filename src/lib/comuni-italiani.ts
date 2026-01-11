// =============================================================================
// COMUNI ITALIANI - DATABASE E FUNZIONI DI RICERCA
// Permette di trovare codice catastale, sigla provincia e CAP
// =============================================================================

// Tipo per un comune italiano
export interface ComuneItaliano {
  denominazione_ita: string;      // Nome del comune
  sigla_provincia: string;        // Sigla provincia (es: "RM", "MI")
  codice_belfiore: string;        // Codice catastale per CF (es: "H501" per Roma)
  codice_istat: string;           // Codice ISTAT
  cap?: string;                   // CAP (opzionale, non tutti i comuni ce l'hanno nel JSON)
}

// Cache per i comuni caricati
let comuniCache: ComuneItaliano[] | null = null;

/**
 * Carica i comuni dal file JSON
 * Usa una cache per evitare di ricaricare ogni volta
 */
export async function caricaComuni(): Promise<ComuneItaliano[]> {
  if (comuniCache) {
    return comuniCache;
  }
  
  try {
    // In ambiente browser/Next.js, facciamo una fetch
    const response = await fetch('/api/comuni?limit=10000');
    const data = await response.json();
    
    if (data.success && data.comuni) {
      // Mappa al formato ComuneItaliano
      const mappedComuni: ComuneItaliano[] = data.comuni.map((c: { nome: string; provincia: string; codiceCatastale: string }) => ({
        denominazione_ita: c.nome,
        sigla_provincia: c.provincia,
        codice_belfiore: c.codiceCatastale,
        codice_istat: '',
      }));
      comuniCache = mappedComuni;
      return mappedComuni;
    }
    
    return [];
  } catch (error) {
    console.error('Errore caricamento comuni:', error);
    return [];
  }
}

/**
 * Normalizza una stringa per la ricerca (rimuove accenti, lowercase)
 */
function normalizzaPerRicerca(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
    .replace(/[^a-z\s]/g, '') // Mantiene solo lettere e spazi
    .trim();
}

/**
 * Cerca comuni per nome (autocomplete)
 * Restituisce max 10 risultati ordinati per rilevanza
 */
export function cercaComuni(
  comuni: ComuneItaliano[],
  query: string,
  maxRisultati: number = 10
): ComuneItaliano[] {
  if (!query || query.length < 2) {
    return [];
  }
  
  const queryNorm = normalizzaPerRicerca(query);
  
  // Filtra comuni che iniziano con la query o la contengono
  const risultati = comuni
    .filter(c => {
      const nomeNorm = normalizzaPerRicerca(c.denominazione_ita);
      return nomeNorm.startsWith(queryNorm) || nomeNorm.includes(queryNorm);
    })
    .sort((a, b) => {
      const aNorm = normalizzaPerRicerca(a.denominazione_ita);
      const bNorm = normalizzaPerRicerca(b.denominazione_ita);
      
      // Prima quelli che iniziano con la query
      const aStarts = aNorm.startsWith(queryNorm);
      const bStarts = bNorm.startsWith(queryNorm);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Poi ordine alfabetico
      return aNorm.localeCompare(bNorm);
    })
    .slice(0, maxRisultati);
  
  return risultati;
}

/**
 * Trova un comune esatto per nome
 */
export function trovaComunePerNome(
  comuni: ComuneItaliano[],
  nome: string
): ComuneItaliano | null {
  if (!nome) return null;
  
  const nomeNorm = normalizzaPerRicerca(nome);
  
  return comuni.find(c => 
    normalizzaPerRicerca(c.denominazione_ita) === nomeNorm
  ) || null;
}

/**
 * Trova un comune per codice catastale (belfiore)
 */
export function trovaComunePerCodice(
  comuni: ComuneItaliano[],
  codiceBelfiore: string
): ComuneItaliano | null {
  if (!codiceBelfiore) return null;
  
  const codiceUpper = codiceBelfiore.toUpperCase();
  
  return comuni.find(c => 
    c.codice_belfiore.toUpperCase() === codiceUpper
  ) || null;
}

/**
 * Ottieni la sigla provincia da un nome comune
 */
export function getSiglaProvincia(
  comuni: ComuneItaliano[],
  nomeComune: string
): string | null {
  const comune = trovaComunePerNome(comuni, nomeComune);
  return comune?.sigla_provincia || null;
}

/**
 * Ottieni il codice catastale (belfiore) da un nome comune
 */
export function getCodiceCatastale(
  comuni: ComuneItaliano[],
  nomeComune: string
): string | null {
  const comune = trovaComunePerNome(comuni, nomeComune);
  return comune?.codice_belfiore || null;
}

// =============================================================================
// MAPPA CAP PRINCIPALI CITTÀ
// Per i CAP usiamo una mappa statica delle città principali
// In un'implementazione completa si userebbe un database dedicato
// =============================================================================

const CAP_CITTA_PRINCIPALI: Record<string, string> = {
  // Capoluoghi di regione e città principali
  'roma': '00100',
  'milano': '20100',
  'napoli': '80100',
  'torino': '10100',
  'palermo': '90100',
  'genova': '16100',
  'bologna': '40100',
  'firenze': '50100',
  'bari': '70100',
  'catania': '95100',
  'venezia': '30100',
  'verona': '37100',
  'messina': '98100',
  'padova': '35100',
  'trieste': '34100',
  'taranto': '74100',
  'brescia': '25100',
  'reggio calabria': '89100',
  'modena': '41100',
  'prato': '59100',
  'parma': '43100',
  'cagliari': '09100',
  'livorno': '57100',
  'perugia': '06100',
  'foggia': '71100',
  'reggio emilia': '42100',
  'salerno': '84100',
  'ravenna': '48100',
  'ferrara': '44100',
  'rimini': '47900',
  'siracusa': '96100',
  'sassari': '07100',
  'latina': '04100',
  'monza': '20900',
  'bergamo': '24100',
  'pescara': '65100',
  'trento': '38100',
  'vicenza': '36100',
  'terni': '05100',
  'bolzano': '39100',
  'novara': '28100',
  'ancona': '60100',
  'andria': '76123',
  'udine': '33100',
  'arezzo': '52100',
  'cesena': '47521',
  'lecce': '73100',
  'pesaro': '61121',
  'barletta': '76121',
  'alessandria': '15121',
  'la spezia': '19121',
  'pisa': '56100',
  'catanzaro': '88100',
  'brindisi': '72100',
  'potenza': '85100',
  'como': '22100',
  'campobasso': '86100',
  'l\'aquila': '67100',
  'aosta': '11100',
};

/**
 * Ottieni il CAP di una città principale
 * Restituisce null se la città non è nella mappa
 */
export function getCapCitta(nomeComune: string): string | null {
  if (!nomeComune) return null;
  
  const nomeNorm = normalizzaPerRicerca(nomeComune);
  return CAP_CITTA_PRINCIPALI[nomeNorm] || null;
}

// =============================================================================
// EXPORT
// =============================================================================

export default {
  caricaComuni,
  cercaComuni,
  trovaComunePerNome,
  trovaComunePerCodice,
  getSiglaProvincia,
  getCodiceCatastale,
  getCapCitta,
};
