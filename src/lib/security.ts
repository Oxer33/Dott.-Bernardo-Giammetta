// =============================================================================
// SECURITY UTILITIES - DOTT. BERNARDO GIAMMETTA
// Funzioni per sicurezza, sanitizzazione, validazione input
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// SANITIZZAZIONE INPUT
// =============================================================================

/**
 * Sanitizza una stringa rimuovendo caratteri pericolosi
 * Previene XSS e injection attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    // Rimuovi tag HTML
    .replace(/<[^>]*>/g, '')
    // Escape caratteri speciali HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Rimuovi caratteri di controllo
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitizza un oggetto ricorsivamente
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Valida e sanitizza email
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') return null;
  
  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) return null;
  if (sanitized.length > 254) return null; // RFC 5321
  
  return sanitized;
}

/**
 * Valida e sanitizza telefono italiano
 */
export function sanitizePhone(phone: string): string | null {
  if (typeof phone !== 'string') return null;
  
  // Rimuovi tutto tranne numeri e +
  const sanitized = phone.replace(/[^\d+]/g, '');
  
  // Verifica formato italiano
  const phoneRegex = /^(\+39)?3\d{8,9}$/;
  if (!phoneRegex.test(sanitized)) return null;
  
  return sanitized;
}

/**
 * Sanitizza URL (previene open redirect)
 */
export function sanitizeUrl(url: string, allowedHosts: string[] = []): string | null {
  if (typeof url !== 'string') return null;
  
  try {
    const parsed = new URL(url, 'https://localhost');
    
    // Se è un path relativo, è OK
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
    
    // Verifica host consentiti
    if (allowedHosts.length > 0 && !allowedHosts.includes(parsed.host)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

// =============================================================================
// RATE LIMITING
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limit store (per produzione usare Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Verifica rate limit per un identificatore
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  // Prima richiesta o finestra scaduta
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }
  
  // Ancora nella finestra
  if (entry.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: entry.resetTime - now 
    };
  }
  
  // Incrementa contatore
  entry.count++;
  rateLimitStore.set(identifier, entry);
  
  return { 
    allowed: true, 
    remaining: maxRequests - entry.count, 
    resetIn: entry.resetTime - now 
  };
}

/**
 * Pulisce entries scadute (chiamare periodicamente)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, entry] of entries) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup automatico ogni 5 minuti
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

// =============================================================================
// AUTENTICAZIONE E AUTORIZZAZIONE
// =============================================================================

export interface AuthResult {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    isWhitelisted: boolean;
  };
  isAdmin: boolean;
  isMaster: boolean;
  error?: string;
}

/**
 * Verifica autenticazione e permessi
 */
export async function verifyAuth(request?: NextRequest): Promise<AuthResult> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { 
        authenticated: false, 
        isAdmin: false, 
        isMaster: false,
        error: 'Non autenticato' 
      };
    }
    
    const isAdmin = session.user.role === 'ADMIN';
    const isMaster = isMasterAccount(session.user.email);
    
    return {
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name,
        role: session.user.role || 'PATIENT',
        isWhitelisted: session.user.isWhitelisted || false,
      },
      isAdmin,
      isMaster,
    };
  } catch (error) {
    return { 
      authenticated: false, 
      isAdmin: false, 
      isMaster: false,
      error: 'Errore verifica autenticazione' 
    };
  }
}

/**
 * Middleware per richiedere autenticazione
 */
export async function requireAuth(): Promise<AuthResult | NextResponse> {
  const auth = await verifyAuth();
  
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Non autenticato' },
      { status: 401 }
    );
  }
  
  return auth;
}

/**
 * Middleware per richiedere ruolo admin
 */
export async function requireAdmin(): Promise<AuthResult | NextResponse> {
  const auth = await verifyAuth();
  
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Non autenticato' },
      { status: 401 }
    );
  }
  
  if (!auth.isAdmin && !auth.isMaster) {
    return NextResponse.json(
      { success: false, error: 'Non autorizzato' },
      { status: 403 }
    );
  }
  
  return auth;
}

// =============================================================================
// VALIDAZIONE REQUEST
// =============================================================================

/**
 * Estrai e valida IP dalla request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return 'unknown';
}

/**
 * Verifica Content-Type
 */
export function verifyContentType(
  request: NextRequest, 
  expected: string = 'application/json'
): boolean {
  const contentType = request.headers.get('content-type');
  return contentType?.includes(expected) || false;
}

/**
 * Verifica dimensione body
 */
export function verifyBodySize(
  body: string, 
  maxSizeKB: number = 100
): boolean {
  const sizeBytes = new Blob([body]).size;
  return sizeBytes <= maxSizeKB * 1024;
}

// =============================================================================
// RESPONSE HELPERS
// =============================================================================

/**
 * Risposta di errore standardizzata
 */
export function errorResponse(
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      ...(details && process.env.NODE_ENV === 'development' ? { details } : {})
    },
    { status }
  );
}

/**
 * Risposta di successo standardizzata
 */
export function successResponse<T>(
  data: T,
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    ...(message ? { message } : {}),
  });
}

// =============================================================================
// LOGGING SICUREZZA
// =============================================================================

interface SecurityLog {
  timestamp: Date;
  type: 'auth_failure' | 'rate_limit' | 'invalid_input' | 'unauthorized';
  ip: string;
  endpoint: string;
  details?: string;
}

const securityLogs: SecurityLog[] = [];
const MAX_LOGS = 1000;

/**
 * Registra evento di sicurezza
 */
export function logSecurityEvent(
  type: SecurityLog['type'],
  ip: string,
  endpoint: string,
  details?: string
): void {
  securityLogs.push({
    timestamp: new Date(),
    type,
    ip,
    endpoint,
    details,
  });
  
  // Mantieni solo gli ultimi MAX_LOGS
  if (securityLogs.length > MAX_LOGS) {
    securityLogs.shift();
  }
  
  // Log in console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[SECURITY] ${type} - IP: ${ip} - ${endpoint}`, details || '');
  }
}

/**
 * Ottieni log sicurezza recenti (solo admin)
 */
export function getSecurityLogs(limit: number = 100): SecurityLog[] {
  return securityLogs.slice(-limit);
}

// =============================================================================
// CSRF PROTECTION
// =============================================================================

/**
 * Genera token CSRF
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica origine della richiesta
 */
export function verifyOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  if (!origin) return true; // Same-origin requests non hanno origin header
  
  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export default {
  sanitizeString,
  sanitizeObject,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  checkRateLimit,
  verifyAuth,
  requireAuth,
  requireAdmin,
  getClientIP,
  verifyContentType,
  verifyBodySize,
  errorResponse,
  successResponse,
  logSecurityEvent,
  verifyOrigin,
};
