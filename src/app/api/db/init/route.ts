// =============================================================================
// API ENDPOINT INIZIALIZZAZIONE DATABASE - DOTT. BERNARDO GIAMMETTA
// Endpoint per verificare/inizializzare la connessione al database
// Chiamato al primo avvio per assicurarsi che le tabelle esistano
// =============================================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Forza rendering dinamico
export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Verifica stato database
// =============================================================================

export async function GET() {
  try {
    // Tenta una query semplice per verificare la connessione
    const result = await db.$queryRaw`SELECT 1 as connected`;
    
    // Conta gli utenti per verificare che le tabelle esistano
    const userCount = await db.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connesso e funzionante',
      stats: {
        connected: true,
        userCount,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Database init error:', error);
    
    // Identifica il tipo di errore
    let errorType = 'unknown';
    let suggestion = '';
    
    if (error.code === 'P1001') {
      errorType = 'connection_failed';
      suggestion = 'Verifica che DATABASE_URL sia corretto e che il database sia raggiungibile';
    } else if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      errorType = 'tables_missing';
      suggestion = 'Le tabelle non esistono. Esegui prisma db push da CloudShell o EC2';
    } else if (error.code === 'P1000') {
      errorType = 'auth_failed';
      suggestion = 'Credenziali database non valide. Verifica username e password';
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType,
      suggestion,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// =============================================================================
// POST - Tenta di creare le tabelle (solo in development)
// =============================================================================

export async function POST() {
  // Disabilitato in produzione per sicurezza
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      error: 'Operazione non permessa in produzione',
      suggestion: 'Usa AWS CloudShell o EC2 per eseguire prisma db push'
    }, { status: 403 });
  }
  
  return NextResponse.json({
    success: false,
    error: 'Usa prisma db push manualmente per creare le tabelle'
  }, { status: 400 });
}
