// =============================================================================
// API DEBUG ENVIRONMENT - DOTT. BERNARDO GIAMMETTA
// Endpoint per verificare quali variabili ambiente sono configurate
// PROTETTO: Solo account admin possono accedere
// =============================================================================

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isMasterAccount } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  // SICUREZZA: Solo admin può vedere info debug
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isMasterAccount(session.user.email)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  // Verifica quali variabili sono presenti (NON mostra i valori per sicurezza)
  const envStatus = {
    // Database
    DATABASE_URL: !!process.env.DATABASE_URL,
    DATABASE_URL_preview: process.env.DATABASE_URL 
      ? `${process.env.DATABASE_URL.substring(0, 20)}...` 
      : 'NON CONFIGURATA',
    
    // OpenRouter (NutriBot)
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    OPENROUTER_API_KEY_preview: process.env.OPENROUTER_API_KEY 
      ? `${process.env.OPENROUTER_API_KEY.substring(0, 15)}...${process.env.OPENROUTER_API_KEY.slice(-5)}` 
      : 'NON CONFIGURATA',
    
    // NextAuth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NON CONFIGURATA',
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    
    // Google OAuth
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_ID_preview: process.env.GOOGLE_CLIENT_ID 
      ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` 
      : 'NON CONFIGURATA',
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    
    // Optional
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NON CONFIGURATA',
    
    // Info sistema
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  // Calcola quante variabili critiche mancano
  const criticalMissing = [];
  if (!process.env.OPENROUTER_API_KEY) criticalMissing.push('OPENROUTER_API_KEY');
  if (!process.env.NEXTAUTH_SECRET) criticalMissing.push('NEXTAUTH_SECRET');
  if (!process.env.NEXTAUTH_URL) criticalMissing.push('NEXTAUTH_URL');
  if (!process.env.GOOGLE_CLIENT_ID) criticalMissing.push('GOOGLE_CLIENT_ID');
  if (!process.env.GOOGLE_CLIENT_SECRET) criticalMissing.push('GOOGLE_CLIENT_SECRET');
  if (!process.env.DATABASE_URL) criticalMissing.push('DATABASE_URL');

  return NextResponse.json({
    status: criticalMissing.length === 0 ? 'OK' : 'MISSING_ENV_VARS',
    criticalMissing,
    message: criticalMissing.length > 0 
      ? `Mancano ${criticalMissing.length} variabili critiche su Amplify!` 
      : 'Tutte le variabili critiche sono configurate',
    envStatus,
    instructions: criticalMissing.length > 0 ? {
      step1: 'Vai su AWS Amplify Console → la tua app',
      step2: 'Clicca su "Environment variables"',
      step3: 'Aggiungi le variabili mancanti',
      step4: 'Clicca "Save" e poi "Redeploy"',
    } : null,
  });
}
