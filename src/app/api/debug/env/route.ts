// =============================================================================
// API DEBUG ENVIRONMENT - DOTT. BERNARDO GIAMMETTA
// Endpoint per verificare quali variabili ambiente sono configurate
// TEMPORANEAMENTE PUBBLICO per debug Cognito
// =============================================================================

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // DEBUG COGNITO - Verifica quali variabili Cognito sono presenti
  const cognitoStatus = {
    COGNITO_CLIENT_ID: !!process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_ID_preview: process.env.COGNITO_CLIENT_ID 
      ? `${process.env.COGNITO_CLIENT_ID.substring(0, 10)}...` 
      : 'NON CONFIGURATA',
    COGNITO_CLIENT_SECRET: !!process.env.COGNITO_CLIENT_SECRET,
    COGNITO_CLIENT_SECRET_preview: process.env.COGNITO_CLIENT_SECRET 
      ? `${process.env.COGNITO_CLIENT_SECRET.substring(0, 10)}...` 
      : 'NON CONFIGURATA',
    COGNITO_ISSUER: process.env.COGNITO_ISSUER || 'NON CONFIGURATA',
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || 'NON CONFIGURATA',
    
    // Calcola l'issuer che verrà usato
    computed_issuer: process.env.COGNITO_ISSUER || 
      (process.env.COGNITO_USER_POOL_ID 
        ? `https://cognito-idp.eu-north-1.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`
        : 'IMPOSSIBILE CALCOLARE - MANCA COGNITO_USER_POOL_ID'),
    
    // Verifica se il provider Cognito verrà caricato
    cognito_provider_will_load: !!(
      process.env.COGNITO_CLIENT_ID && 
      process.env.COGNITO_CLIENT_SECRET && 
      (process.env.COGNITO_ISSUER || process.env.COGNITO_USER_POOL_ID)
    ),
  };

  // Variabili mancanti per Cognito
  const cognitoMissing = [];
  if (!process.env.COGNITO_CLIENT_ID) cognitoMissing.push('COGNITO_CLIENT_ID');
  if (!process.env.COGNITO_CLIENT_SECRET) cognitoMissing.push('COGNITO_CLIENT_SECRET');
  if (!process.env.COGNITO_ISSUER && !process.env.COGNITO_USER_POOL_ID) {
    cognitoMissing.push('COGNITO_ISSUER o COGNITO_USER_POOL_ID');
  }

  // Altre variabili
  const envStatus = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NON CONFIGURATA',
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({
    // FOCUS PRINCIPALE: Status Cognito
    cognito_status: cognitoMissing.length === 0 ? '✅ PRONTO' : '❌ INCOMPLETO',
    cognito_missing: cognitoMissing,
    cognito_message: cognitoMissing.length > 0 
      ? `PROBLEMA: Mancano ${cognitoMissing.length} variabili Cognito su Amplify!`
      : 'Tutte le variabili Cognito sono configurate!',
    cognitoStatus,
    
    // Altre info
    envStatus,
    
    // Istruzioni se mancano variabili
    fix_required: cognitoMissing.length > 0 ? {
      step1: 'Vai su AWS Amplify Console',
      step2: 'Environment variables',
      step3: 'Aggiungi le variabili mancanti:',
      variables_to_add: {
        COGNITO_CLIENT_ID: '1ideutif218p5idkf7th8300mj',
        COGNITO_CLIENT_SECRET: 'va217ttg96cripmpuf6jn4mjh3ecr0tt30488qupb64hu79jfq1',
        COGNITO_USER_POOL_ID: 'eu-north-1_essCzamqc',
      },
      step4: 'Salva e Redeploy',
    } : null,
  });
}
