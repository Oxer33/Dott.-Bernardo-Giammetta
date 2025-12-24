// =============================================================================
// ERROR HANDLER - DOTT. BERNARDO GIAMMETTA
// Gestione centralizzata degli errori per stabilità applicazione
// =============================================================================

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

// =============================================================================
// TIPI ERRORE
// =============================================================================

export enum ErrorCode {
  // Auth errors (1xxx)
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',
  
  // Validation errors (2xxx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Database errors (3xxx)
  DB_CONNECTION = 'DB_CONNECTION',
  DB_QUERY = 'DB_QUERY',
  DB_CONSTRAINT = 'DB_CONSTRAINT',
  DB_NOT_FOUND = 'DB_NOT_FOUND',
  DB_DUPLICATE = 'DB_DUPLICATE',
  
  // Business logic errors (4xxx)
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  NOT_ALLOWED = 'NOT_ALLOWED',
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  CONFLICT = 'CONFLICT',
  
  // External service errors (5xxx)
  EMAIL_FAILED = 'EMAIL_FAILED',
  API_TIMEOUT = 'API_TIMEOUT',
  EXTERNAL_ERROR = 'EXTERNAL_ERROR',
  
  // Server errors (9xxx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: unknown;
}

// =============================================================================
// CLASSE ERRORE CUSTOM
// =============================================================================

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, statusCode: number = 400, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    
    // Mantieni stack trace
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

// =============================================================================
// ERROR FACTORY
// =============================================================================

export const Errors = {
  // Auth
  authRequired: () => new ApiError(ErrorCode.AUTH_REQUIRED, 'Autenticazione richiesta', 401),
  authInvalid: () => new ApiError(ErrorCode.AUTH_INVALID, 'Credenziali non valide', 401),
  authExpired: () => new ApiError(ErrorCode.AUTH_EXPIRED, 'Sessione scaduta', 401),
  authForbidden: (msg?: string) => new ApiError(ErrorCode.AUTH_FORBIDDEN, msg || 'Non autorizzato', 403),
  
  // Validation
  validationError: (details: unknown) => new ApiError(ErrorCode.VALIDATION_ERROR, 'Dati non validi', 400, details),
  invalidInput: (field: string) => new ApiError(ErrorCode.INVALID_INPUT, `Campo non valido: ${field}`, 400),
  missingField: (field: string) => new ApiError(ErrorCode.MISSING_FIELD, `Campo richiesto: ${field}`, 400),
  invalidFormat: (field: string, expected: string) => 
    new ApiError(ErrorCode.INVALID_FORMAT, `Formato non valido per ${field}. Atteso: ${expected}`, 400),
  
  // Database
  dbConnection: () => new ApiError(ErrorCode.DB_CONNECTION, 'Errore connessione database', 503),
  dbQuery: (msg?: string) => new ApiError(ErrorCode.DB_QUERY, msg || 'Errore query database', 500),
  dbNotFound: (entity: string) => new ApiError(ErrorCode.DB_NOT_FOUND, `${entity} non trovato/a`, 404),
  dbDuplicate: (field: string) => new ApiError(ErrorCode.DB_DUPLICATE, `${field} già esistente`, 409),
  
  // Business logic
  notFound: (entity: string) => new ApiError(ErrorCode.NOT_FOUND, `${entity} non trovato/a`, 404),
  alreadyExists: (entity: string) => new ApiError(ErrorCode.ALREADY_EXISTS, `${entity} già esistente`, 409),
  notAllowed: (action: string) => new ApiError(ErrorCode.NOT_ALLOWED, `Azione non consentita: ${action}`, 403),
  limitExceeded: (limit: string) => new ApiError(ErrorCode.LIMIT_EXCEEDED, `Limite superato: ${limit}`, 429),
  conflict: (msg: string) => new ApiError(ErrorCode.CONFLICT, msg, 409),
  
  // External
  emailFailed: () => new ApiError(ErrorCode.EMAIL_FAILED, 'Errore invio email', 500),
  apiTimeout: () => new ApiError(ErrorCode.API_TIMEOUT, 'Timeout servizio esterno', 504),
  externalError: (service: string) => new ApiError(ErrorCode.EXTERNAL_ERROR, `Errore servizio: ${service}`, 502),
  
  // Server
  internal: (msg?: string) => new ApiError(ErrorCode.INTERNAL_ERROR, msg || 'Errore interno del server', 500),
  notImplemented: () => new ApiError(ErrorCode.NOT_IMPLEMENTED, 'Funzionalità non implementata', 501),
  serviceUnavailable: () => new ApiError(ErrorCode.SERVICE_UNAVAILABLE, 'Servizio temporaneamente non disponibile', 503),
};

// =============================================================================
// ERROR HANDLER
// =============================================================================

/**
 * Gestisce errori e restituisce risposta appropriata
 */
export function handleError(error: unknown): NextResponse {
  // Log errore in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', error);
  }

  // ApiError custom
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && error.details ? { details: error.details } : {}),
      },
      { status: error.statusCode }
    );
  }

  // Zod validation error
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Dati non validi',
        code: ErrorCode.VALIDATION_ERROR,
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Errore connessione database',
        code: ErrorCode.DB_CONNECTION,
      },
      { status: 503 }
    );
  }

  // Error standard
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Errore interno del server',
        code: ErrorCode.INTERNAL_ERROR,
      },
      { status: 500 }
    );
  }

  // Errore sconosciuto
  return NextResponse.json(
    {
      success: false,
      error: 'Errore sconosciuto',
      code: ErrorCode.INTERNAL_ERROR,
    },
    { status: 500 }
  );
}

/**
 * Gestisce errori Prisma specifici
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    case 'P2002': // Unique constraint violation
      const target = (error.meta?.target as string[])?.join(', ') || 'campo';
      return NextResponse.json(
        {
          success: false,
          error: `${target} già esistente`,
          code: ErrorCode.DB_DUPLICATE,
        },
        { status: 409 }
      );

    case 'P2025': // Record not found
      return NextResponse.json(
        {
          success: false,
          error: 'Record non trovato',
          code: ErrorCode.DB_NOT_FOUND,
        },
        { status: 404 }
      );

    case 'P2003': // Foreign key constraint violation
      return NextResponse.json(
        {
          success: false,
          error: 'Riferimento non valido',
          code: ErrorCode.DB_CONSTRAINT,
        },
        { status: 400 }
      );

    case 'P2014': // Relation violation
      return NextResponse.json(
        {
          success: false,
          error: 'Operazione non consentita: relazione esistente',
          code: ErrorCode.CONFLICT,
        },
        { status: 409 }
      );

    default:
      return NextResponse.json(
        {
          success: false,
          error: 'Errore database',
          code: ErrorCode.DB_QUERY,
          ...(process.env.NODE_ENV === 'development' ? { details: error.code } : {}),
        },
        { status: 500 }
      );
  }
}

// =============================================================================
// WRAPPER PER API ROUTE
// =============================================================================

type ApiHandler = (request: Request) => Promise<NextResponse>;

/**
 * Wrapper che gestisce automaticamente gli errori nelle API route
 */
export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Try-catch wrapper per operazioni async
 */
export async function tryCatch<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<{ data: T; error: null } | { data: null; error: ApiError }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return { data: null, error };
    }
    return { 
      data: null, 
      error: Errors.internal(errorMessage || 'Operazione fallita') 
    };
  }
}

export default {
  ErrorCode,
  ApiError,
  Errors,
  handleError,
  withErrorHandler,
  tryCatch,
};
