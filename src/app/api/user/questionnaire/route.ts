// =============================================================================
// API: QUESTIONARIO UTENTE - DOTT. BERNARDO GIAMMETTA
// Endpoint per salvare/recuperare il questionario alimentare
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Forza rendering dinamico
export const dynamic = 'force-dynamic';

// =============================================================================
// POST - Salva questionario
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticazione
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Leggi dati dal body
    const { answers } = await request.json();

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Dati non validi' },
        { status: 400 }
      );
    }

    // Per ora salviamo solo nel localStorage lato client
    // In futuro si può aggiungere salvataggio nel database
    // quando le tabelle saranno create

    return NextResponse.json({
      success: true,
      message: 'Questionario salvato con successo',
      answersCount: Object.keys(answers).length,
    });

  } catch (error: any) {
    console.error('Errore salvataggio questionario:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel salvataggio' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Recupera questionario salvato
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

    // Per ora restituiamo vuoto - i dati sono nel localStorage
    return NextResponse.json({
      success: true,
      answers: {},
      message: 'Questionario recuperato dal localStorage',
    });

  } catch (error) {
    console.error('Errore recupero questionario:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero dati' },
      { status: 500 }
    );
  }
}
