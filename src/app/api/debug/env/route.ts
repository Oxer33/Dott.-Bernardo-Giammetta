// =============================================================================
// API DEBUG ENVIRONMENT - DOTT. BERNARDO GIAMMETTA
// Endpoint per verificare quali variabili ambiente sono configurate
// TEMPORANEAMENTE PUBBLICO per debug Cognito - DUE POOL SEPARATI
// =============================================================================

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // ==========================================================================
  // COGNITO ADMIN - Pool per staff medico (accesso completo)
  // ==========================================================================
  const cognitoAdminStatus = {
    COGNITO_ADMIN_CLIENT_ID: !!process.env.COGNITO_ADMIN_CLIENT_ID,
    COGNITO_ADMIN_CLIENT_ID_preview: process.env.COGNITO_ADMIN_CLIENT_ID 
      ? `${process.env.COGNITO_ADMIN_CLIENT_ID.substring(0, 10)}...` 
      : 'NON CONFIGURATA',
    COGNITO_ADMIN_CLIENT_SECRET: !!process.env.COGNITO_ADMIN_CLIENT_SECRET,
    COGNITO_ADMIN_USER_POOL_ID: process.env.COGNITO_ADMIN_USER_POOL_ID || 'NON CONFIGURATA',
    COGNITO_ADMIN_ISSUER: process.env.COGNITO_ADMIN_ISSUER || 'NON CONFIGURATA',
    admin_provider_will_load: !!(
      process.env.COGNITO_ADMIN_CLIENT_ID && 
      process.env.COGNITO_ADMIN_ISSUER
    ),
  };

  // ==========================================================================
  // COGNITO PATIENTS - Pool per pazienti (regole prenotazione)
  // ==========================================================================
  const cognitoPatientsStatus = {
    COGNITO_PATIENTS_CLIENT_ID: !!process.env.COGNITO_PATIENTS_CLIENT_ID,
    COGNITO_PATIENTS_CLIENT_ID_preview: process.env.COGNITO_PATIENTS_CLIENT_ID 
      ? `${process.env.COGNITO_PATIENTS_CLIENT_ID.substring(0, 10)}...` 
      : 'NON CONFIGURATA',
    COGNITO_PATIENTS_CLIENT_SECRET: !!process.env.COGNITO_PATIENTS_CLIENT_SECRET,
    COGNITO_PATIENTS_USER_POOL_ID: process.env.COGNITO_PATIENTS_USER_POOL_ID || 'NON CONFIGURATA',
    COGNITO_PATIENTS_ISSUER: process.env.COGNITO_PATIENTS_ISSUER || 'NON CONFIGURATA',
    patients_provider_will_load: !!(
      process.env.COGNITO_PATIENTS_CLIENT_ID && 
      process.env.COGNITO_PATIENTS_ISSUER
    ),
  };

  // Variabili mancanti
  const adminMissing = [];
  if (!process.env.COGNITO_ADMIN_CLIENT_ID) adminMissing.push('COGNITO_ADMIN_CLIENT_ID');
  if (!process.env.COGNITO_ADMIN_ISSUER) adminMissing.push('COGNITO_ADMIN_ISSUER');

  const patientsMissing = [];
  if (!process.env.COGNITO_PATIENTS_CLIENT_ID) patientsMissing.push('COGNITO_PATIENTS_CLIENT_ID');
  if (!process.env.COGNITO_PATIENTS_ISSUER) patientsMissing.push('COGNITO_PATIENTS_ISSUER');

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

  // Status generale
  const allConfigured = adminMissing.length === 0 && patientsMissing.length === 0;

  return NextResponse.json({
    // STATUS GENERALE
    status: allConfigured ? '✅ TUTTO CONFIGURATO' : '❌ CONFIGURAZIONE INCOMPLETA',
    
    // ADMIN POOL STATUS
    admin_status: adminMissing.length === 0 ? '✅ PRONTO' : '❌ INCOMPLETO',
    admin_missing: adminMissing,
    cognitoAdminStatus,
    
    // PATIENTS POOL STATUS
    patients_status: patientsMissing.length === 0 ? '✅ PRONTO' : '❌ INCOMPLETO',
    patients_missing: patientsMissing,
    cognitoPatientsStatus,
    
    // Altre info
    envStatus,
    
    // Istruzioni se mancano variabili
    fix_required: !allConfigured ? {
      step1: 'Vai su AWS Amplify Console',
      step2: 'Environment variables',
      step3: 'Aggiungi le variabili mancanti:',
      admin_variables: {
        COGNITO_ADMIN_CLIENT_ID: '70ks8clo1fo29shce517nc082v',
        COGNITO_ADMIN_USER_POOL_ID: 'eu-north-1_essCzamqc',
        COGNITO_ADMIN_ISSUER: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_essCzamqc',
      },
      patients_variables: {
        COGNITO_PATIENTS_CLIENT_ID: '1ecaje9g00o1kpsl3jvmll456q',
        COGNITO_PATIENTS_USER_POOL_ID: 'eu-north-1_Xi3V8ZVoy',
        COGNITO_PATIENTS_ISSUER: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Xi3V8ZVoy',
      },
      step4: 'Salva e Redeploy',
    } : null,
  });
}
