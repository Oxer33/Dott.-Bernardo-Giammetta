// =============================================================================
// CONFIGURAZIONE GLOBALE - DOTT. BERNARDO GIAMMETTA
// Account master e configurazioni di sistema
// =============================================================================

// =============================================================================
// ACCOUNT MASTER (ADMIN)
// Questi account hanno accesso completo a tutte le funzionalità
// =============================================================================

export const MASTER_ACCOUNTS = [
  'papa.danilo91tp@gmail.com',           // Danilo Papa - Developer
  'dr.giammettabernardo@gmail.com',      // Dott. Bernardo Giammetta - Email principale
  'accomodationlapulena@gmail.com',      // La Pulena - Account secondario
] as const;

// Verifica se un'email è un account master
// IMPORTANTE: Confronto case-insensitive per evitare problemi
export function isMasterAccount(email: string | null | undefined): boolean {
  if (!email) return false;
  const emailLower = email.toLowerCase();
  // Confronto esplicito senza cast TypeScript problematico
  return MASTER_ACCOUNTS.some(masterEmail => masterEmail.toLowerCase() === emailLower);
}

// =============================================================================
// CONFIGURAZIONE SITO
// =============================================================================

export const SITE_CONFIG = {
  name: 'Dott. Bernardo Giammetta',
  description: 'Biologo Nutrizionista',
  url: process.env.NEXTAUTH_URL || 'https://www.bernardogiammetta.com',
  email: 'info@bernardogiammetta.com',
  doctorEmail: 'dr.giammettabernardo@gmail.com', // Email per ricevere notifiche
  phone: '+39 392 0979135',
} as const;

// =============================================================================
// CONFIGURAZIONE AGENDA
// =============================================================================

export const AGENDA_CONFIG = {
  // Orari studio
  startHour: 8,
  startMinute: 30,
  endHour: 20,
  endMinute: 0,
  
  // Durata appuntamenti in minuti
  slotDuration: 30,
  firstVisitDuration: 90,
  followUpDuration: 60,
  
  // Preavviso minimo in ore
  minimumNoticeHours: 48,
  
  // Giorni lavorativi (0 = Domenica, 6 = Sabato)
  workingDays: [1, 2, 3, 4, 5], // Lun-Ven
} as const;
