// =============================================================================
// DATABASE CLIENT - DOTT. BERNARDO GIAMMETTA
// Singleton pattern per Prisma client (evita connessioni multiple in dev)
// =============================================================================

import { PrismaClient } from '@prisma/client';

// Dichiarazione globale per il singleton in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Crea o riusa il client Prisma
export const db = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// In development, salva il client nel global per evitare connessioni multiple
// durante hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export default db;
