// =============================================================================
// DATABASE UTILITIES - DOTT. BERNARDO GIAMMETTA
// Funzioni per gestione database con retry, transazioni, health check
// =============================================================================

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

// =============================================================================
// RETRY LOGIC
// =============================================================================

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 100,
  maxDelay: 5000,
  backoffMultiplier: 2,
};

/**
 * Esegue operazione database con retry automatico
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Non ritentare per errori non recuperabili
      if (!isRetryableError(error)) {
        throw error;
      }

      // Log tentativo fallito
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[DB] Tentativo ${attempt}/${opts.maxRetries} fallito:`, lastError.message);
      }

      // Se è l'ultimo tentativo, lancia errore
      if (attempt === opts.maxRetries) {
        throw lastError;
      }

      // Attendi prima del prossimo tentativo
      await sleep(delay);
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError;
}

/**
 * Verifica se l'errore è recuperabile con retry
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Errori di connessione/timeout sono recuperabili
    const retryableCodes = ['P1001', 'P1002', 'P1008', 'P1017'];
    return retryableCodes.includes(error.code);
  }
  
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true; // Errori di inizializzazione sono recuperabili
  }
  
  if (error instanceof Error) {
    // Errori di rete sono recuperabili
    const message = error.message.toLowerCase();
    return message.includes('connection') || 
           message.includes('timeout') ||
           message.includes('econnrefused') ||
           message.includes('econnreset');
  }
  
  return false;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// TRANSAZIONI
// =============================================================================

/**
 * Esegue operazioni in una transazione con retry
 */
export async function withTransaction<T>(
  operations: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: { timeout?: number; maxWait?: number }
): Promise<T> {
  return withRetry(() => 
    db.$transaction(operations, {
      timeout: options?.timeout || 10000,
      maxWait: options?.maxWait || 5000,
    })
  );
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

export interface DbHealthStatus {
  connected: boolean;
  latencyMs: number;
  error?: string;
}

/**
 * Verifica stato connessione database
 */
export async function checkDbHealth(): Promise<DbHealthStatus> {
  const start = Date.now();
  
  try {
    // Query semplice per verificare connessione
    await db.$queryRaw`SELECT 1`;
    
    return {
      connected: true,
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
    };
  }
}

/**
 * Verifica e riconnette se necessario
 */
export async function ensureConnection(): Promise<boolean> {
  const health = await checkDbHealth();
  
  if (!health.connected) {
    try {
      await db.$connect();
      return true;
    } catch {
      return false;
    }
  }
  
  return true;
}

// =============================================================================
// QUERY HELPERS
// =============================================================================

/**
 * Paginazione sicura
 */
export function safePagination(page?: number, limit?: number): { skip: number; take: number } {
  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safeLimit = Math.min(100, Math.max(1, Math.floor(Number(limit) || 10)));
  
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}

/**
 * Ordinamento sicuro
 */
export function safeOrderBy<T extends string>(
  field?: string,
  direction?: string,
  allowedFields: T[] = []
): { [key: string]: 'asc' | 'desc' } | undefined {
  if (!field) return undefined;
  
  // Verifica che il campo sia consentito
  if (allowedFields.length > 0 && !allowedFields.includes(field as T)) {
    return undefined;
  }
  
  const safeDirection = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';
  
  return { [field]: safeDirection };
}

/**
 * Filtro di ricerca sicuro (previene SQL injection anche se Prisma già lo fa)
 */
export function safeSearch(query?: string): string | undefined {
  if (!query || typeof query !== 'string') return undefined;
  
  // Rimuovi caratteri speciali per ricerche LIKE
  return query
    .replace(/[%_\\]/g, '') // Rimuovi wildcard e escape char
    .trim()
    .slice(0, 100); // Limita lunghezza
}

/**
 * Filtro data sicuro
 */
export function safeDateFilter(
  dateString?: string
): Date | undefined {
  if (!dateString) return undefined;
  
  const date = new Date(dateString);
  
  // Verifica che la data sia valida
  if (isNaN(date.getTime())) return undefined;
  
  // Verifica che la data sia in un range ragionevole (1900-2100)
  const year = date.getFullYear();
  if (year < 1900 || year > 2100) return undefined;
  
  return date;
}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Esegue operazioni in batch per evitare timeout
 */
export async function batchOperation<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(operation));
    results.push(...batchResults);
    
    // Piccola pausa tra batch per non sovraccaricare
    if (i + batchSize < items.length) {
      await sleep(10);
    }
  }
  
  return results;
}

/**
 * Upsert sicuro con gestione race condition
 */
export async function safeUpsert<T>(
  findOperation: () => Promise<T | null>,
  createOperation: () => Promise<T>,
  updateOperation: (existing: T) => Promise<T>
): Promise<T> {
  return withRetry(async () => {
    const existing = await findOperation();
    
    if (existing) {
      return updateOperation(existing);
    }
    
    try {
      return await createOperation();
    } catch (error) {
      // Se fallisce per duplicato (race condition), riprova find+update
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const found = await findOperation();
        if (found) {
          return updateOperation(found);
        }
      }
      throw error;
    }
  });
}

// =============================================================================
// CLEANUP
// =============================================================================

/**
 * Disconnette dal database (per cleanup)
 */
export async function disconnectDb(): Promise<void> {
  await db.$disconnect();
}

// Gestione graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await disconnectDb();
  });
}

export default {
  withRetry,
  withTransaction,
  checkDbHealth,
  ensureConnection,
  safePagination,
  safeOrderBy,
  safeSearch,
  safeDateFilter,
  batchOperation,
  safeUpsert,
  disconnectDb,
};
