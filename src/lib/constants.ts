// =============================================================================
// CONSTANTS - DOTT. BERNARDO GIAMMETTA
// Costanti centralizzate per l'applicazione
// =============================================================================

// =============================================================================
// ROUTES
// Percorsi dell'applicazione
// =============================================================================

export const ROUTES = {
  // Pubbliche
  HOME: '/',
  CHI_SONO: '/chi-sono',
  SERVIZI: '/servizi',
  BLOG: '/blog',
  CONTATTI: '/contatti',
  
  // Auth
  ACCEDI: '/accedi',
  REGISTRATI: '/registrati',
  VERIFY_EMAIL: '/api/auth/verify-email',
  
  // Protette
  AREA_PERSONALE: '/area-personale',
  PROFILO: '/profilo',
  QUESTIONARIO: '/profilo/questionario',
  AGENDA: '/agenda',
  ADMIN: '/admin',
  
  // Legali
  PRIVACY: '/privacy',
  COOKIE: '/cookie',
  TERMINI: '/termini',
  
  // API
  API: {
    AUTH: {
      REGISTER: '/api/auth/register',
      VERIFY_EMAIL: '/api/auth/verify-email',
    },
    CONTACT: '/api/contact',
    AGENDA: {
      AVAILABILITY: '/api/agenda/availability',
      APPOINTMENTS: '/api/agenda/appointments',
    },
    ADMIN: {
      PATIENTS: '/api/admin/patients',
      APPOINTMENTS: '/api/admin/appointments',
      TIMEBLOCKS: '/api/admin/timeblocks',
    },
    USER: {
      PROFILE: '/api/user/profile',
      QUESTIONNAIRE: '/api/user/questionnaire',
    },
    NUTRIBOT: '/api/nutribot',
  },
} as const;

// =============================================================================
// RUOLI E PERMESSI
// =============================================================================

export const ROLES = {
  ADMIN: 'ADMIN',
  PATIENT: 'PATIENT',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = {
  // Admin
  MANAGE_PATIENTS: 'manage_patients',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  MANAGE_TIMEBLOCKS: 'manage_timeblocks',
  VIEW_ALL_DATA: 'view_all_data',
  
  // Patient
  BOOK_APPOINTMENT: 'book_appointment',
  VIEW_OWN_DATA: 'view_own_data',
  EDIT_PROFILE: 'edit_profile',
} as const;

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: Object.values(PERMISSIONS),
  PATIENT: [
    PERMISSIONS.BOOK_APPOINTMENT,
    PERMISSIONS.VIEW_OWN_DATA,
    PERMISSIONS.EDIT_PROFILE,
  ],
};

// =============================================================================
// APPUNTAMENTI
// =============================================================================

export const APPOINTMENT_TYPES = {
  FIRST_VISIT: 'FIRST_VISIT',
  FOLLOW_UP: 'FOLLOW_UP',
} as const;

export type AppointmentType = typeof APPOINTMENT_TYPES[keyof typeof APPOINTMENT_TYPES];

export const APPOINTMENT_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];

export const APPOINTMENT_DURATION = {
  FIRST_VISIT: 90, // minuti
  FOLLOW_UP: 60,   // minuti
} as const;

export const APPOINTMENT_LABELS = {
  FIRST_VISIT: 'Prima Visita',
  FOLLOW_UP: 'Visita di Controllo',
} as const;

export const STATUS_LABELS = {
  CONFIRMED: 'Confermato',
  CANCELLED: 'Cancellato',
  COMPLETED: 'Completato',
  NO_SHOW: 'Assente',
} as const;

export const STATUS_COLORS = {
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  NO_SHOW: 'bg-gray-100 text-gray-800',
} as const;

// =============================================================================
// FATTURAZIONE
// =============================================================================

export const PAYMENT_METHODS = {
  MP01: { code: 'MP01', label: 'Contanti' },
  MP05: { code: 'MP05', label: 'Bonifico Bancario' },
  MP08: { code: 'MP08', label: 'Carta di Credito/POS' },
} as const;

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export const INVOICE_STATUS_LABELS = {
  DRAFT: 'Bozza',
  ISSUED: 'Emessa',
  PAID: 'Pagata',
  CANCELLED: 'Annullata',
} as const;

// Aliquota contributo previdenziale (4%)
export const CONTRIBUTO_RATE = 0.04;

// Soglia marca da bollo
export const BOLLO_THRESHOLD = 77.47;
export const BOLLO_AMOUNT = 2.0;

// =============================================================================
// LIMITI E CONFIGURAZIONE
// =============================================================================

export const LIMITS = {
  // Rate limiting (richieste per minuto)
  RATE_LIMIT: {
    CONTACT_FORM: 5,
    REGISTER: 3,
    LOGIN: 10,
    API_GENERAL: 60,
  },
  
  // Dimensioni
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_MESSAGE_LENGTH: 1000,
  MAX_NOTES_LENGTH: 500,
  
  // Prenotazioni
  MAX_ACTIVE_BOOKINGS_PATIENT: 1,
  MAX_ACTIVE_BOOKINGS_ADMIN: 999,
  
  // Token
  VERIFICATION_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 ore in ms
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 giorni in secondi
  
  // Cache
  CACHE_TTL: {
    SHORT: 5 * 60 * 1000,    // 5 minuti
    MEDIUM: 30 * 60 * 1000,  // 30 minuti
    LONG: 60 * 60 * 1000,    // 1 ora
  },
} as const;

// =============================================================================
// REGEX PATTERNS
// =============================================================================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+39)?[\s]?[0-9]{8,12}$/,
  CODICE_FISCALE: /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i,
  CAP: /^[0-9]{5}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const;

// =============================================================================
// GIORNI E MESI
// =============================================================================

export const DAYS_OF_WEEK = [
  'Domenica',
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
] as const;

export const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'] as const;

export const MONTHS = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
] as const;

export const MONTHS_SHORT = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic',
] as const;

// =============================================================================
// PROVINCE ITALIANE
// =============================================================================

export const PROVINCE = [
  { code: 'AG', name: 'Agrigento' },
  { code: 'AL', name: 'Alessandria' },
  { code: 'AN', name: 'Ancona' },
  { code: 'AO', name: 'Aosta' },
  { code: 'AR', name: 'Arezzo' },
  { code: 'AP', name: 'Ascoli Piceno' },
  { code: 'AT', name: 'Asti' },
  { code: 'AV', name: 'Avellino' },
  { code: 'BA', name: 'Bari' },
  { code: 'BT', name: 'Barletta-Andria-Trani' },
  { code: 'BL', name: 'Belluno' },
  { code: 'BN', name: 'Benevento' },
  { code: 'BG', name: 'Bergamo' },
  { code: 'BI', name: 'Biella' },
  { code: 'BO', name: 'Bologna' },
  { code: 'BZ', name: 'Bolzano' },
  { code: 'BS', name: 'Brescia' },
  { code: 'BR', name: 'Brindisi' },
  { code: 'CA', name: 'Cagliari' },
  { code: 'CL', name: 'Caltanissetta' },
  { code: 'CB', name: 'Campobasso' },
  { code: 'CE', name: 'Caserta' },
  { code: 'CT', name: 'Catania' },
  { code: 'CZ', name: 'Catanzaro' },
  { code: 'CH', name: 'Chieti' },
  { code: 'CO', name: 'Como' },
  { code: 'CS', name: 'Cosenza' },
  { code: 'CR', name: 'Cremona' },
  { code: 'KR', name: 'Crotone' },
  { code: 'CN', name: 'Cuneo' },
  { code: 'EN', name: 'Enna' },
  { code: 'FM', name: 'Fermo' },
  { code: 'FE', name: 'Ferrara' },
  { code: 'FI', name: 'Firenze' },
  { code: 'FG', name: 'Foggia' },
  { code: 'FC', name: 'Forlì-Cesena' },
  { code: 'FR', name: 'Frosinone' },
  { code: 'GE', name: 'Genova' },
  { code: 'GO', name: 'Gorizia' },
  { code: 'GR', name: 'Grosseto' },
  { code: 'IM', name: 'Imperia' },
  { code: 'IS', name: 'Isernia' },
  { code: 'SP', name: 'La Spezia' },
  { code: 'AQ', name: "L'Aquila" },
  { code: 'LT', name: 'Latina' },
  { code: 'LE', name: 'Lecce' },
  { code: 'LC', name: 'Lecco' },
  { code: 'LI', name: 'Livorno' },
  { code: 'LO', name: 'Lodi' },
  { code: 'LU', name: 'Lucca' },
  { code: 'MC', name: 'Macerata' },
  { code: 'MN', name: 'Mantova' },
  { code: 'MS', name: 'Massa-Carrara' },
  { code: 'MT', name: 'Matera' },
  { code: 'ME', name: 'Messina' },
  { code: 'MI', name: 'Milano' },
  { code: 'MO', name: 'Modena' },
  { code: 'MB', name: 'Monza e Brianza' },
  { code: 'NA', name: 'Napoli' },
  { code: 'NO', name: 'Novara' },
  { code: 'NU', name: 'Nuoro' },
  { code: 'OR', name: 'Oristano' },
  { code: 'PD', name: 'Padova' },
  { code: 'PA', name: 'Palermo' },
  { code: 'PR', name: 'Parma' },
  { code: 'PV', name: 'Pavia' },
  { code: 'PG', name: 'Perugia' },
  { code: 'PU', name: 'Pesaro e Urbino' },
  { code: 'PE', name: 'Pescara' },
  { code: 'PC', name: 'Piacenza' },
  { code: 'PI', name: 'Pisa' },
  { code: 'PT', name: 'Pistoia' },
  { code: 'PN', name: 'Pordenone' },
  { code: 'PZ', name: 'Potenza' },
  { code: 'PO', name: 'Prato' },
  { code: 'RG', name: 'Ragusa' },
  { code: 'RA', name: 'Ravenna' },
  { code: 'RC', name: 'Reggio Calabria' },
  { code: 'RE', name: 'Reggio Emilia' },
  { code: 'RI', name: 'Rieti' },
  { code: 'RN', name: 'Rimini' },
  { code: 'RM', name: 'Roma' },
  { code: 'RO', name: 'Rovigo' },
  { code: 'SA', name: 'Salerno' },
  { code: 'SS', name: 'Sassari' },
  { code: 'SV', name: 'Savona' },
  { code: 'SI', name: 'Siena' },
  { code: 'SR', name: 'Siracusa' },
  { code: 'SO', name: 'Sondrio' },
  { code: 'SU', name: 'Sud Sardegna' },
  { code: 'TA', name: 'Taranto' },
  { code: 'TE', name: 'Teramo' },
  { code: 'TR', name: 'Terni' },
  { code: 'TO', name: 'Torino' },
  { code: 'TP', name: 'Trapani' },
  { code: 'TN', name: 'Trento' },
  { code: 'TV', name: 'Treviso' },
  { code: 'TS', name: 'Trieste' },
  { code: 'UD', name: 'Udine' },
  { code: 'VA', name: 'Varese' },
  { code: 'VE', name: 'Venezia' },
  { code: 'VB', name: 'Verbano-Cusio-Ossola' },
  { code: 'VC', name: 'Vercelli' },
  { code: 'VR', name: 'Verona' },
  { code: 'VV', name: 'Vibo Valentia' },
  { code: 'VI', name: 'Vicenza' },
  { code: 'VT', name: 'Viterbo' },
] as const;

// =============================================================================
// MESSAGGI
// =============================================================================

export const MESSAGES = {
  // Successo
  SUCCESS: {
    SAVED: 'Salvato con successo',
    DELETED: 'Eliminato con successo',
    UPDATED: 'Aggiornato con successo',
    SENT: 'Inviato con successo',
    BOOKED: 'Prenotazione confermata',
    CANCELLED: 'Cancellato con successo',
  },
  
  // Errori
  ERROR: {
    GENERIC: 'Si è verificato un errore. Riprova.',
    NETWORK: 'Errore di connessione. Verifica la tua rete.',
    UNAUTHORIZED: 'Sessione scaduta. Effettua nuovamente il login.',
    FORBIDDEN: 'Non hai i permessi per questa azione.',
    NOT_FOUND: 'Risorsa non trovata.',
    VALIDATION: 'I dati inseriti non sono validi.',
    RATE_LIMITED: 'Troppe richieste. Attendi un momento.',
  },
  
  // Conferme
  CONFIRM: {
    DELETE: 'Sei sicuro di voler eliminare questo elemento?',
    CANCEL_APPOINTMENT: 'Sei sicuro di voler cancellare questo appuntamento?',
    LOGOUT: 'Sei sicuro di voler uscire?',
  },
} as const;

export default {
  ROUTES,
  ROLES,
  PERMISSIONS,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  LIMITS,
  REGEX,
  MESSAGES,
};
