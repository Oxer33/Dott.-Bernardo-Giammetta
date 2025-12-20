// =============================================================================
// DATABASE CLIENT - DOTT. BERNARDO GIAMMETTA
// Singleton pattern per Prisma client (evita connessioni multiple in dev)
// IMPORTANTE: Usa datasources.db.url per passare DATABASE_URL a runtime
// Questo risolve il problema su AWS Amplify dove la variabile è disponibile
// solo a runtime e non a build time
// =============================================================================

import { PrismaClient } from '@prisma/client';

// Dichiarazione globale per il singleton in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Funzione per creare il client Prisma con URL runtime
function createPrismaClient(): PrismaClient {
  // Legge DATABASE_URL a runtime (non a build time)
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL non configurata!');
    // Ritorna un client che fallirà alle query - meglio di un crash
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    // CRITICO: Passa l'URL a runtime invece che usare quello dello schema
    datasources: databaseUrl ? {
      db: {
        url: databaseUrl,
      },
    } : undefined,
  });
}

// Crea o riusa il client Prisma
export const db = globalThis.prisma || createPrismaClient();

// In development, salva il client nel global per evitare connessioni multiple
// durante hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export default db;
