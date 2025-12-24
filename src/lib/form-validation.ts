// =============================================================================
// FORM VALIDATION - DOTT. BERNARDO GIAMMETTA
// Validazione avanzata form lato client e server
// =============================================================================

import { z } from 'zod';

// =============================================================================
// MESSAGGI ERRORE ITALIANI
// =============================================================================

const messages = {
  required: 'Campo obbligatorio',
  email: 'Inserisci un indirizzo email valido',
  phone: 'Inserisci un numero di telefono valido',
  password: {
    min: 'La password deve avere almeno 8 caratteri',
    uppercase: 'La password deve contenere almeno una lettera maiuscola',
    lowercase: 'La password deve contenere almeno una lettera minuscola',
    number: 'La password deve contenere almeno un numero',
    special: 'La password deve contenere almeno un carattere speciale',
  },
  name: {
    min: 'Il nome deve avere almeno 2 caratteri',
    max: 'Il nome non può superare i 100 caratteri',
  },
  date: {
    invalid: 'Data non valida',
    past: 'La data deve essere nel passato',
    future: 'La data deve essere nel futuro',
    minAge: 'Devi avere almeno 18 anni',
  },
  cf: 'Codice fiscale non valido',
  cap: 'CAP non valido (5 cifre)',
  url: 'URL non valido',
  number: {
    positive: 'Il valore deve essere positivo',
    integer: 'Il valore deve essere un numero intero',
    min: (min: number) => `Il valore minimo è ${min}`,
    max: (max: number) => `Il valore massimo è ${max}`,
  },
};

// =============================================================================
// REGEX PATTERNS
// =============================================================================

export const patterns = {
  // Email RFC 5322 semplificata
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Telefono italiano (fisso o mobile)
  phone: /^(\+39)?[\s]?[0-9]{2,4}[\s]?[0-9]{5,8}$/,
  
  // Cellulare italiano
  mobile: /^(\+39)?[\s]?3[0-9]{2}[\s]?[0-9]{6,7}$/,
  
  // Codice fiscale italiano
  codiceFiscale: /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i,
  
  // CAP italiano
  cap: /^[0-9]{5}$/,
  
  // Partita IVA italiana
  partitaIva: /^[0-9]{11}$/,
  
  // Password forte
  passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Solo lettere (anche accentate)
  onlyLetters: /^[a-zA-ZàèéìòùÀÈÉÌÒÙ\s'-]+$/,
  
  // Solo numeri
  onlyNumbers: /^[0-9]+$/,
  
  // Alfanumerico
  alphanumeric: /^[a-zA-Z0-9]+$/,
  
  // URL
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  
  // Data formato italiano (dd/mm/yyyy)
  dateIt: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/,
  
  // Data formato ISO (yyyy-mm-dd)
  dateIso: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
};

// =============================================================================
// SCHEMI ZOD RIUTILIZZABILI
// =============================================================================

// Email validata
export const emailSchema = z
  .string({ required_error: messages.required })
  .min(1, messages.required)
  .email(messages.email)
  .max(254, 'Email troppo lunga')
  .transform(val => val.toLowerCase().trim());

// Password forte
export const passwordSchema = z
  .string({ required_error: messages.required })
  .min(8, messages.password.min)
  .refine(val => /[a-z]/.test(val), messages.password.lowercase)
  .refine(val => /[A-Z]/.test(val), messages.password.uppercase)
  .refine(val => /[0-9]/.test(val), messages.password.number);

// Password con caratteri speciali (più sicura)
export const passwordStrongSchema = passwordSchema
  .refine(val => /[@$!%*?&]/.test(val), messages.password.special);

// Nome/Cognome
export const nameSchema = z
  .string({ required_error: messages.required })
  .min(2, messages.name.min)
  .max(100, messages.name.max)
  .regex(patterns.onlyLetters, 'Sono consentite solo lettere')
  .transform(val => val.trim());

// Telefono italiano
export const phoneSchema = z
  .string()
  .regex(patterns.phone, messages.phone)
  .optional()
  .or(z.literal(''));

// Cellulare italiano
export const mobileSchema = z
  .string({ required_error: messages.required })
  .regex(patterns.mobile, 'Inserisci un numero di cellulare valido');

// Codice fiscale
export const codiceFiscaleSchema = z
  .string({ required_error: messages.required })
  .length(16, 'Il codice fiscale deve avere 16 caratteri')
  .regex(patterns.codiceFiscale, messages.cf)
  .transform(val => val.toUpperCase());

// CAP italiano
export const capSchema = z
  .string({ required_error: messages.required })
  .regex(patterns.cap, messages.cap);

// Data di nascita (età minima 18)
export const birthDateSchema = z
  .string({ required_error: messages.required })
  .refine(val => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, messages.date.invalid)
  .refine(val => {
    const date = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, messages.date.minAge);

// Data futura (per appuntamenti)
export const futureDateSchema = z
  .string({ required_error: messages.required })
  .refine(val => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, messages.date.future);

// URL opzionale
export const urlSchema = z
  .string()
  .url(messages.url)
  .optional()
  .or(z.literal(''));

// Testo generico con lunghezza
export const textSchema = (min: number = 1, max: number = 1000) => z
  .string({ required_error: messages.required })
  .min(min, `Minimo ${min} caratteri`)
  .max(max, `Massimo ${max} caratteri`)
  .transform(val => val.trim());

// Numero positivo
export const positiveNumberSchema = z
  .number({ required_error: messages.required })
  .positive(messages.number.positive);

// Numero intero positivo
export const positiveIntSchema = z
  .number({ required_error: messages.required })
  .int(messages.number.integer)
  .positive(messages.number.positive);

// =============================================================================
// SCHEMI FORM COMPLETI
// =============================================================================

// Form di registrazione
export const registerFormSchema = z.object({
  name: nameSchema,
  surname: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema,
  acceptTerms: z.boolean().refine(val => val === true, 'Devi accettare i termini'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'Devi accettare la privacy policy'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Le password non coincidono',
  path: ['confirmPassword'],
});

// Form di login
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, messages.required),
  rememberMe: z.boolean().optional(),
});

// Form di contatto
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: textSchema(3, 100),
  message: textSchema(10, 2000),
  privacy: z.boolean().refine(val => val === true, 'Devi accettare la privacy policy'),
});

// Form profilo
export const profileFormSchema = z.object({
  name: nameSchema,
  surname: nameSchema,
  phone: phoneSchema,
  birthDate: z.string().optional(),
  address: textSchema(0, 200).optional(),
  city: textSchema(0, 100).optional(),
  cap: capSchema.optional().or(z.literal('')),
  province: z.string().max(2).optional(),
});

// Form prenotazione
export const bookingFormSchema = z.object({
  date: futureDateSchema,
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Orario non valido'),
  type: z.enum(['FIRST_VISIT', 'FOLLOW_UP']),
  notes: textSchema(0, 500).optional(),
});

// =============================================================================
// FUNZIONI DI VALIDAZIONE
// =============================================================================

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  return patterns.email.test(email);
}

/**
 * Valida telefono italiano
 */
export function isValidPhone(phone: string): boolean {
  return patterns.phone.test(phone.replace(/\s/g, ''));
}

/**
 * Valida codice fiscale italiano
 */
export function isValidCodiceFiscale(cf: string): boolean {
  if (!patterns.codiceFiscale.test(cf)) return false;
  
  // Verifica carattere di controllo
  const even: Record<string, number> = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
    'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25,
  };
  
  const odd: Record<string, number> = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23,
  };
  
  const cfUpper = cf.toUpperCase();
  let sum = 0;
  
  for (let i = 0; i < 15; i++) {
    const char = cfUpper[i];
    sum += i % 2 === 0 ? odd[char] : even[char];
  }
  
  const expectedCheck = String.fromCharCode(65 + (sum % 26));
  return cfUpper[15] === expectedCheck;
}

/**
 * Valida partita IVA italiana
 */
export function isValidPartitaIva(piva: string): boolean {
  if (!patterns.partitaIva.test(piva)) return false;
  
  // Algoritmo di Luhn per P.IVA italiana
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    let digit = parseInt(piva[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  return sum % 10 === 0;
}

/**
 * Calcola forza password (0-100)
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;
  
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[@$!%*?&]/.test(password)) strength += 15;
  
  return Math.min(100, strength);
}

/**
 * Formatta numero di telefono
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('39')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  
  if (cleaned.length === 10 && cleaned.startsWith('3')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
}

/**
 * Formatta codice fiscale
 */
export function formatCodiceFiscale(cf: string): string {
  return cf.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
}

export default {
  patterns,
  emailSchema,
  passwordSchema,
  nameSchema,
  phoneSchema,
  registerFormSchema,
  loginFormSchema,
  contactFormSchema,
  profileFormSchema,
  bookingFormSchema,
  isValidEmail,
  isValidPhone,
  isValidCodiceFiscale,
  isValidPartitaIva,
  calculatePasswordStrength,
  formatPhone,
  formatCodiceFiscale,
};
