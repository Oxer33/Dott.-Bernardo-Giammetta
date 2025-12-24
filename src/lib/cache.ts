// =============================================================================
// CACHE UTILITIES - DOTT. BERNARDO GIAMMETTA
// Sistema di caching in-memory per migliorare performance
// =============================================================================

// =============================================================================
// TIPI
// =============================================================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
}

interface CacheOptions {
  ttlMs?: number;           // Time to live in milliseconds
  maxSize?: number;         // Numero massimo di entries
  staleWhileRevalidate?: boolean; // Ritorna dati stale mentre aggiorna
}

// =============================================================================
// CACHE MANAGER
// =============================================================================

class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minuti default
  private maxSize = 1000;

  /**
   * Ottieni valore dalla cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    // Verifica scadenza
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  /**
   * Imposta valore nella cache
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    // Verifica limite dimensione
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    const ttl = options.ttlMs || this.defaultTTL;
    const now = Date.now();
    
    this.cache.set(key, {
      value,
      expiresAt: now + ttl,
      createdAt: now,
    });
  }

  /**
   * Elimina entry dalla cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Elimina entries che matchano un pattern
   */
  deletePattern(pattern: string): number {
    let deleted = 0;
    const regex = new RegExp(pattern);
    
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    
    return deleted;
  }

  /**
   * Pulisce tutta la cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Pulisce entries scadute
   */
  cleanup(): number {
    let cleaned = 0;
    const now = Date.now();
    
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    return cleaned;
  }

  /**
   * Rimuovi entry più vecchia
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    const allEntries = Array.from(this.cache.entries());
    for (const [key, entry] of allEntries) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Ottieni statistiche cache
   */
  stats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  /**
   * Verifica se chiave esiste (anche se scaduta)
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
}

// Istanza singleton
export const cache = new CacheManager();

// =============================================================================
// CACHE DECORATOR / HELPER
// =============================================================================

/**
 * Wrapper per funzioni con caching automatico
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Prova a ottenere dalla cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch dati freschi
  const data = await fetcher();
  
  // Salva in cache
  cache.set(key, data, options);
  
  return data;
}

/**
 * Invalida cache per un pattern (es. dopo update)
 */
export function invalidateCache(pattern: string): number {
  return cache.deletePattern(pattern);
}

/**
 * Cache keys comuni
 */
export const CacheKeys = {
  // Agenda
  availability: (date: string) => `availability:${date}`,
  weekAvailability: (startDate: string) => `week:${startDate}`,
  
  // Users
  user: (id: string) => `user:${id}`,
  patients: () => 'patients:list',
  
  // Appointments
  appointments: (userId: string) => `appointments:${userId}`,
  appointmentsAll: () => 'appointments:all',
  
  // Stats
  stats: () => 'stats:dashboard',
  
  // Config
  holidays: (year: number) => `holidays:${year}`,
} as const;

/**
 * TTL comuni in millisecondi
 */
export const CacheTTL = {
  SHORT: 30 * 1000,        // 30 secondi
  MEDIUM: 5 * 60 * 1000,   // 5 minuti
  LONG: 30 * 60 * 1000,    // 30 minuti
  HOUR: 60 * 60 * 1000,    // 1 ora
  DAY: 24 * 60 * 60 * 1000, // 1 giorno
} as const;

// =============================================================================
// MEMOIZATION
// =============================================================================

/**
 * Memoize funzione sincrona
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyGenerator?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const memoCache = new Map<string, TReturn>();
  
  return (...args: TArgs): TReturn => {
    const key = keyGenerator 
      ? keyGenerator(...args) 
      : JSON.stringify(args);
    
    if (memoCache.has(key)) {
      return memoCache.get(key)!;
    }
    
    const result = fn(...args);
    memoCache.set(key, result);
    
    return result;
  };
}

/**
 * Memoize funzione asincrona
 */
export function memoizeAsync<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyGenerator?: (...args: TArgs) => string,
  ttlMs: number = CacheTTL.MEDIUM
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const key = keyGenerator 
      ? keyGenerator(...args) 
      : `memo:${JSON.stringify(args)}`;
    
    const cached = cache.get<TReturn>(key);
    if (cached !== null) {
      return cached;
    }
    
    const result = await fn(...args);
    cache.set(key, result, { ttlMs });
    
    return result;
  };
}

// =============================================================================
// CLEANUP AUTOMATICO
// =============================================================================

// Pulisci cache ogni 10 minuti
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

export default cache;
