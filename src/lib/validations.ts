// =============================================================================
// VALIDATIONS - DOTT. BERNARDO GIAMMETTA
// Schemi di validazione Zod centralizzati per form e API
// =============================================================================

import { z } from 'zod';

// =============================================================================
// MESSAGGI DI ERRORE COMUNI
// =============================================================================

export const errorMessages = {
  required: 'Questo campo è obbligatorio',
  email: 'Inserisci un indirizzo email valido',
  phone: 'Inserisci un numero di telefono valido',
  minLength: (min: number) => `Minimo ${min} caratteri`,
  maxLength: (max: number) => `Massimo ${max} caratteri`,
  password: 'La password deve contenere almeno 8 caratteri, una maiuscola e un numero',
  passwordMatch: 'Le password non corrispondono',
  codiceFiscale: 'Codice fiscale non valido',
  date: 'Data non valida',
  futureDate: 'La data deve essere nel futuro',
  pastDate: 'La data deve essere nel passato',
};

// =============================================================================
// REGEX PATTERNS
// =============================================================================

export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+39)?[\s]?[0-9]{8,12}$/,
  codiceFiscale: /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i,
  cap: /^[0-9]{5}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
};

// =============================================================================
// SCHEMI BASE RIUTILIZZABILI
// =============================================================================

// Email
export const emailSchema = z
  .string()
  .min(1, errorMessages.required)
  .email(errorMessages.email)
  .toLowerCase()
  .trim();

// Password
export const passwordSchema = z
  .string()
  .min(8, errorMessages.minLength(8))
  .regex(patterns.password, errorMessages.password);

// Telefono
export const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || patterns.phone.test(val.replace(/[\s-]/g, '')),
    errorMessages.phone
  );

// Codice Fiscale
export const codiceFiscaleSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || patterns.codiceFiscale.test(val),
    errorMessages.codiceFiscale
  );

// CAP
export const capSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || patterns.cap.test(val),
    'CAP non valido (5 cifre)'
  );

// Nome/Cognome
export const nameSchema = z
  .string()
  .min(2, errorMessages.minLength(2))
  .max(50, errorMessages.maxLength(50))
  .trim();

// =============================================================================
// SCHEMA REGISTRAZIONE
// =============================================================================

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, errorMessages.required),
  name: nameSchema,
  phone: phoneSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Devi accettare i termini e le condizioni',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: errorMessages.passwordMatch,
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// =============================================================================
// SCHEMA LOGIN
// =============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, errorMessages.required),
});

export type LoginInput = z.infer<typeof loginSchema>;

// =============================================================================
// SCHEMA CONTATTO
// =============================================================================

export const contactSchema = z.object({
  name: nameSchema,
  contactInfo: z
    .string()
    .min(1, errorMessages.required)
    .refine(
      (val) => patterns.email.test(val) || patterns.phone.test(val.replace(/[\s-]/g, '')),
      'Inserisci un\'email o un numero di telefono valido'
    ),
  message: z
    .string()
    .min(10, errorMessages.minLength(10))
    .max(1000, errorMessages.maxLength(1000)),
});

export type ContactInput = z.infer<typeof contactSchema>;

// =============================================================================
// SCHEMA PROFILO UTENTE
// =============================================================================

export const profileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema,
  birthDate: z.string().optional(),
  birthPlace: z.string().max(100).optional(),
  gender: z.enum(['M', 'F']).optional(),
  codiceFiscale: codiceFiscaleSchema,
  address: z.string().max(200).optional(),
  addressNumber: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  province: z.string().length(2).optional(),
  cap: capSchema,
});

export type ProfileInput = z.infer<typeof profileSchema>;

// =============================================================================
// SCHEMA APPUNTAMENTO
// =============================================================================

export const appointmentSchema = z.object({
  startTime: z.string().datetime(),
  type: z.enum(['FIRST_VISIT', 'FOLLOW_UP']).default('FOLLOW_UP'),
  notes: z.string().max(500).optional(),
  userId: z.string().optional(), // Solo per admin
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

// =============================================================================
// SCHEMA BLOCCO ORARIO
// =============================================================================

export const timeBlockSchema = z.object({
  type: z.enum(['RECURRING', 'OCCASIONAL']),
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato ora non valido (HH:MM)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato ora non valido (HH:MM)'),
  specificDate: z.string().datetime().optional(),
  note: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
}).refine(
  (data) => {
    if (data.type === 'RECURRING' && data.dayOfWeek === undefined) {
      return false;
    }
    if (data.type === 'OCCASIONAL' && !data.specificDate) {
      return false;
    }
    return true;
  },
  {
    message: 'Blocco ricorrente richiede giorno settimana, occasionale richiede data specifica',
  }
);

export type TimeBlockInput = z.infer<typeof timeBlockSchema>;

// =============================================================================
// SCHEMA FATTURA
// =============================================================================

export const invoiceSchema = z.object({
  userId: z.string().min(1, 'Paziente richiesto'),
  invoiceDate: z.string().datetime(),
  subtotal: z.number().positive('Importo deve essere positivo'),
  description: z.string().min(1, 'Descrizione richiesta').max(500),
  paymentMethod: z.enum(['MP01', 'MP05', 'MP08'], {
    errorMap: () => ({ message: 'Metodo pagamento non valido' }),
  }),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Valida dati con schema e ritorna errori formattati
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}

/**
 * Estrae primo errore da ZodError
 */
export function getFirstError(error: z.ZodError): string {
  return error.issues[0]?.message || 'Errore di validazione';
}

/**
 * Formatta errori Zod per form
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

export default {
  registerSchema,
  loginSchema,
  contactSchema,
  profileSchema,
  appointmentSchema,
  timeBlockSchema,
  invoiceSchema,
  validateWithSchema,
};
