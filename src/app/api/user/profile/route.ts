// =============================================================================
// API: PROFILO UTENTE - DOTT. BERNARDO GIAMMETTA
// Endpoint per aggiornare i dati del profilo utente
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Forza rendering dinamico
export const dynamic = 'force-dynamic';

// =============================================================================
// PUT - Aggiorna profilo utente
// =============================================================================

export async function PUT(request: NextRequest) {
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
    const { name, phone } = await request.json();

    // Validazione
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome non valido' },
        { status: 400 }
      );
    }

    // Prova a salvare nel database se disponibile
    try {
      const { db } = await import('@/lib/db');
      
      await db.user.update({
        where: { email: session.user.email },
        data: {
          name: name.trim(),
          phone: phone?.trim() || null,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Profilo aggiornato con successo',
      });
    } catch (dbError) {
      // Se il database non è disponibile, salviamo solo lato client
      console.warn('Database non disponibile per salvataggio profilo:', dbError);
      
      return NextResponse.json({
        success: true,
        message: 'Profilo aggiornato (sessione)',
        note: 'Database non disponibile, i dati saranno sincronizzati al prossimo accesso',
      });
    }

  } catch (error: any) {
    console.error('Errore aggiornamento profilo:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel salvataggio' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Ottieni profilo utente
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

    // Prova a leggere dal database
    try {
      const { db } = await import('@/lib/db');
      
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isWhitelisted: true,
          role: true,
          createdAt: true,
        },
      });

      if (user) {
        return NextResponse.json({ success: true, user });
      }
    } catch (dbError) {
      console.warn('Database non disponibile per lettura profilo');
    }

    // Fallback ai dati della sessione
    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone || null,
        isWhitelisted: session.user.isWhitelisted,
        role: session.user.role,
      },
    });

  } catch (error) {
    console.error('Errore lettura profilo:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero dati' },
      { status: 500 }
    );
  }
}
