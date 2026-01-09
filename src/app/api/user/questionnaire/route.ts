// =============================================================================
// API: QUESTIONARIO PRIMA VISITA - DOTT. BERNARDO GIAMMETTA
// Endpoint per salvare/recuperare questionari prima visita
// I questionari NON sono modificabili, si può solo crearne uno nuovo
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { extractDietType } from '@/lib/questionnaire-config';

// Forza rendering dinamico
export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Recupera tutti i questionari dell'utente
// =============================================================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Trova utente
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Recupera tutti i questionari dell'utente (ordinati dal più recente)
    const questionnaires = await db.questionnaire.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        dietType: true,
        commonAnswers: true,
        dietAnswers: true,
        billingData: true,
        privacyConsent: true,
        createdAt: true,
      },
    });

    // Parsa i JSON per ogni questionario
    const parsed = questionnaires.map(q => ({
      ...q,
      commonAnswers: JSON.parse(q.commonAnswers),
      dietAnswers: JSON.parse(q.dietAnswers),
      billingData: JSON.parse(q.billingData),
    }));

    return NextResponse.json({
      success: true,
      questionnaires: parsed,
      hasQuestionnaire: parsed.length > 0,
      latestQuestionnaire: parsed[0] || null,
    });

  } catch (error) {
    console.error('Errore recupero questionari:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero dati' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Crea nuovo questionario (NON modifica, crea sempre nuovo)
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Leggi dati dal body
    const body = await request.json();
    const { 
      dietTypeAnswer,  // Risposta alla domanda 18
      commonAnswers,   // Risposte domande 5-17
      dietAnswers,     // Risposte domande specifiche per dieta
      billingData,     // Dati fatturazione
      privacyConsent,  // Autorizzazione privacy
      profileData,     // Dati profilo modificabili (nome, telefono, data nascita)
    } = body;

    // Validazione base
    if (!dietTypeAnswer || !commonAnswers || !dietAnswers || !billingData) {
      return NextResponse.json(
        { success: false, error: 'Dati incompleti' },
        { status: 400 }
      );
    }

    if (!privacyConsent) {
      return NextResponse.json(
        { success: false, error: 'È necessario autorizzare il trattamento dei dati' },
        { status: 400 }
      );
    }

    // Estrai tipo dieta dalla risposta
    const dietType = extractDietType(dietTypeAnswer);
    if (!dietType) {
      return NextResponse.json(
        { success: false, error: 'Stile alimentare non valido' },
        { status: 400 }
      );
    }

    // Trova utente
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Crea nuovo questionario (NON modifica esistenti)
    const questionnaire = await db.questionnaire.create({
      data: {
        userId: user.id,
        dietType,
        commonAnswers: JSON.stringify(commonAnswers),
        dietAnswers: JSON.stringify(dietAnswers),
        billingData: JSON.stringify(billingData),
        privacyConsent: true,
      },
    });

    // Aggiorna dati profilo e fatturazione nel profilo utente
    const updateData: Record<string, unknown> = {};
    
    // Dati profilo modificabili
    if (profileData?.name) updateData.name = profileData.name;
    if (profileData?.phone) updateData.phone = profileData.phone;
    if (profileData?.birthDate) updateData.birthDate = new Date(profileData.birthDate);
    
    // Dati fatturazione
    if (billingData.birthPlace) updateData.birthPlace = billingData.birthPlace;
    if (billingData.address) updateData.address = billingData.address;
    if (billingData.addressNumber) updateData.addressNumber = billingData.addressNumber;
    if (billingData.cap) updateData.cap = billingData.cap;
    if (billingData.city) updateData.city = billingData.city;
    if (billingData.codiceFiscale) updateData.codiceFiscale = billingData.codiceFiscale;

    if (Object.keys(updateData).length > 0) {
      await db.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Questionario salvato con successo',
      questionnaireId: questionnaire.id,
      dietType,
    });

  } catch (error: unknown) {
    console.error('Errore salvataggio questionario:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel salvataggio' },
      { status: 500 }
    );
  }
}
