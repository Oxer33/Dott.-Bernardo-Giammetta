// =============================================================================
// API UTILITIES - DOTT. BERNARDO GIAMMETTA
// Utilities per gestione API: retry logic, error handling, rate limiting
// =============================================================================

import { NextResponse } from 'next/server';

// =============================================================================
// TIPI
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp?: string;
}

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  retryOn?: (error: Error) => boolean;
}

export interface RateLimitConfig {
  windowMs: number;      // Finestra temporale in ms
  maxRequests: number;   // Richieste massime per finestra
}

// =============================================================================
// RATE LIMITING IN-MEMORY
// Per produzione usare Redis
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store in-memory per rate limiting (per sviluppo/piccola scala)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Pulizia periodica dello store (ogni 5 minuti)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const entries = Array.from(rateLimitStore.entries());
    entries.forEach(([key, entry]) => {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Verifica rate limit per una chiave (IP o userId)
 * @returns true se la richiesta è permessa, false se rate limited
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Se non esiste o è scaduto, crea nuova entry
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Incrementa contatore
  entry.count++;
  rateLimitStore.set(key, entry);

  const allowed = entry.count <= config.maxRequests;
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

/**
 * Estrae IP dalla request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// =============================================================================
// RETRY LOGIC
// =============================================================================

/**
 * Esegue una funzione con retry automatico
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    retryOn = () => true,
  } = options;

  let lastError: Error | null = null;
  let currentDelay = delayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Se è l'ultimo tentativo o non dobbiamo riprovare, lancia errore
      if (attempt === maxRetries || !retryOn(lastError)) {
        throw lastError;
      }

      // Aspetta prima del prossimo tentativo
      await sleep(currentDelay);
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Codici errore standard
 */
export const ErrorCodes = {
  // Auth errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  
  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // Business logic
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Classe errore custom per API
 */
export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Crea risposta errore standard
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  code: ErrorCode = ErrorCodes.INTERNAL_ERROR
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Crea risposta successo standard
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Handler wrapper per gestione errori automatica
 */
export async function withErrorHandling<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>> | NextResponse<ApiResponse>> {
  try {
    return await handler();
  } catch (error) {
    // Log errore in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[API Error]', error);
    }

    // Gestione ApiError custom
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode, error.code);
    }

    // Errore generico
    const message = error instanceof Error ? error.message : 'Errore interno del server';
    return errorResponse(message, 500, ErrorCodes.INTERNAL_ERROR);
  }
}

// =============================================================================
// VALIDAZIONE
// =============================================================================

/**
 * Verifica che un oggetto abbia tutti i campi richiesti
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const field of requiredFields) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      missing.push(String(field));
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Sanitizza stringa per prevenire XSS base
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Valida formato email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida formato telefono italiano
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+39)?[\s]?[0-9]{8,12}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

// =============================================================================
// LOGGING
// =============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Logger strutturato
 */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      logEntry('debug', message, context);
    }
  },
  
  info: (message: string, context?: Record<string, unknown>) => {
    logEntry('info', message, context);
  },
  
  warn: (message: string, context?: Record<string, unknown>) => {
    logEntry('warn', message, context);
  },
  
  error: (message: string, context?: Record<string, unknown>) => {
    logEntry('error', message, context);
  },
};

function logEntry(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  // In produzione, potremmo inviare a CloudWatch o altro servizio
  // Per ora, usiamo console con formato strutturato
  const logFn = level === 'error' ? console.error : 
                level === 'warn' ? console.warn : 
                console.log;
  
  // eslint-disable-next-line no-console
  logFn(JSON.stringify(entry));
}
