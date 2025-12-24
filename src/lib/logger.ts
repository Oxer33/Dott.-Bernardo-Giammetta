// =============================================================================
// LOGGER - DOTT. BERNARDO GIAMMETTA
// Sistema di logging strutturato per debug e monitoraggio
// =============================================================================

// =============================================================================
// TIPI
// =============================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

interface LoggerOptions {
  context?: string;
  enabled?: boolean;
}

// =============================================================================
// CONFIGURAZIONE
// =============================================================================

const IS_DEV = process.env.NODE_ENV === 'development';
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as LogLevel;

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Colori per console (solo dev)
const COLORS = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',
};

// =============================================================================
// CLASSE LOGGER
// =============================================================================

class Logger {
  private context: string;
  private enabled: boolean;

  constructor(options: LoggerOptions = {}) {
    this.context = options.context || 'App';
    this.enabled = options.enabled ?? true;
  }

  /**
   * Verifica se il livello di log è abilitato
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[LOG_LEVEL];
  }

  /**
   * Formatta entry di log
   */
  private formatEntry(level: LogLevel, message: string, data?: unknown, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
    };

    if (data !== undefined) {
      entry.data = data;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: IS_DEV ? error.stack : undefined,
      };
    }

    return entry;
  }

  /**
   * Output log
   */
  private output(entry: LogEntry): void {
    const prefix = IS_DEV 
      ? `${COLORS[entry.level]}[${entry.level.toUpperCase()}]${COLORS.reset} [${entry.context}]`
      : `[${entry.level.toUpperCase()}] [${entry.context}]`;

    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(message, entry.data || '');
        break;
      case 'info':
        console.info(message, entry.data || '');
        break;
      case 'warn':
        console.warn(message, entry.data || '');
        break;
      case 'error':
        console.error(message, entry.error || entry.data || '');
        break;
    }
  }

  /**
   * Log debug
   */
  debug(message: string, data?: unknown): void {
    if (!this.shouldLog('debug')) return;
    const entry = this.formatEntry('debug', message, data);
    this.output(entry);
  }

  /**
   * Log info
   */
  info(message: string, data?: unknown): void {
    if (!this.shouldLog('info')) return;
    const entry = this.formatEntry('info', message, data);
    this.output(entry);
  }

  /**
   * Log warning
   */
  warn(message: string, data?: unknown): void {
    if (!this.shouldLog('warn')) return;
    const entry = this.formatEntry('warn', message, data);
    this.output(entry);
  }

  /**
   * Log error
   */
  error(message: string, error?: Error | unknown, data?: unknown): void {
    if (!this.shouldLog('error')) return;
    const err = error instanceof Error ? error : undefined;
    const entry = this.formatEntry('error', message, data, err);
    this.output(entry);
  }

  /**
   * Crea child logger con contesto specifico
   */
  child(context: string): Logger {
    return new Logger({ 
      context: `${this.context}:${context}`,
      enabled: this.enabled,
    });
  }

  /**
   * Log tempo esecuzione
   */
  time(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(`${label} completed`, { durationMs: Math.round(duration) });
    };
  }

  /**
   * Log con timing automatico per async function
   */
  async timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const end = this.time(label);
    try {
      const result = await fn();
      end();
      return result;
    } catch (error) {
      this.error(`${label} failed`, error);
      throw error;
    }
  }
}

// =============================================================================
// ISTANZE PREDEFINITE
// =============================================================================

export const logger = new Logger({ context: 'App' });
export const apiLogger = new Logger({ context: 'API' });
export const dbLogger = new Logger({ context: 'DB' });
export const authLogger = new Logger({ context: 'Auth' });
export const emailLogger = new Logger({ context: 'Email' });

/**
 * Crea logger con contesto custom
 */
export function createLogger(context: string): Logger {
  return new Logger({ context });
}

export default logger;
