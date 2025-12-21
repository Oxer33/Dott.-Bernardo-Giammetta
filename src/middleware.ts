// =============================================================================
// MIDDLEWARE SICUREZZA GLOBALE - DOTT. BERNARDO GIAMMETTA
// Gestisce rate limiting, protezione route, e sicurezza generale
// =============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =============================================================================
// RATE LIMITING IN-MEMORY
// Nota: In produzione con multiple istanze, usare Redis
// =============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configurazione rate limits per tipo di route
const RATE_LIMITS = {
  api: { limit: 100, window: 60 * 1000 },      // 100 req/min per API generiche
  auth: { limit: 10, window: 60 * 1000 },      // 10 req/min per auth (anti-brute force)
  chat: { limit: 20, window: 60 * 1000 },      // 20 req/min per chat (già in route)
  admin: { limit: 50, window: 60 * 1000 },     // 50 req/min per admin
};

function getRateLimitConfig(pathname: string) {
  if (pathname.includes('/api/auth')) return RATE_LIMITS.auth;
  if (pathname.includes('/api/chat')) return RATE_LIMITS.chat;
  if (pathname.includes('/api/admin')) return RATE_LIMITS.admin;
  if (pathname.startsWith('/api/')) return RATE_LIMITS.api;
  return null; // No rate limit per pagine statiche
}

function checkRateLimit(ip: string, config: { limit: number; window: number }): boolean {
  const now = Date.now();
  const key = `${ip}`;
  const record = rateLimitMap.get(key);
  
  // Cleanup vecchi record ogni tanto
  if (rateLimitMap.size > 10000) {
    const cutoff = now - 300000; // 5 minuti
    rateLimitMap.forEach((v, k) => {
      if (v.resetTime < cutoff) rateLimitMap.delete(k);
    });
  }
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.window });
    return true;
  }
  
  if (record.count >= config.limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// =============================================================================
// MIDDLEWARE PRINCIPALE
// =============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ottieni IP client
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';
  
  // Rate limiting per API
  const rateLimitConfig = getRateLimitConfig(pathname);
  if (rateLimitConfig) {
    const allowed = checkRateLimit(ip, rateLimitConfig);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova tra un minuto.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': rateLimitConfig.limit.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }
  }
  
  // Blocca accesso diretto a file sensibili
  const blockedPaths = [
    '/.env',
    '/.git',
    '/prisma/schema.prisma',
    '/package.json',
    '/tsconfig.json',
  ];
  
  if (blockedPaths.some(blocked => pathname.startsWith(blocked))) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }
  
  // Aggiungi header di sicurezza alla response
  const response = NextResponse.next();
  
  // Request ID per tracking
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);
  
  return response;
}

// =============================================================================
// CONFIGURAZIONE MATCHER
// Specifica su quali route applicare il middleware
// =============================================================================

export const config = {
  matcher: [
    // Applica a tutte le API
    '/api/:path*',
    // Escludi static files e immagini
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
